import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, Eye, EyeOff, User, Wallet, ArrowRight, Sparkles, Shield } from 'lucide-react';

export default function SignUp() {
  const { setPage, signup, loading } = useApp();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'user' });
  const [error, setError] = useState('');

  const inputStyle = {
    width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem',
    border: '1.5px solid var(--border)', borderRadius: 12,
    fontSize: '0.9rem', background: 'var(--bg)', outline: 'none',
    transition: 'all 0.2s', color: 'var(--text-primary)',
  };

  const handleSignUp = async () => {
    setError('');
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 4) { setError('Password must be at least 4 characters.'); return; }
    try {
      await signup({ name: form.name, email: form.email, password: form.password, role: form.role });
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fff8 100%)', padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, var(--mint), var(--accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
            boxShadow: '0 8px 24px rgba(67,232,176,0.35)',
          }}>
            <Wallet size={26} color="white" />
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.35rem 0.875rem', background: 'var(--mint-light)', borderRadius: 99, marginBottom: '0.75rem' }}>
            <Sparkles size={12} color="var(--mint)" />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#16a37a' }}>Free forever · No credit card needed</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>Create your account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Join thousands managing money smarter</p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.95)', borderRadius: 24,
          padding: '2.25rem', boxShadow: '0 16px 60px rgba(0,0,0,0.08)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {error && (
              <div style={{ background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 10, padding: '0.75rem 1rem', color: '#dc2626', fontSize: '0.85rem', fontWeight: 500 }}>
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" placeholder="Arjun Sharma" value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type={showPass ? 'text' : 'password'} placeholder="Create a strong password" value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  style={{ ...inputStyle, paddingRight: '3rem' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type={showPass ? 'text' : 'password'} placeholder="Repeat your password" value={form.confirm}
                  onChange={e => setForm({...form, confirm: e.target.value})}
                  style={{ ...inputStyle, paddingRight: '3rem' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
            </div>

            {/* Role selector */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Account Type</label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {[
                  { value: 'user', label: '👤 User', desc: 'Track my expenses' },
                  { value: 'admin', label: '🛡️ Admin', desc: 'Manage all users' },
                ].map(r => (
                  <button key={r.value} onClick={() => setForm({...form, role: r.value})} type="button" style={{
                    flex: 1, padding: '0.75rem', borderRadius: 12, cursor: 'pointer',
                    border: '2px solid', transition: 'all 0.2s',
                    borderColor: form.role === r.value ? 'var(--accent)' : 'var(--border)',
                    background: form.role === r.value ? 'var(--accent-light)' : 'transparent',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: form.role === r.value ? 'var(--accent)' : 'var(--text-primary)' }}>{r.label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleSignUp} disabled={loading} style={{
              width: '100%', padding: '0.95rem', borderRadius: 12, border: 'none',
              background: 'linear-gradient(135deg, var(--mint), var(--accent))',
              color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 18px rgba(67,232,176,0.4)', transition: 'all 0.2s', marginTop: '0.5rem', opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; }}}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
              {loading ? 'Creating account…' : <> Create Account <ArrowRight size={18} /> </>}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <button onClick={() => setPage('signin')} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>Sign In</button>
        </p>
        <p style={{ textAlign: 'center', marginTop: '0.75rem' }}>
          <button onClick={() => setPage('landing')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>← Back to home</button>
        </p>
      </div>
    </div>
  );
}