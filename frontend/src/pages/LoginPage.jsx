import React, { useState, useEffect } from 'react';
import { Flame, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

export default function LoginPage() {
  const [username, setUsername] = useState('admin@ignis.gov');
  const [password, setPassword] = useState('admin123');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hexCodes, setHexCodes] = useState([]);

  useEffect(() => {
    const codes = Array.from({ length: 20 }).map(() => ({
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2,
      text: `0x${Math.floor(Math.random() * 16777215).toString(16).toUpperCase()}`
    }));
    setHexCodes(codes);
  }, []);

  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isRegister) {
        // Registration Flow
        await axios.post(`${API_BASE}/auth/register`, { 
          email: username, 
          password, 
          full_name: fullName 
        });
        
        // Auto-login after successful registration
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        const res = await axios.post(`${API_BASE}/auth/login`, params, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        localStorage.setItem('ignis_token', res.data.access_token);
        localStorage.setItem('ignis_user', JSON.stringify(res.data.user));
        window.location.href = '/';
      } else {
        // Login Flow
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        const res = await axios.post(`${API_BASE}/auth/login`, params, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        localStorage.setItem('ignis_token', res.data.access_token);
        localStorage.setItem('ignis_user', JSON.stringify(res.data.user));
        window.location.href = '/';
      }
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-main)', position: 'relative', overflow: 'hidden'
    }}>
      {/* Blurred Map Grid Background */}
      <div style={{ 
        position: 'absolute', top: '-10%', left: '-10%', right: '-10%', bottom: '-10%', 
        backgroundImage: 'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)', 
        backgroundSize: '60px 60px', 
        opacity: 0.08, 
        zIndex: 0,
        filter: 'blur(4px)',
        transform: 'perspective(1000px) rotateX(20deg) scale(1.1)'
      }}></div>
      
      {/* Radial fade to focus center */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(circle at center, transparent 0%, var(--bg-main) 80%)',
        zIndex: 0
      }}></div>
      
      {/* Background Hex Codes */}
      {hexCodes.map((code) => (
        <motion.div
          key={code.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 0.5, 0], y: -20 }}
          transition={{ duration: code.duration, delay: code.delay, repeat: Infinity }}
          style={{
            position: 'absolute',
            left: `${code.x}%`,
            top: `${code.y}%`,
            color: 'var(--color-facility)',
            fontSize: '10px',
            fontWeight: 600,
            zIndex: 0,
            opacity: 0.2,
            fontFamily: 'monospace'
          }}
        >
          {code.text}
        </motion.div>
      ))}

      <div className="glass-card" style={{ padding: '2.5rem', width: 380, maxWidth: '90vw', zIndex: 1, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Flame size={40} color="var(--accent)" style={{ marginBottom: 8 }} />
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>IGNIS</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0' }}>
            Industrial Fire Surveillance System
          </p>
        </div>

        <form onSubmit={handleAuth}>
          {isRegister && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                Full Name
              </label>
              <input
                type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="Enter your name" required
                style={{
                  width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', fontSize: '0.95rem',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Email Address
            </label>
            <input
              type="email" value={username} onChange={e => setUsername(e.target.value)}
              placeholder="agent@ignis.gov" required
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
                onChange={e => setPassword(e.target.value)} placeholder="Enter password" required
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
            boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)'
          }}>
            <Lock size={16} /> {loading ? 'Processing…' : (isRegister ? 'Request Access' : 'Sign In')}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1.5rem' }}>
          {isRegister ? "Already have access?" : "Need an account?"}
          <button 
            type="button" 
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{ 
              background: 'none', border: 'none', color: 'var(--accent)', 
              fontWeight: 600, cursor: 'pointer', marginLeft: 4 
            }}
          >
            {isRegister ? "Sign In" : "Request Access"}
          </button>
        </p>
      </div>
    </div>
  );
}
