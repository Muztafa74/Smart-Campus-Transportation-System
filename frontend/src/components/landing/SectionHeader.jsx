export function SectionHeader({ eyebrow, title, description }) {
  return (
    <header className="landing-section-head">
      {eyebrow ? <p className="landing-eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {description ? <p className="muted">{description}</p> : null}
    </header>
  );
}
