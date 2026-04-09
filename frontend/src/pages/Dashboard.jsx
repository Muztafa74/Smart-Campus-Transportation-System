import { useAuth } from '../contexts/AuthContext';
import { DashboardCard } from '../components/ui/DashboardCard';

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
          <DashboardCard to="/admin/users" title="Users" description="List faculty, accessibility, and admin accounts. Change roles or remove users." />
          <DashboardCard to="/admin/trips" title="All trips" description="View every request and move trips to in progress or completed." />
          <DashboardCard to="/admin/cars" title="Cars" description="Add shuttles, edit plate numbers, and mark vehicles available or busy." />
          <DashboardCard to="/admin/gates" title="Gates" description="Create and edit pickup points (gate A, gate B, …)." />
          <DashboardCard to="/admin/paths" title="Routes (A → B)" description="Define paths from one gate to another and assign the digit you use for that route." />
        </div>
        <h2 className="section-title">Passenger tools</h2>
        <p className="muted small">Use these if you want to test the rider experience.</p>
        <div className="card-grid">
          <DashboardCard to="/request-trip" title="Request trip" description="Book like a faculty or accessibility user." subtle />
          <DashboardCard to="/my-trips" title="My trips" description="Trips tied to your admin account." subtle />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p className="muted">Request a ride from one gate to another, or review your trips.</p>
      <div className="card-grid">
        <DashboardCard to="/request-trip" title="Request trip" description="Choose start, destination, and an available vehicle." />
        <DashboardCard to="/my-trips" title="My trips" description="See status: pending, assigned, in progress, or completed." />
      </div>
    </div>
  );
}
