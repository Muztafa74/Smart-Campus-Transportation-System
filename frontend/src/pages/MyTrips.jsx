import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api/client';
import { getApiErrorMessage } from '../api/errors';
import { EmptyState, InlineAlert, LoadingState } from '../components/ui/Feedback';
import { PageHeader } from '../components/ui/PageHeader';

const POLL_MS = 5000;

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

function hasNonTerminalTrip(list) {
  return list.some((t) => t.status && t.status !== 'COMPLETED');
}

export function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const tripsRef = useRef(trips);
  tripsRef.current = trips;

  const loadTrips = useCallback(async ({ silent = false } = {}) => {
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
    try {
      const { data } = await api.get('/trips/my');
      setTrips(data.trips || []);
      setError('');
    } catch (err) {
      if (!silent) setError(getApiErrorMessage(err, 'Could not load your trips.'));
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrips({ silent: false });
  }, [loadTrips]);

  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === 'hidden') return;
      if (!hasNonTerminalTrip(tripsRef.current)) return;
      loadTrips({ silent: true });
    };
    const id = setInterval(tick, POLL_MS);
    const onVisible = () => {
      if (!document.hidden) tick();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [loadTrips]);

  const liveUpdating = !loading && hasNonTerminalTrip(trips);

  return (
    <div className="page">
      <PageHeader title="My trips" />
      {loading ? <LoadingState /> : null}
      <InlineAlert message={error} />
      {liveUpdating ? (
        <p className="muted small trip-live-hint" role="status">
          Trip status updates automatically — no need to refresh.
        </p>
      ) : null}
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
