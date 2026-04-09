import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page center muted">
        <p>Loading…</p>
      </div>
    );
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
