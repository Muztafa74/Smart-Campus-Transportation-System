export function InfoCard({ icon, title, description, tone = 'default' }) {
  return (
    <article className={`landing-card ${tone !== 'default' ? `tone-${tone}` : ''}`}>
      <p className="landing-card-icon" aria-hidden>
        {icon}
      </p>
      <h3>{title}</h3>
      <p className="muted">{description}</p>
    </article>
  );
}
