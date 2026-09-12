import React, { useState } from 'react';
import { Flame, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { username, password });
      localStorage.setItem('ignis_token', res.data.token);
      localStorage.setItem('ignis_user', JSON.stringify(res.data.user));
      window.location.href = '/';
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)',
    }}>
      <div className="glass-card" style={{ padding: '2.5rem', width: 380, maxWidth: '90vw' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Flame size={40} color="var(--accent)" style={{ marginBottom: 8 }} />
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>IGNIS</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0' }}>
            Industrial Fire Surveillance System
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Username
            </label>
            <input
              type="text" value={username} onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
              style={{
                width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid var(--border)',
                background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', fontSize: '0.95rem',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)} placeholder="Enter password"
                style={{
                  width: '100%', padding: '0.7rem 2.5rem 0.7rem 1rem', borderRadius: 8,
                  border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
                }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer',
              }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ marginBottom: '1rem', padding: '0.5rem 1rem', borderRadius: 8, background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '0.75rem', borderRadius: 8, border: 'none', fontWeight: 600,
            fontSize: '0.95rem', cursor: loading ? 'wait' : 'pointer',
            background: 'linear-gradient(135deg, var(--accent), #f97316)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Lock size={16} /> {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1.5rem' }}>
          Demo: any username/password works
        </p>
      </div>
    </div>
  );
}
