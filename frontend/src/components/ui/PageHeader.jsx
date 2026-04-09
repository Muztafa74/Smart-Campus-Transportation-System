import { Link } from 'react-router-dom';

export function PageHeader({ title, description, crumb = 'Dashboard' }) {
  return (
    <header className="page-header">
      <p className="breadcrumb">
        <Link to="/dashboard">{crumb}</Link> / {title}
      </p>
      <div className="horus-divider" aria-hidden>
        <span />
      </div>
      <h1>{title}</h1>
      {description ? <p className="muted">{description}</p> : null}
    </header>
  );
}
