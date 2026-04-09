import { Link } from 'react-router-dom';

export function DashboardCard({ to, title, description, subtle = false }) {
  return (
    <Link to={to} className={`card link-card${subtle ? ' subtle' : ''}`}>
      <h2>{title}</h2>
      <p>{description}</p>
    </Link>
  );
}
