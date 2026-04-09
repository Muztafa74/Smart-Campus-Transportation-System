import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell">
      <header className="top-nav">
        <Link to="/" className="brand">
          Smart Campus Transport
        </Link>
        <nav className="nav-links">
          <Link to="/">Dashboard</Link>
          {user?.role === 'ADMIN' ? (
            <>
              <span className="nav-sep" aria-hidden />
              <Link to="/admin/users">Users</Link>
              <Link to="/admin/trips">All trips</Link>
              <Link to="/admin/cars">Cars</Link>
              <Link to="/admin/gates">Gates</Link>
              <Link to="/admin/paths">Routes</Link>
            </>
          ) : null}
          <span className="nav-sep" aria-hidden />
          <Link to="/request-trip">Request trip</Link>
          <Link to="/my-trips">My trips</Link>
        </nav>
        <div className="nav-user">
          <span className="muted small">
            {user?.fullName} · {user?.role}
          </span>
          <button type="button" className="btn ghost" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
