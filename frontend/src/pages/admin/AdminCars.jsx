import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api/client';
import { getApiErrorMessage } from '../../api/errors';
import { EmptyTableRow } from '../../components/ui/EmptyTableRow';
import { InlineAlert, LoadingState } from '../../components/ui/Feedback';
import { PageHeader } from '../../components/ui/PageHeader';

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
      setError(getApiErrorMessage(e, 'Failed to load cars.'));
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
      setError(getApiErrorMessage(e, 'Could not create car.'));
    }
  }

  async function toggleAvailable(car) {
    setError('');
    try {
      await api.patch(`/cars/${car._id}`, { isAvailable: !car.isAvailable });
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e, 'Update failed.'));
    }
  }

  async function removeCar(id) {
    if (!window.confirm('Delete this vehicle?')) return;
    setError('');
    try {
      await api.delete(`/cars/${id}`);
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e, 'Delete failed.'));
    }
  }

  return (
    <div className="page wide">
      <PageHeader title="Cars" />
      <InlineAlert message={error} />

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

      {loading ? <LoadingState /> : null}
      <div className="table-wrap">
        <table className="table" aria-label="Cars table">
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
                <td data-label="Plate">{c.plateNumber}</td>
                <td data-label="Model">{c.model || '—'}</td>
                <td data-label="Seats">{c.seats}</td>
                <td data-label="Available">{c.isAvailable ? 'Yes' : 'No'}</td>
                <td data-label="Actions">
                  <button type="button" className="btn ghost small-btn" onClick={() => toggleAvailable(c)}>
                    Toggle available
                  </button>{' '}
                  <button type="button" className="btn ghost small-btn" onClick={() => removeCar(c._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && cars.length === 0 ? <EmptyTableRow colSpan={5} message="No cars found." /> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
