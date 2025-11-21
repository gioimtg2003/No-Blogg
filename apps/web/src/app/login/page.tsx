'use client';

import { useState } from 'react';
import { authApi, setAuthToken } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantSlug, setTenantSlug] = useState('acme-corp');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login(email, password, tenantSlug);
      const { token, user } = response.data.data;

      // Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setAuthToken(token);

      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="header">
        <div className="header-content">
          <h1>No-Blogg CMS</h1>
          <nav className="nav">
            <a href="/">Home</a>
          </nav>
        </div>
      </div>

      <div className="container">
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Login</h2>

          <form onSubmit={handleSubmit}>
            <div>
              <label className="label">Tenant</label>
              <select
                className="input"
                value={tenantSlug}
                onChange={(e) => setTenantSlug(e.target.value)}
              >
                <option value="acme-corp">Acme Corp</option>
                <option value="demo-org">Demo Organization</option>
              </select>
            </div>

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@acme.com"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="password123"
              />
            </div>

            {error && <div className="error">{error}</div>}

            <button type="submit" className="button" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
            <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
              <strong>Demo Credentials:</strong>
            </p>
            <ul style={{ fontSize: '0.875rem', color: '#666', marginLeft: '1.5rem' }}>
              <li>admin@acme.com / password123</li>
              <li>editor@acme.com / password123</li>
              <li>admin@demo.com / password123</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
