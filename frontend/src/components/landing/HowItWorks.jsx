import { useEffect, useState } from 'react';

const STATES = ['Searching for vehicle...', 'Vehicle arriving...', 'Boarding confirmed', 'Trip in motion'];

const STEPS = [
  { title: 'Request', text: 'Choose pickup and destination gate.' },
  { title: 'Match', text: 'Nearest available unit is assigned.' },
  { title: 'Navigate', text: 'Sensors guide a safe route on campus.' },
  { title: 'Complete', text: 'Status updates for passenger and admin.' },
];

export function HowItWorks() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((prev) => (prev + 1) % STATES.length);
    }, 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="landing-section landing-section--open landing-section--how">
      <div className="landing-section-head">
        <p className="landing-eyebrow">How it works</p>
        <h2>From request to arrival</h2>
      </div>

      <div className="how-layout">
        <ol className="landing-steps">
          {STEPS.map((step, i) => (
            <li key={step.title} className="landing-step">
              <span className="landing-step-num">{i + 1}</span>
              <div>
                <strong>{step.title}</strong>
                <p className="muted small">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <figure className="how-image how-image--open">
          <img src="/vehicle-studio.png" alt="Guidy vehicle with sensor module" />
        </figure>
      </div>

      <div className="landing-live-state" role="status" aria-live="polite">
        <span className="pulse-dot" aria-hidden />
        <span>{STATES[idx]}</span>
      </div>
    </section>
  );
}
