import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api/client';
import { EmptyTableRow } from '../../components/ui/EmptyTableRow';
import { InlineAlert, LoadingState } from '../../components/ui/Feedback';
import { PageHeader } from '../../components/ui/PageHeader';

function gateName(g) {
  if (!g) return '—';
  const name = g.name || '';
  const key = g.key || '';
  if (name && key) return `${name} (${key})`;
  return name || key || g._id;
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
      <PageHeader title="All trips" />
      {loading ? <LoadingState /> : null}
      <InlineAlert message={error} />
      <div className="table-wrap">
        <table className="table" aria-label="All trips table">
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
                  <td data-label="Status">
                    <span className={`pill status-${(t.status || '').toLowerCase()}`}>{t.status}</span>
                  </td>
                  <td data-label="User" className="small">{userLabel(t.user)}</td>
                  <td data-label="Start">{gateName(t.fromGate)}</td>
                  <td data-label="Destination">{gateName(t.toGate)}</td>
                  <td data-label="Digit">{t.digit != null ? t.digit : '—'}</td>
                  <td data-label="Vehicle">{carPlate(t.car)}</td>
                  <td data-label="Requested" className="muted small">{t.createdAt ? new Date(t.createdAt).toLocaleString() : '—'}</td>
                  <td data-label="Actions">
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
            {!loading && trips.length === 0 ? <EmptyTableRow colSpan={8} message="No trips found." /> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
