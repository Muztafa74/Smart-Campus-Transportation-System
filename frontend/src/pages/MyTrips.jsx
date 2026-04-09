import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

function formatGate(g) {
  if (!g) return '—';
  return g.name || g._id;
}

function formatCar(c) {
  if (!c) return '—';
  return c.plateNumber || c._id;
}

export function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/trips/my');
        if (!cancelled) setTrips(data.trips || []);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Could not load trips');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to="/">Dashboard</Link> / My trips
      </p>
      <h1>My trips</h1>
      {loading ? <p className="muted">Loading…</p> : null}
      {error ? <div className="alert error">{error}</div> : null}
      {!loading && trips.length === 0 ? <p className="muted">No trips yet.</p> : null}
      {trips.length > 0 ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Start</th>
                <th>Destination</th>
                <th>Digit</th>
                <th>Vehicle</th>
                <th>Requested</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((t) => (
                <tr key={t.id}>
                  <td>
                    <span className={`pill status-${(t.status || '').toLowerCase()}`}>{t.status}</span>
                  </td>
                  <td>{formatGate(t.fromGate)}</td>
                  <td>{formatGate(t.toGate)}</td>
                  <td>{t.digit != null ? t.digit : '—'}</td>
                  <td>{formatCar(t.car)}</td>
                  <td className="muted small">
                    {t.createdAt ? new Date(t.createdAt).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
