import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, Eye, EyeOff, Wallet, ArrowRight } from 'lucide-react';

export default function SignIn() {
  const { setPage, login, loading } = useApp();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const inputStyle = {
    width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem',
    border: '1.5px solid var(--border)', borderRadius: 12,
    fontSize: '0.9rem', background: 'var(--bg)', outline: 'none',
    transition: 'all 0.2s', color: 'var(--text-primary)',
  };

  const handleSignIn = async () => {
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    try {
      await login({ email: form.email, password: form.password });
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fff8 100%)', padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
            boxShadow: '0 8px 24px rgba(124,111,247,0.35)',
          }}>
            <Wallet size={26} color="white" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sign in to your Spendly account</p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.95)', borderRadius: 24,
          padding: '2.25rem', boxShadow: '0 16px 60px rgba(0,0,0,0.08)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div style={{ background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 10, padding: '0.75rem 1rem', color: '#dc2626', fontSize: '0.85rem', fontWeight: 500 }}>
                {error}
              </div>
            )}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type={showPass ? 'text' : 'password'} placeholder="Enter your password" value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  onKeyDown={e => e.key === 'Enter' && handleSignIn()}
                  style={{ ...inputStyle, paddingRight: '3rem' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button onClick={handleSignIn} disabled={loading} style={{
              width: '100%', padding: '0.95rem', borderRadius: 12, border: 'none',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 18px rgba(124,111,247,0.4)', transition: 'all 0.2s', marginTop: '0.5rem', opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(124,111,247,0.5)'; }}}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(124,111,247,0.4)'; }}>
              {loading ? 'Signing in…' : <> Sign In <ArrowRight size={18} /> </>}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Don't have an account?{' '}
          <button onClick={() => setPage('signup')} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>Sign Up</button>
        </p>
        <p style={{ textAlign: 'center', marginTop: '0.75rem' }}>
          <button onClick={() => setPage('landing')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>← Back to home</button>
        </p>
      </div>
    </div>
  );
}
