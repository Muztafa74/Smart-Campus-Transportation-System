export function InlineAlert({ message, type = 'error' }) {
  if (!message) return null;
  return (
    <div className={`alert ${type}`} role={type === 'error' ? 'alert' : 'status'}>
      {message}
    </div>
  );
}

export function LoadingState({ message = 'Loading…', lines = 3 }) {
  return (
    <div className="state-block" role="status" aria-live="polite">
      <p className="muted small">{message}</p>
      <div className="skeleton-list" aria-hidden>
        {Array.from({ length: lines }).map((_, idx) => (
          <span key={idx} className="skeleton-line" />
        ))}
      </div>
    </div>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <div className="empty-icon" aria-hidden>
        ○
      </div>
      <p className="empty-title">{title}</p>
      {description ? <p className="muted small">{description}</p> : null}
    </div>
  );
}
