import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/', { replace: true });
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
    setBusy(true);
    try {
      await register({
        email,
        password,
        full_name: fullName,
        role,
      });
      navigate('/', { replace: true });
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
    <div className="page narrow">
      <h1>Create account</h1>
      <p className="muted">Faculty and accessible mobility accounts.</p>
      <form className="form" onSubmit={handleSubmit}>
        {error ? <div className="alert error">{error}</div> : null}
        <label className="field">
          <span>Full name</span>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            required
          />
        </label>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={6}
            required
          />
        </label>
        <fieldset className="field">
          <legend>Role</legend>
          <label className="inline">
            <input
              type="radio"
              name="role"
              value="FACULTY"
              checked={role === 'FACULTY'}
              onChange={() => setRole('FACULTY')}
            />
            Faculty
          </label>
          <label className="inline">
            <input
              type="radio"
              name="role"
              value="DISABLED"
              checked={role === 'DISABLED'}
              onChange={() => setRole('DISABLED')}
            />
            Accessible mobility (priority scheduling)
          </label>
        </fieldset>
        <button type="submit" className="btn primary" disabled={busy}>
          {busy ? 'Creating…' : 'Register'}
        </button>
      </form>
      <p className="muted small">
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
