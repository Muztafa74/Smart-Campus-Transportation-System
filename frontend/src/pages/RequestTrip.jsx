import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

function carLabel(c) {
  if (!c) return '';
  const m = c.model ? ` — ${c.model}` : '';
  return `${c.plateNumber}${m}`;
}

export function RequestTrip() {
  const [gates, setGates] = useState([]);
  const [cars, setCars] = useState([]);
  const [fromGateId, setFromGateId] = useState('');
  const [toGateId, setToGateId] = useState('');
  const [carId, setCarId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setError('');
      try {
        const [gatesRes, carsRes] = await Promise.all([api.get('/gates'), api.get('/cars/available')]);
        if (cancelled) return;
        const g = gatesRes.data.gates || [];
        const c = carsRes.data.cars || [];
        setGates(g);
        setCars(c);
        if (g[0]?._id) setFromGateId(g[0]._id);
        if (g[1]?._id) setToGateId(g[1]._id);
        else if (g[0]?._id) setToGateId(g[0]._id);
        if (c[0]?._id) setCarId(c[0]._id);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Could not load gates or vehicles');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!fromGateId || !toGateId) {
      setError('Choose both a start point and a destination.');
      return;
    }
    if (fromGateId === toGateId) {
      setError('Start and destination must be different gates.');
      return;
    }
    if (!carId) {
      setError('Choose a vehicle.');
      return;
    }
    setBusy(true);
    try {
      const { data } = await api.post('/trips/request', { fromGateId, toGateId, carId });
      const st = data.trip?.status;
      const plate = data.trip?.car?.plateNumber || '';
      setSuccess(`Trip booked. Status: ${st}${plate ? ` — ${plate}` : ''}.`);
      const { data: carsFresh } = await api.get('/cars/available');
      const next = carsFresh.cars || [];
      setCars(next);
      setCarId(next[0]?._id || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
    } finally {
      setBusy(false);
    }
  }

  const canSubmit = gates.length >= 2 && cars.length >= 1 && Boolean(carId);

  return (
    <div className="page narrow">
      <p className="breadcrumb">
        <Link to="/">Dashboard</Link> / Request trip
      </p>
      <h1>Request trip</h1>
      <p className="muted">
        Choose start, destination, and an available vehicle. A <strong>route digit</strong> must exist for your gate pair
        under <strong>Routes</strong>.
      </p>
      {loading ? <p className="muted">Loading gates and vehicles…</p> : null}
      {!loading && gates.length === 0 ? (
        <div className="alert error">
          No gates configured yet. An admin must add gates before you can request a trip.
        </div>
      ) : null}
      {!loading && gates.length === 1 ? (
        <div className="alert error">
          At least two gates are required (start and destination). Ask an admin to add another gate.
        </div>
      ) : null}
      {!loading && gates.length >= 2 && cars.length === 0 ? (
        <div className="alert error">
          No vehicles are available right now. Try again later or ask an admin to free or add a car.
        </div>
      ) : null}
      <form className="form" onSubmit={handleSubmit}>
        {error ? <div className="alert error">{error}</div> : null}
        {success ? <div className="alert success">{success}</div> : null}
        <label className="field">
          <span>Start (pickup)</span>
          <select value={fromGateId} onChange={(e) => setFromGateId(e.target.value)} required disabled={gates.length < 2}>
            {gates.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Destination</span>
          <select value={toGateId} onChange={(e) => setToGateId(e.target.value)} required disabled={gates.length < 2}>
            {gates.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Vehicle</span>
          <select value={carId} onChange={(e) => setCarId(e.target.value)} required disabled={cars.length === 0}>
            {cars.map((c) => (
              <option key={c._id} value={c._id}>
                {carLabel(c)}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="btn primary" disabled={busy || !canSubmit}>
          {busy ? 'Submitting…' : 'Request trip'}
        </button>
      </form>
    </div>
  );
}
