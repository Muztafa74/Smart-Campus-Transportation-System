import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Dashboard() {
  const { user } = useAuth();

  if (user?.role === 'ADMIN') {
    return (
      <div className="page">
        <h1>Admin dashboard</h1>
        <p className="muted">
          Manage accounts, vehicles, gates, gate-to-gate routes (with your numeric code), and every trip on campus.
        </p>
        <div className="card-grid">
          <Link to="/admin/users" className="card link-card">
            <h2>Users</h2>
            <p>List faculty, accessibility, and admin accounts. Change roles or remove users.</p>
          </Link>
          <Link to="/admin/trips" className="card link-card">
            <h2>All trips</h2>
            <p>View every request and move trips to in progress or completed.</p>
          </Link>
          <Link to="/admin/cars" className="card link-card">
            <h2>Cars</h2>
            <p>Add shuttles, edit plate numbers, and mark vehicles available or busy.</p>
          </Link>
          <Link to="/admin/gates" className="card link-card">
            <h2>Gates</h2>
            <p>Create and edit pickup points (gate A, gate B, …).</p>
          </Link>
          <Link to="/admin/paths" className="card link-card">
            <h2>Routes (A → B)</h2>
            <p>Define paths from one gate to another and assign the digit you use for that route.</p>
          </Link>
        </div>
        <h2 className="section-title">Passenger tools</h2>
        <p className="muted small">Use these if you want to test the rider experience.</p>
        <div className="card-grid">
          <Link to="/request-trip" className="card link-card subtle">
            <h2>Request trip</h2>
            <p>Book like a faculty or accessibility user.</p>
          </Link>
          <Link to="/my-trips" className="card link-card subtle">
            <h2>My trips</h2>
            <p>Trips tied to your admin account.</p>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p className="muted">Request a ride from one gate to another, or review your trips.</p>
      <div className="card-grid">
        <Link to="/request-trip" className="card link-card">
          <h2>Request trip</h2>
          <p>Choose start, destination, and an available vehicle (admin must define the route digit for that pair).</p>
        </Link>
        <Link to="/my-trips" className="card link-card">
          <h2>My trips</h2>
          <p>See status: pending, assigned, in progress, or completed.</p>
        </Link>
      </div>
    </div>
  );
}
