import { useApp } from '../context/AppContext';
import { TrendingUp, PieChart, Shield, Zap, ArrowRight, Wallet } from 'lucide-react';

export default function Landing() {
  const { setPage } = useApp();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 40%, #f0fff8 100%)' }}>
      {/* Header */}
      <header style={{
        padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        maxWidth: 1280, margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Wallet size={20} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>Spendly</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setPage('signin')} style={{
            padding: '0.6rem 1.5rem', borderRadius: 10, border: '1.5px solid var(--accent)',
            background: 'transparent', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer',
            fontSize: '0.9rem', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-light)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
            Sign In
          </button>
          <button onClick={() => setPage('signup')} style={{
            padding: '0.6rem 1.5rem', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem',
            boxShadow: '0 4px 16px rgba(124,111,247,0.35)', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(124,111,247,0.45)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,111,247,0.35)'; }}>
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '5rem 2rem 4rem', maxWidth: 860, margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.4rem 1rem',
          background: 'var(--accent-light)', borderRadius: 99, marginBottom: '1.5rem',
          fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)',
        }}>
          <Zap size={12} /> Smart expense intelligence for 2026
        </div>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, lineHeight: 1.1,
          letterSpacing: '-0.04em', marginBottom: '1.25rem',
          background: 'linear-gradient(135deg, #1a1d2e 0%, var(--accent) 60%, var(--accent-2) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          Track Your Expenses<br />Smartly
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.7, maxWidth: 580, margin: '0 auto 2.5rem' }}>
          Understand your spending habits with powerful insights and visual charts. Take control of your finances with beautiful, intuitive tracking.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setPage('signup')} style={{
            padding: '0.875rem 2.5rem', borderRadius: 14, border: 'none',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '1rem',
            boxShadow: '0 6px 28px rgba(124,111,247,0.4)', display: 'flex', alignItems: 'center', gap: 8,
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 36px rgba(124,111,247,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(124,111,247,0.4)'; }}>
            Get Started Free <ArrowRight size={18} />
          </button>
          <button onClick={() => setPage('signin')} style={{
            padding: '0.875rem 2.5rem', borderRadius: 14,
            border: '1.5px solid var(--border)', background: 'rgba(255,255,255,0.8)',
            color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '1rem',
            backdropFilter: 'blur(10px)', transition: 'all 0.25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}>
            Sign In
          </button>
        </div>
      </section>

      {/* Illustration / Stats strip */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem 3rem' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem',
          background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.9)', borderRadius: 24, padding: '2rem',
          boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
        }}>
          {[
            { icon: '₹', label: 'Tracked This Month', val: '₹54,249', color: 'var(--accent)' },
            { icon: '📊', label: 'Categories', val: '8 Types', color: 'var(--mint)' },
            { icon: '📈', label: 'Savings Insight', val: '+23% better', color: 'var(--coral)' },
            { icon: '🎯', label: 'Budget Accuracy', val: '98.2%', color: 'var(--amber)' },
          ].map(item => (
            <div key={item.label} style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{item.icon}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: item.color, letterSpacing: '-0.02em' }}>{item.val}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 2rem 6rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
          Everything you need to manage money
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
          Powerful features wrapped in a beautiful, intuitive interface
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {[
            { icon: PieChart, title: 'Visual Analytics', desc: 'Beautiful pie, bar, and line charts that make your spending crystal clear.', color: 'var(--accent)', bg: 'var(--accent-light)' },
            { icon: Shield, title: 'Budget Control', desc: 'Set monthly budgets per category and get alerts when you overspend.', color: 'var(--mint)', bg: 'var(--mint-light)' },
            { icon: TrendingUp, title: 'Spending Trends', desc: 'Track trends over time and understand your financial patterns deeply.', color: 'var(--coral)', bg: 'var(--coral-light)' },
            { icon: Zap, title: 'Instant Reports', desc: 'Generate detailed PDF reports filtered by month, category, or date range.', color: 'var(--amber)', bg: 'var(--amber-light)' },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} style={{
              background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.9)', borderRadius: 20,
              padding: '1.75rem', boxShadow: 'var(--shadow-md)',
              transition: 'all 0.25s', cursor: 'default',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>{title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}