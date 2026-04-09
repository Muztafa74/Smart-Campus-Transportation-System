import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';

const ROLES = ['FACULTY', 'DISABLED', 'ADMIN'];

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setError('');
    try {
      const { data } = await api.get('/users');
      setUsers(data.users || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateRole(userId, role) {
    setError('');
    try {
      await api.patch(`/users/${userId}`, { role });
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Update failed');
    }
  }

  async function removeUser(userId) {
    if (!window.confirm('Delete this user?')) return;
    setError('');
    try {
      await api.delete(`/users/${userId}`);
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Delete failed');
    }
  }

  return (
    <div className="page wide">
      <p className="breadcrumb">
        <Link to="/">Dashboard</Link> / Users
      </p>
      <h1>Users</h1>
      {loading ? <p className="muted">Loading…</p> : null}
      {error ? <div className="alert error">{error}</div> : null}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>
                  <select
                    className="select-inline"
                    value={u.role}
                    onChange={(e) => updateRole(u.id, e.target.value)}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button type="button" className="btn ghost small-btn" onClick={() => removeUser(u.id)}>
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
