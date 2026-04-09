import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';

export function AdminGates() {
  const [gates, setGates] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const { data } = await api.get('/gates');
      setGates(data.gates || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load gates');
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
      await api.post('/gates', { name, description });
      setName('');
      setDescription('');
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Could not create gate');
    }
  }

  async function removeGate(id) {
    if (!window.confirm('Delete this gate? Trips referencing it may break.')) return;
    setError('');
    try {
      await api.delete(`/gates/${id}`);
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Delete failed');
    }
  }

  return (
    <div className="page wide">
      <p className="breadcrumb">
        <Link to="/">Dashboard</Link> / Gates
      </p>
      <h1>Gates</h1>
      {error ? <div className="alert error">{error}</div> : null}

      <form className="form admin-form" onSubmit={handleCreate}>
        <h2 className="form-section-title">Add gate</h2>
        <div className="form-row">
          <label className="field flex-2">
            <span>Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Gate A" />
          </label>
          <label className="field flex-2">
            <span>Description</span>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Near building 1"
            />
          </label>
          <button type="submit" className="btn primary align-end">
            Add gate
          </button>
        </div>
      </form>

      {loading ? <p className="muted">Loading…</p> : null}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {gates.map((g) => (
              <tr key={g._id}>
                <td>{g.name}</td>
                <td className="muted small">{g.description || '—'}</td>
                <td>
                  <button type="button" className="btn ghost small-btn" onClick={() => removeGate(g._id)}>
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
