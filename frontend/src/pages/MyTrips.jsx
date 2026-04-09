import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { EmptyState, InlineAlert, LoadingState } from '../components/ui/Feedback';
import { PageHeader } from '../components/ui/PageHeader';

function formatGate(g) {
  if (!g) return '—';
  return g.name || g._id;
}

function formatCar(c) {
  if (!c) return '—';
  return c.plateNumber || c._id;
}

function formatRequestedAt(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
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
      <PageHeader title="My trips" />
      {loading ? <LoadingState /> : null}
      <InlineAlert message={error} />
      {!loading && !error && trips.length === 0 ? (
        <EmptyState title="No trips yet." description="Your requested rides will appear here once you create one." />
      ) : null}
      {trips.length > 0 ? (
        <div className="trip-list" aria-label="My trips list">
          {trips.map((t) => (
            <article key={t.id} className="trip-card">
              <header className="trip-card-head">
                <p className="trip-route">
                  {formatGate(t.fromGate)} <span aria-hidden>→</span> {formatGate(t.toGate)}
                </p>
                <span className={`pill status-${(t.status || '').toLowerCase()}`}>{t.status || 'UNKNOWN'}</span>
              </header>

              <div className="trip-meta-grid">
                <div className="trip-meta-item">
                  <span className="trip-meta-label">Vehicle</span>
                  <p>{formatCar(t.car)}</p>
                </div>
                <div className="trip-meta-item">
                  <span className="trip-meta-label">Digit</span>
                  <p>{t.digit != null ? t.digit : '—'}</p>
                </div>
                <div className="trip-meta-item trip-meta-wide">
                  <span className="trip-meta-label">Requested</span>
                  <p className="muted small">{formatRequestedAt(t.createdAt)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
