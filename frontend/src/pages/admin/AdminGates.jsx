import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api/client';
import { EmptyTableRow } from '../../components/ui/EmptyTableRow';
import { InlineAlert, LoadingState } from '../../components/ui/Feedback';
import { PageHeader } from '../../components/ui/PageHeader';

export function AdminGates() {
  const [gates, setGates] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [keyValue, setKeyValue] = useState('');
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
      await api.post('/gates', { name: name.trim(), key: keyValue.trim(), description: description.trim() });
      setName('');
      setKeyValue('');
      setDescription('');
      await load();
    } catch (e) {
      const msg =
        e.response?.data?.errors?.[0]?.message ||
        e.response?.data?.message ||
        e.message ||
        'Could not create gate';
      setError(msg);
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
      <PageHeader title="Gates" />
      <InlineAlert message={error} />

      <form className="form admin-form" onSubmit={handleCreate}>
        <h2 className="form-section-title">Add gate</h2>
        <div className="form-row">
          <label className="field flex-2">
            <span>Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Gate A" />
          </label>
          <label className="field">
            <span>Key</span>
            <input
              value={keyValue}
              onChange={(e) => setKeyValue(e.target.value.toUpperCase())}
              required
              placeholder="A1 / MAIN / GATE_A"
            />
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

      {loading ? <LoadingState /> : null}
      <div className="table-wrap">
        <table className="table" aria-label="Gates table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Key</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {gates.map((g) => (
              <tr key={g._id}>
                <td data-label="Name">{g.name}</td>
                <td data-label="Key">
                  <code>{g.key || '—'}</code>
                </td>
                <td data-label="Description" className="muted small">{g.description || '—'}</td>
                <td data-label="Actions">
                  <button type="button" className="btn ghost small-btn" onClick={() => removeGate(g._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && gates.length === 0 ? <EmptyTableRow colSpan={4} message="No gates found." /> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
