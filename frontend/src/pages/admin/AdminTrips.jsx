import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';

function gateName(g) {
  if (!g) return '—';
  return g.name || g._id;
}

function carPlate(c) {
  if (!c) return '—';
  return c.plateNumber || c._id;
}

function userLabel(u) {
  if (!u) return '—';
  return u.fullName ? `${u.fullName} (${u.email})` : u.email || u.id;
}

function nextActions(status) {
  if (status === 'ASSIGNED') return [{ value: 'IN_PROGRESS', label: 'Start (in progress)' }];
  if (status === 'IN_PROGRESS') return [{ value: 'COMPLETED', label: 'Complete' }];
  return [];
}

export function AdminTrips() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setError('');
    try {
      const { data } = await api.get('/trips');
      setTrips(data.trips || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(tripId, status) {
    setBusyId(tripId);
    setError('');
    try {
      await api.patch(`/trips/${tripId}/status`, { status });
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Update failed');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="page wide">
      <p className="breadcrumb">
        <Link to="/">Dashboard</Link> / All trips
      </p>
      <h1>All trips</h1>
      {loading ? <p className="muted">Loading…</p> : null}
      {error ? <div className="alert error">{error}</div> : null}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Status</th>
              <th>User</th>
              <th>Start</th>
              <th>Destination</th>
              <th>Digit</th>
              <th>Vehicle</th>
              <th>Requested</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((t) => {
              const actions = nextActions(t.status);
              return (
                <tr key={t.id}>
                  <td>
                    <span className={`pill status-${(t.status || '').toLowerCase()}`}>{t.status}</span>
                  </td>
                  <td className="small">{userLabel(t.user)}</td>
                  <td>{gateName(t.fromGate)}</td>
                  <td>{gateName(t.toGate)}</td>
                  <td>{t.digit != null ? t.digit : '—'}</td>
                  <td>{carPlate(t.car)}</td>
                  <td className="muted small">{t.createdAt ? new Date(t.createdAt).toLocaleString() : '—'}</td>
                  <td>
                    {actions.map((a) => (
                      <button
                        key={a.value}
                        type="button"
                        className="btn primary small-btn"
                        disabled={busyId === t.id}
                        onClick={() => setStatus(t.id, a.value)}
                      >
                        {busyId === t.id ? '…' : a.label}
                      </button>
                    ))}
                    {actions.length === 0 ? <span className="muted small">—</span> : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
