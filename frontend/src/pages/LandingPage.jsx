import { Link } from 'react-router-dom';
import { HowItWorks } from '../components/landing/HowItWorks';
import { RevealSection } from '../components/landing/RevealSection';
import { SectionHeader } from '../components/landing/SectionHeader';

const TECH_STACK = [
  {
    title: 'Frontend',
    items: ['React (Vite)', 'Axios'],
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Express.js', 'MongoDB (Mongoose)'],
  },
  {
    title: 'Car System',
    items: ['Python', 'Tkinter (GUI)', 'TkinterMapView', 'Requests (API communication)'],
  },
  {
    title: 'Architecture',
    items: ['REST API', 'Client-Server Architecture', 'Real-time communication (Polling)'],
  },
];

export function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-hero">
        <div className="landing-nav">
          <div className="landing-brand">
            <span className="brand-mark" aria-hidden>
              HU
            </span>
            <span>Guidy – HorusGo</span>
          </div>
          <Link className="btn ghost" to="/login">
            Sign in
          </Link>
        </div>

        <div className="landing-hero-layout">
          <div className="landing-hero-copy">
            <p className="landing-eyebrow">Autonomous Campus Transit</p>
            <h1>Redefining Campus Mobility Through Autonomy</h1>
            <p className="landing-hero-text">
              Intelligent, accessible transport for Horus University — real-time coordination, built for independence.
            </p>
            <div className="landing-hero-cta">
              <Link className="btn primary" to="/register">
                Get Started
              </Link>
              <Link className="btn ghost" to="/login">
                View Live Map
              </Link>
            </div>
          </div>
          <figure className="landing-hero-visual">
            <img
              src="/hero-campus-dispatch.png"
              alt="Guidy shuttles on campus with passengers, priority dispatch, and live pickup times"
            />
          </figure>
        </div>
      </header>

      <RevealSection>
        <section className="landing-section landing-section--open">
          <SectionHeader eyebrow="Why Guidy" title="From congestion to clarity" />
          <div className="landing-split-prose">
            <div>
              <h3 className="landing-subheading">The challenge</h3>
              <p className="muted">
                Fragmented requests, limited visibility, and uneven support for accessibility during peak hours.
              </p>
            </div>
            <div>
              <h3 className="landing-subheading">The Guidy approach</h3>
              <p className="muted">
                One coordinated fleet with live status, safety-aware routing, and inclusive boarding by design.
              </p>
            </div>
          </div>
        </section>
      </RevealSection>

      <RevealSection>
        <section className="landing-section landing-section--open">
          <SectionHeader eyebrow="Implementation" title="Technologies Used" />
          <div className="landing-tech-stack">
            {TECH_STACK.map((block) => (
              <div key={block.title}>
                <h3 className="landing-subheading">{block.title}</h3>
                <ul className="landing-bullet-plain">
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      <RevealSection>
        <section className="landing-section landing-section--showcase">
          <div className="landing-showcase">
            <figure className="landing-showcase-image landing-showcase-image--bleed">
              <img src="/vehicle-campus.png" alt="Guidy vehicle with accessibility ramp on campus" />
            </figure>
            <div className="landing-showcase-copy">
              <p className="landing-eyebrow">Human-centered</p>
              <h2>Designed for people first</h2>
              <p className="muted">
                Safe boarding, inclusive routing, and predictable autonomous movement across real campus conditions.
              </p>
              <p className="landing-tagline-inline muted small">Autonomous · Accessible · Live tracking</p>
            </div>
          </div>
        </section>
      </RevealSection>

      <RevealSection>
        <section className="landing-section landing-section--open">
          <SectionHeader eyebrow="Systems" title="Perception, access, and operations" />
          <div className="landing-triple-plain">
            <div>
              <h3 className="landing-subheading">Perception</h3>
              <ul className="landing-bullet-plain">
                <li>Computer vision for paths and obstacles</li>
                <li>LiDAR depth in real time</li>
                <li>Ultrasonic near-field awareness</li>
              </ul>
            </div>
            <div>
              <h3 className="landing-subheading">Accessibility</h3>
              <ul className="landing-bullet-plain">
                <li>Ramp-first boarding</li>
                <li>Priority-aware scheduling</li>
                <li>Comfortable passenger capacity</li>
              </ul>
            </div>
            <div>
              <h3 className="landing-subheading">Admin</h3>
              <ul className="landing-bullet-plain">
                <li>Live fleet and trip monitoring</li>
                <li>Role-based access</li>
                <li>Diagnostics and health signals</li>
              </ul>
            </div>
          </div>
        </section>
      </RevealSection>

      <HowItWorks />

      <footer className="landing-footer">
        <p>Guidy – HorusGo</p>
        <p className="muted">Empowering Mobility, Engineering Independence</p>
      </footer>
    </div>
  );
}
