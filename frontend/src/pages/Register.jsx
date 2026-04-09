import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function isHorusUniversityEmail(email) {
  return String(email || '')
    .trim()
    .toLowerCase()
    .endsWith('@horus.edu.eg');
}

export function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('FACULTY');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!isHorusUniversityEmail(email)) {
      setError('Use your Horus University email (@horus.edu.eg).');
      return;
    }
    setBusy(true);
    try {
      await register({
        email,
        password,
        full_name: fullName,
        role,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        err.message ||
        'Registration failed';
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <img className="auth-logo" src="/horus-university-logo.png" alt="Horus University Egypt" />
        <p className="auth-project-name">Guidy – HorusGo</p>
        <h1>Create account</h1>
        <form className="form auth-form" onSubmit={handleSubmit}>
          {error ? (
            <p className="field-error" role="alert">
              {error}
            </p>
          ) : null}
        <label className="field">
          <span className="sr-only">Full name</span>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            placeholder="Full name"
            required
          />
        </label>
        <label className="field">
          <span className="sr-only">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@horus.edu.eg"
            title="Horus University email required (@horus.edu.eg)"
            required
          />
        </label>
        <label className="field">
          <span className="sr-only">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={6}
            placeholder="Password"
            required
          />
        </label>
        <fieldset className="field auth-role-fieldset">
          <legend>Account type</legend>
          <div className="auth-role-options">
            <label className={`auth-role-option ${role === 'FACULTY' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="role"
                value="FACULTY"
                checked={role === 'FACULTY'}
                onChange={() => setRole('FACULTY')}
              />
              <span>Faculty</span>
            </label>
            <label className={`auth-role-option ${role === 'DISABLED' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="role"
                value="DISABLED"
                checked={role === 'DISABLED'}
                onChange={() => setRole('DISABLED')}
              />
              <span>Accessibility</span>
            </label>
          </div>
        </fieldset>
          <button type="submit" className="btn primary auth-submit" disabled={busy}>
            {busy ? 'Creating…' : 'Register'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
