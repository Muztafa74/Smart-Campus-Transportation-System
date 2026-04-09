import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api/client';
import { getApiErrorMessage } from '../../api/errors';
import { EmptyTableRow } from '../../components/ui/EmptyTableRow';
import { InlineAlert, LoadingState } from '../../components/ui/Feedback';
import { PageHeader } from '../../components/ui/PageHeader';

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
      setError(getApiErrorMessage(e, 'Failed to load users.'));
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
      setError(getApiErrorMessage(e, 'Update failed.'));
    }
  }

  async function removeUser(userId) {
    if (!window.confirm('Delete this user?')) return;
    setError('');
    try {
      await api.delete(`/users/${userId}`);
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e, 'Delete failed.'));
    }
  }

  return (
    <div className="page wide">
      <PageHeader title="Users" />
      {loading ? <LoadingState /> : null}
      <InlineAlert message={error} />
      <div className="table-wrap">
        <table className="table" aria-label="Users table">
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
                <td data-label="Name">{u.fullName}</td>
                <td data-label="Email">{u.email}</td>
                <td data-label="Role">
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
                <td data-label="Actions">
                  <button type="button" className="btn ghost small-btn" onClick={() => removeUser(u.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && users.length === 0 ? <EmptyTableRow colSpan={4} message="No users found." /> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
