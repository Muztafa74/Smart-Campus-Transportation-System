import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';

export function AdminCars() {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [plateNumber, setPlateNumber] = useState('');
  const [model, setModel] = useState('');
  const [seats, setSeats] = useState(4);

  const load = useCallback(async () => {
    setError('');
    try {
      const { data } = await api.get('/cars');
      setCars(data.cars || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load cars');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/cars', { plateNumber, model, seats: Number(seats) || 4 });
      setPlateNumber('');
      setModel('');
      setSeats(4);
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Could not create car');
    }
  }

  async function toggleAvailable(car) {
    setError('');
    try {
      await api.patch(`/cars/${car._id}`, { isAvailable: !car.isAvailable });
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Update failed');
    }
  }

  async function removeCar(id) {
    if (!window.confirm('Delete this vehicle?')) return;
    setError('');
    try {
      await api.delete(`/cars/${id}`);
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Delete failed');
    }
  }

  return (
    <div className="page wide">
      <p className="breadcrumb">
        <Link to="/">Dashboard</Link> / Cars
      </p>
      <h1>Cars</h1>
      {error ? <div className="alert error">{error}</div> : null}

      <form className="form admin-form" onSubmit={handleCreate}>
        <h2 className="form-section-title">Add vehicle</h2>
        <div className="form-row">
          <label className="field">
            <span>Plate number</span>
            <input value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} required />
          </label>
          <label className="field">
            <span>Model</span>
            <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Shuttle A" />
          </label>
          <label className="field">
            <span>Seats</span>
            <input
              type="number"
              min={1}
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
            />
          </label>
          <button type="submit" className="btn primary align-end">
            Add car
          </button>
        </div>
      </form>

      {loading ? <p className="muted">Loading…</p> : null}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Plate</th>
              <th>Model</th>
              <th>Seats</th>
              <th>Available</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cars.map((c) => (
              <tr key={c._id}>
                <td>{c.plateNumber}</td>
                <td>{c.model || '—'}</td>
                <td>{c.seats}</td>
                <td>{c.isAvailable ? 'Yes' : 'No'}</td>
                <td>
                  <button type="button" className="btn ghost small-btn" onClick={() => toggleAvailable(c)}>
                    Toggle available
                  </button>{' '}
                  <button type="button" className="btn ghost small-btn" onClick={() => removeCar(c._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
