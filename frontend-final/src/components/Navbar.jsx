import { useApp } from '../context/AppContext';
import { LayoutDashboard, PlusCircle, FileText, User, Shield, Wallet } from 'lucide-react';

export default function Navbar({ active }) {
  const { setPage, user } = useApp();

  const userLinks = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'add', label: 'Add Expense', icon: PlusCircle },
    { key: 'reports', label: 'Reports', icon: FileText },
    { key: 'profile', label: 'Profile', icon: User },
  ];

  const adminLinks = [
    { key: 'admin', label: 'Admin Panel', icon: Shield },
    { key: 'profile', label: 'Profile', icon: User },
  ];

  const links = user.role === 'admin' ? adminLinks : userLinks;

  return (
    <nav style={{
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <button onClick={() => setPage(user.role === 'admin' ? 'admin' : 'dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={18} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em' }}>Spendly</span>
          {user.role === 'admin' && (
            <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: 99, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: 'white', marginLeft: 2 }}>ADMIN</span>
          )}
        </button>

        {/* Links */}
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {links.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setPage(key)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '0.5rem 1rem', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: active === key ? 'var(--accent-light)' : 'transparent',
              color: active === key ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: active === key ? 700 : 500, fontSize: '0.875rem', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (active !== key) e.currentTarget.style.background = 'var(--bg)'; }}
            onMouseLeave={e => { if (active !== key) e.currentTarget.style.background = 'transparent'; }}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {/* User badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', fontWeight: 800, color: 'white',
            background: user.role === 'admin'
              ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
              : 'linear-gradient(135deg, var(--accent), var(--accent-2))',
          }}>
            {user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : '?'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, lineHeight: 1.2 }}>{user.name || 'User'}</span>
            <span style={{ fontSize: '0.68rem', color: user.role === 'admin' ? '#ef4444' : 'var(--text-muted)', fontWeight: 600 }}>
              {user.role === 'admin' ? '🛡️ Administrator' : '👤 User'}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}