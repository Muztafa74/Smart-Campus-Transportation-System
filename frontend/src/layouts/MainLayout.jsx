import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="app-shell">
      {menuOpen ? <button type="button" className="menu-backdrop" aria-label="Close menu" onClick={closeMenu} /> : null}
      <aside className={`app-sidebar ${menuOpen ? 'is-open' : ''}`} aria-label="Sidebar navigation">
        <Link to="/dashboard" className="brand">
          <span className="brand-mark" aria-hidden>
            HU
          </span>
          <span>
            Guidy – HorusGo
            <span className="brand-sub">Horus University - Egypt</span>
          </span>
        </Link>

        <nav className="side-nav" aria-label="Primary">
          <p className="nav-group-title">General</p>
          <NavLink to="/dashboard" onClick={closeMenu}>
            <span aria-hidden>⌂</span> Dashboard
          </NavLink>
          <NavLink to="/request-trip" onClick={closeMenu}>
            <span aria-hidden>⊕</span> Request trip
          </NavLink>
          <NavLink to="/my-trips" onClick={closeMenu}>
            <span aria-hidden>▣</span> My trips
          </NavLink>

          {user?.role === 'ADMIN' ? (
            <>
              <p className="nav-group-title">Administration</p>
              <NavLink to="/admin/users" onClick={closeMenu}>
                <span aria-hidden>◌</span> Users
              </NavLink>
              <NavLink to="/admin/trips" onClick={closeMenu}>
                <span aria-hidden>▤</span> All trips
              </NavLink>
              <NavLink to="/admin/cars" onClick={closeMenu}>
                <span aria-hidden>◈</span> Cars
              </NavLink>
              <NavLink to="/admin/gates" onClick={closeMenu}>
                <span aria-hidden>◇</span> Gates
              </NavLink>
              <NavLink to="/admin/paths" onClick={closeMenu}>
                <span aria-hidden>⋯</span> Routes
              </NavLink>
            </>
          ) : null}
        </nav>

        <div className="sidebar-user">
          <span className="muted small">
            Signed in as <strong>{user?.fullName}</strong>
          </span>
          <span className="pill role-pill">{user?.role}</span>
          <button type="button" className="btn ghost" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      <div className="app-main">
        <header className="top-nav">
          <button
            type="button"
            className="menu-toggle btn ghost"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            Menu
          </button>
          <div>
            <p className="top-label">Guidy – HorusGo</p>
            <p className="top-subtitle muted">Manage rides, fleets, and routes with a premium themed console.</p>
          </div>
          <div className="nav-user">
            <span className="muted small">
              {user?.fullName} · {user?.role}
            </span>
          </div>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
        <nav className="mobile-bottom-nav" aria-label="Mobile quick navigation">
          <NavLink to="/dashboard" onClick={closeMenu}>
            <span aria-hidden>⌂</span>
            <span>Home</span>
          </NavLink>
          <NavLink to="/request-trip" onClick={closeMenu}>
            <span aria-hidden>⊕</span>
            <span>Request</span>
          </NavLink>
          <NavLink to="/my-trips" onClick={closeMenu}>
            <span aria-hidden>▣</span>
            <span>Trips</span>
          </NavLink>
          <button
            type="button"
            className="mobile-nav-menu-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label="Open navigation menu"
          >
            <span aria-hidden>☰</span>
            <span>Menu</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
