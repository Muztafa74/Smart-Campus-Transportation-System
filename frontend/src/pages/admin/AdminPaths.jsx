import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api/client';
import { EmptyTableRow } from '../../components/ui/EmptyTableRow';
import { InlineAlert, LoadingState } from '../../components/ui/Feedback';
import { PageHeader } from '../../components/ui/PageHeader';

function gateLabel(g) {
  if (!g) return '—';
  return g.name || String(g._id);
}

export function AdminPaths() {
  const [gates, setGates] = useState([]);
  const [paths, setPaths] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [fromGateId, setFromGateId] = useState('');
  const [toGateId, setToGateId] = useState('');
  const [digit, setDigit] = useState('');

  const loadAll = useCallback(async () => {
    setError('');
    try {
      const [gRes, pRes] = await Promise.all([api.get('/gates'), api.get('/paths')]);
      const g = gRes.data.gates || [];
      setGates(g);
      setPaths(pRes.data.paths || []);
      setFromGateId((prev) => (prev && g.some((x) => x._id === prev) ? prev : g[0]?._id || ''));
      setToGateId((prev) => (prev && g.some((x) => x._id === prev) ? prev : g[1]?._id || g[0]?._id || ''));
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    const d = parseInt(digit, 10);
    if (Number.isNaN(d) || d < 0) {
      setError('Digit must be a non-negative whole number');
      return;
    }
    try {
      await api.post('/paths', { fromGateId, toGateId, digit: d });
      setDigit('');
      await loadAll();
    } catch (e) {
      setError(e.response?.data?.message || 'Could not create path');
    }
  }

  async function removePath(id) {
    if (!window.confirm('Delete this route?')) return;
    setError('');
    try {
      await api.delete(`/paths/${id}`);
      await loadAll();
    } catch (e) {
      setError(e.response?.data?.message || 'Delete failed');
    }
  }

  async function updateDigit(pathId, value) {
    const d = parseInt(value, 10);
    if (Number.isNaN(d) || d < 0) return;
    setError('');
    try {
      await api.patch(`/paths/${pathId}`, { digit: d });
      await loadAll();
    } catch (e) {
      setError(e.response?.data?.message || 'Update failed');
    }
  }

  return (
    <div className="page wide">
      <PageHeader title="Gate routes" />
      <p className="muted">
        Each row is a directed path (e.g. gate A → gate B). The <strong>digit</strong> is the number you define for that
        route (distance code, minutes, internal id, etc.).
      </p>
      <InlineAlert message={error} />

      <form className="form admin-form" onSubmit={handleCreate}>
        <h2 className="form-section-title">New path</h2>
        <div className="form-row">
          <label className="field">
            <span>From gate</span>
            <select value={fromGateId} onChange={(e) => setFromGateId(e.target.value)} required>
              {gates.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>To gate</span>
            <select value={toGateId} onChange={(e) => setToGateId(e.target.value)} required>
              {gates.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Digit</span>
            <input
              type="number"
              min={0}
              step={1}
              value={digit}
              onChange={(e) => setDigit(e.target.value)}
              placeholder="e.g. 12"
              required
            />
          </label>
          <button type="submit" className="btn primary align-end" disabled={gates.length < 2}>
            Save path
          </button>
        </div>
        {gates.length < 2 ? (
          <p className="muted small">Create at least two gates before adding paths between them.</p>
        ) : null}
      </form>

      {loading ? <LoadingState /> : null}
      <div className="table-wrap">
        <table className="table" aria-label="Gate routes table">
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Digit</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paths.map((p) => (
              <tr key={p.id}>
                <td data-label="From">{gateLabel(p.fromGate)}</td>
                <td data-label="To">{gateLabel(p.toGate)}</td>
                <td data-label="Digit">
                  <input
                    type="number"
                    min={0}
                    className="input-inline"
                    defaultValue={p.digit}
                    key={`${p.id}-${p.digit}`}
                    onBlur={(e) => {
                      if (e.target.value !== String(p.digit)) updateDigit(p.id, e.target.value);
                    }}
                  />
                </td>
                <td data-label="Actions">
                  <button type="button" className="btn ghost small-btn" onClick={() => removePath(p.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && paths.length === 0 ? <EmptyTableRow colSpan={4} message="No routes found." /> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
