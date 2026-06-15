import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import { User, Mail, Target, Bell, Shield, LogOut, X, Check, IndianRupee, Edit3, AlertTriangle, Lock, Eye, EyeOff, Sun, Moon, Wallet, Plus } from 'lucide-react';

export default function Profile() {
  const {
    user, totalExpense, monthlyExpense, logout, updateProfile,
    theme, toggleTheme, accounts, addAccount, deleteAccount, renameAccount,
  } = useApp();

  // Edit profile
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm]           = useState({ name: user.name, email: user.email });
  const [editSaved, setEditSaved]         = useState(false);

  // Budget
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetInput, setBudgetInput]         = useState(user.budget > 0 ? String(user.budget) : '');
  const [budgetSaved, setBudgetSaved]         = useState(false);
  const [budgetError, setBudgetError]         = useState('');

  // Notifications
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [notifSettings, setNotifSettings]   = useState({
    budgetAlerts: true, monthlyReminder: true, weeklyReport: false, overspendAlert: true,
  });
  const [notifSaved, setNotifSaved] = useState(false);

  // Privacy & Security
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [passwordForm, setPasswordForm]         = useState({ current: '', newPass: '', confirm: '' });
  const [showCurrent, setShowCurrent]           = useState(false);
  const [showNew, setShowNew]                   = useState(false);
  const [showConfirm, setShowConfirm]           = useState(false);
  const [passwordError, setPasswordError]       = useState('');
  const [passwordSaved, setPasswordSaved]       = useState(false);

  // Accounts
  const [showAddAccount, setShowAddAccount]   = useState(false);
  const [newAccountName, setNewAccountName]   = useState('');
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameTarget, setRenameTarget]       = useState(null);
  const [renameVal, setRenameVal]             = useState('');

  // Budget calculations
  const spent       = user.budget > 0 ? Math.round((monthlyExpense / user.budget) * 100) : 0;
  const remaining   = user.budget - monthlyExpense;
  const isNearLimit = user.budget > 0 && spent >= 80;
  const isOver      = user.budget > 0 && spent >= 100;

  // Running balance = budget minus ALL expenses (not just monthly)
  const remainingBalance = user.budget > 0 ? user.budget - totalExpense : null;

  const handleSaveProfile = () => {
    if (!editForm.name.trim() || !editForm.email.trim()) return;
    updateProfile({ name: editForm.name.trim(), email: editForm.email.trim() });
    setEditSaved(true);
    setTimeout(() => { setEditSaved(false); setShowEditModal(false); }, 1200);
  };

  const handleSaveBudget = () => {
    setBudgetError('');
    const val = parseFloat(budgetInput);
    if (!budgetInput || isNaN(val) || val <= 0) { setBudgetError('Please enter a valid budget amount'); return; }
    updateProfile({ budget: val });
    setBudgetSaved(true);
    setTimeout(() => { setBudgetSaved(false); setShowBudgetModal(false); }, 1200);
  };

  const handleSaveNotifications = () => {
    setNotifSaved(true);
    setTimeout(() => { setNotifSaved(false); setShowNotifModal(false); }, 1200);
  };

  const handleSavePassword = () => {
    setPasswordError('');
    if (!passwordForm.current) { setPasswordError('Please enter your current password.'); return; }
    if (passwordForm.newPass.length < 6) { setPasswordError('New password must be at least 6 characters.'); return; }
    if (passwordForm.newPass !== passwordForm.confirm) { setPasswordError('New passwords do not match.'); return; }
    setPasswordSaved(true);
    setTimeout(() => {
      setPasswordSaved(false); setShowPrivacyModal(false);
      setPasswordForm({ current: '', newPass: '', confirm: '' });
    }, 1400);
  };

  // Shared styles
  const overlayStyle = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    backdropFilter: 'blur(4px)', zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
  };
  const modalStyle = {
    background: 'var(--surface)', borderRadius: 24, padding: '2rem',
    width: '100%', maxWidth: 460,
    boxShadow: '0 24px 80px rgba(0,0,0,0.18)', border: '1px solid var(--border)',
    maxHeight: '90vh', overflowY: 'auto',
  };
  const inputStyle = {
    width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem',
    border: '1.5px solid var(--border)', borderRadius: 12,
    fontSize: '0.9rem', background: 'var(--bg)', outline: 'none',
    transition: 'all 0.2s', color: 'var(--text-primary)', boxSizing: 'border-box',
  };
  const inputStylePlain = {
    ...inputStyle, paddingLeft: '1rem',
  };
  const toggleStyle = (on) => ({
    width: 46, height: 26, borderRadius: 99,
    background: on ? 'var(--accent)' : 'var(--border)',
    position: 'relative', cursor: 'pointer',
    transition: 'background 0.25s', flexShrink: 0, border: 'none', padding: 0,
  });
  const thumbStyle = (on) => ({
    position: 'absolute', top: 3, left: on ? 23 : 3,
    width: 20, height: 20, borderRadius: '50%', background: 'white',
    transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
  });

  // Settings rows — Budget Settings hidden for admin
  const settingsRows = [
    {
      icon: theme === 'dark' ? Sun : Moon,
      label: 'Appearance',
      color: 'var(--accent)', bg: 'var(--accent-light)',
      desc: `Currently using ${theme === 'dark' ? 'Dark' : 'Light'} theme`,
      action: toggleTheme,
      rightEl: (
        <div style={toggleStyle(theme === 'dark')}>
          <span style={thumbStyle(theme === 'dark')} />
        </div>
      ),
    },
    {
      icon: Bell, label: 'Notifications',
      color: 'var(--amber)', bg: 'var(--amber-light)',
      desc: `Budget alerts and reminders · ${Object.values(notifSettings).filter(Boolean).length} active`,
      action: () => setShowNotifModal(true),
    },
    {
      icon: Shield, label: 'Privacy & Security',
      color: 'var(--mint)', bg: 'var(--mint-light)',
      desc: 'Manage your data and password',
      action: () => { setPasswordForm({ current: '', newPass: '', confirm: '' }); setPasswordError(''); setShowPrivacyModal(true); },
    },
    ...(user.role !== 'admin' ? [{
      icon: Target, label: 'Budget Settings',
      color: 'var(--accent)', bg: 'var(--accent-light)',
      desc: user.budget > 0 ? `Current: ₹${user.budget.toLocaleString()} · Balance: ₹${(remainingBalance ?? 0).toLocaleString()}` : 'Set your monthly spending limit',
      action: () => { setBudgetInput(user.budget > 0 ? String(user.budget) : ''); setBudgetError(''); setShowBudgetModal(true); },
    }] : []),
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar active="profile" />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '2rem' }}>Profile</h1>

        {/* Budget warning banner */}
        {user.role !== 'admin' && user.budget > 0 && isNearLimit && (
          <div style={{ background: isOver ? '#fff0f0' : '#fffbeb', border: `1.5px solid ${isOver ? '#fca5a5' : '#fcd34d'}`, borderRadius: 14, padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertTriangle size={20} color={isOver ? '#dc2626' : '#d97706'} />
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.9rem', color: isOver ? '#dc2626' : '#92400e', margin: 0 }}>
                {isOver ? '⚠️ Budget Exceeded!' : '⚠️ Approaching Budget Limit!'}
              </p>
              <p style={{ fontSize: '0.8rem', color: isOver ? '#b91c1c' : '#78350f', margin: '2px 0 0' }}>
                {isOver
                  ? `You've exceeded your ₹${user.budget.toLocaleString()} budget by ₹${Math.abs(remaining).toLocaleString()}`
                  : `You've used ${spent}% of your ₹${user.budget.toLocaleString()} budget. ₹${remaining.toLocaleString()} remaining.`}
              </p>
            </div>
          </div>
        )}

        {/* Avatar card */}
        <div style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', borderRadius: 24, padding: '2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', boxShadow: '0 8px 32px rgba(124,111,247,0.3)' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 800, color: 'white', border: '3px solid rgba(255,255,255,0.4)', flexShrink: 0 }}>
            {user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?'}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ color: 'white', fontWeight: 800, fontSize: '1.35rem', marginBottom: '0.25rem' }}>{user.name || 'Your Name'}</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>{user.email}</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', marginTop: 4 }}>
              {user.role === 'admin' ? '🛡️ Administrator' : '👤 User'}
            </p>
          </div>
          <button onClick={() => { setEditForm({ name: user.name, email: user.email }); setShowEditModal(true); }}
            style={{ padding: '0.6rem 1.25rem', borderRadius: 12, border: '2px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', backdropFilter: 'blur(10px)', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
            <Edit3 size={15} /> Edit Profile
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
          {[
            { label: 'Total Tracked', val: `₹${totalExpense.toLocaleString()}`, color: 'var(--accent)' },
            { label: 'This Month',    val: `₹${monthlyExpense.toLocaleString()}`, color: 'var(--coral)' },
            {
              label: user.role === 'admin' ? 'Role' : 'Remaining Balance',
              val:   user.role === 'admin' ? 'Admin' : user.budget > 0 ? `₹${(remainingBalance ?? 0).toLocaleString()}` : 'No budget set',
              color: user.role === 'admin' ? 'var(--accent)' : remainingBalance !== null && remainingBalance < 0 ? 'var(--coral)' : 'var(--mint)',
            },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--surface)', borderRadius: 16, padding: '1.25rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: s.color, letterSpacing: '-0.02em' }}>{s.val}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Budget progress — users only */}
        {user.role !== 'admin' && (
          <div style={{ background: 'var(--surface)', borderRadius: 20, padding: '1.5rem', marginBottom: '1.25rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Monthly Budget Usage</span>
              <span style={{ fontWeight: 700, color: isOver ? '#dc2626' : spent > 80 ? 'var(--coral)' : 'var(--accent)', fontSize: '0.9rem' }}>
                {user.budget > 0 ? `${spent}%` : '—'}
              </span>
            </div>
            <div style={{ height: 10, background: 'var(--bg)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${user.budget > 0 ? Math.min(spent, 100) : 0}%`, borderRadius: 99, background: isOver ? 'linear-gradient(90deg,#dc2626,#ff6b6b)' : spent > 80 ? 'linear-gradient(90deg,var(--coral),#ff9a3c)' : 'linear-gradient(90deg,var(--accent),var(--mint))', transition: 'width 0.8s ease' }} />
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              {user.budget > 0
                ? `₹${monthlyExpense.toLocaleString()} spent of ₹${user.budget.toLocaleString()} · ${remaining >= 0 ? `₹${remaining.toLocaleString()} remaining` : `₹${Math.abs(remaining).toLocaleString()} over budget`}`
                : 'No budget set. Click "Budget Settings" below to set one.'}
            </p>
          </div>
        )}

        {/* Settings rows */}
        <div style={{ background: 'var(--surface)', borderRadius: 20, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          {settingsRows.map(({ icon: Icon, label, desc, color, bg, action, rightEl }, i, arr) => (
            <div key={label} onClick={action}
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} color={color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{label}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{desc}</div>
              </div>
              {rightEl ?? <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>›</span>}
            </div>
          ))}
        </div>

        {/* Accounts section — users only */}
        {user.role !== 'admin' && (
          <div style={{ background: 'var(--surface)', borderRadius: 20, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', padding: '1.5rem', marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>My Accounts</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>Personal, Office, Loans, etc.</p>
              </div>
              <button onClick={() => { setNewAccountName(''); setShowAddAccount(true); }}
                style={{ padding: '0.45rem 1rem', borderRadius: 99, border: '1.5px solid var(--accent)', background: 'var(--accent-light)', color: 'var(--accent)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Plus size={14} /> Add
              </button>
            </div>
            {accounts.length === 0
              ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <Wallet size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
                  <p style={{ margin: 0 }}>No accounts yet. Add your first one above.</p>
                </div>
              )
              : accounts.map((acc, i) => (
                <div key={acc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 0', borderBottom: i < accounts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Wallet size={16} color="var(--accent)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{acc.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Added {new Date(acc.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => { setRenameTarget(acc); setRenameVal(acc.name); setShowRenameModal(true); }}
                      style={{ padding: '0.3rem 0.7rem', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', fontSize: '0.78rem', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Rename
                    </button>
                    <button onClick={() => deleteAccount(acc.id)}
                      style={{ padding: '0.3rem 0.7rem', borderRadius: 8, border: '1px solid #fca5a5', background: 'var(--coral-light)', fontSize: '0.78rem', cursor: 'pointer', color: 'var(--coral)', fontWeight: 600 }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Sign Out */}
        <button onClick={() => logout()}
          style={{ width: '100%', marginTop: '1.25rem', padding: '0.875rem', borderRadius: 14, border: '1.5px solid var(--coral)', background: 'var(--coral-light)', color: 'var(--coral)', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--coral)'; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--coral-light)'; e.currentTarget.style.color = 'var(--coral)'; }}>
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      {/* ── Edit Profile Modal ── */}
      {showEditModal && (
        <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) setShowEditModal(false); }}>
          <div style={modalStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.25rem', margin: 0 }}>Edit Profile</h2>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} placeholder="Your full name" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e  => e.target.style.borderColor = 'var(--border)'} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} placeholder="your@email.com" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e  => e.target.style.borderColor = 'var(--border)'} />
                </div>
              </div>
              <button onClick={handleSaveProfile}
                style={{ width: '100%', padding: '0.95rem', borderRadius: 12, border: 'none', background: editSaved ? 'linear-gradient(135deg,#16a37a,#43e8b0)' : 'linear-gradient(135deg,var(--accent),var(--accent-2))', color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.3s' }}>
                {editSaved ? <><Check size={18} /> Saved!</> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Notifications Modal ── */}
      {showNotifModal && (
        <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) setShowNotifModal(false); }}>
          <div style={modalStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.25rem', margin: 0 }}>Notifications</h2>
              <button onClick={() => setShowNotifModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Choose which alerts you want to receive.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1.75rem' }}>
              {[
                { key: 'budgetAlerts',    label: 'Budget Alerts',     desc: 'Get notified when you hit 80% of your budget' },
                { key: 'overspendAlert',  label: 'Overspend Alert',   desc: 'Alert when you exceed your monthly budget' },
                { key: 'monthlyReminder', label: 'Monthly Reminder',  desc: 'Reminder at the start of each month to review expenses' },
                { key: 'weeklyReport',    label: 'Weekly Report',     desc: 'Summary of your weekly spending activity' },
              ].map(({ key, label, desc }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{label}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
                  </div>
                  <button style={toggleStyle(notifSettings[key])} onClick={() => setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }))} aria-label={`Toggle ${label}`}>
                    <span style={thumbStyle(notifSettings[key])} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={handleSaveNotifications}
              style={{ width: '100%', padding: '0.95rem', borderRadius: 12, border: 'none', background: notifSaved ? 'linear-gradient(135deg,#16a37a,#43e8b0)' : 'linear-gradient(135deg,var(--accent),var(--accent-2))', color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.3s' }}>
              {notifSaved ? <><Check size={18} /> Saved!</> : <><Bell size={18} /> Save Preferences</>}
            </button>
          </div>
        </div>
      )}

      {/* ── Privacy & Security Modal ── */}
      {showPrivacyModal && (
        <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) setShowPrivacyModal(false); }}>
          <div style={modalStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.25rem', margin: 0 }}>Privacy & Security</h2>
              <button onClick={() => setShowPrivacyModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Change your password to keep your account secure.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', marginBottom: '1.5rem' }}>

              {/* Current Password */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Current Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type={showCurrent ? 'text' : 'password'} value={passwordForm.current}
                    onChange={e => { setPasswordForm({ ...passwordForm, current: e.target.value }); setPasswordError(''); }}
                    placeholder="Enter current password"
                    style={{ ...inputStyle, paddingRight: '2.75rem' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e  => e.target.style.borderColor = 'var(--border)'} />
                  <button onClick={() => setShowCurrent(v => !v)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type={showNew ? 'text' : 'password'} value={passwordForm.newPass}
                    onChange={e => { setPasswordForm({ ...passwordForm, newPass: e.target.value }); setPasswordError(''); }}
                    placeholder="At least 6 characters"
                    style={{ ...inputStyle, paddingRight: '2.75rem' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e  => e.target.style.borderColor = 'var(--border)'} />
                  <button onClick={() => setShowNew(v => !v)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordForm.newPass && (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ height: 4, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 99, transition: 'width 0.3s, background 0.3s',
                        width: passwordForm.newPass.length < 6 ? '30%' : passwordForm.newPass.length < 10 ? '65%' : '100%',
                        background: passwordForm.newPass.length < 6 ? 'var(--coral)' : passwordForm.newPass.length < 10 ? '#f59e0b' : 'var(--mint)',
                      }} />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: passwordForm.newPass.length < 6 ? 'var(--coral)' : passwordForm.newPass.length < 10 ? '#d97706' : 'var(--mint)', marginTop: 3, display: 'block' }}>
                      {passwordForm.newPass.length < 6 ? 'Weak' : passwordForm.newPass.length < 10 ? 'Fair' : 'Strong'}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type={showConfirm ? 'text' : 'password'} value={passwordForm.confirm}
                    onChange={e => { setPasswordForm({ ...passwordForm, confirm: e.target.value }); setPasswordError(''); }}
                    placeholder="Re-enter new password"
                    style={{ ...inputStyle, paddingRight: '2.75rem', borderColor: passwordForm.confirm && passwordForm.confirm !== passwordForm.newPass ? 'var(--coral)' : 'var(--border)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e  => e.target.style.borderColor = (passwordForm.confirm && passwordForm.confirm !== passwordForm.newPass) ? 'var(--coral)' : 'var(--border)'} />
                  <button onClick={() => setShowConfirm(v => !v)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordForm.confirm && passwordForm.confirm !== passwordForm.newPass && (
                  <p style={{ color: 'var(--coral)', fontSize: '0.75rem', marginTop: 4 }}>Passwords do not match</p>
                )}
              </div>

              {passwordError && (
                <div style={{ background: 'var(--coral-light)', border: '1px solid #fca5a5', borderRadius: 10, padding: '0.65rem 1rem', fontSize: '0.82rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertTriangle size={14} /> {passwordError}
                </div>
              )}
            </div>
            <button onClick={handleSavePassword}
              style={{ width: '100%', padding: '0.95rem', borderRadius: 12, border: 'none', background: passwordSaved ? 'linear-gradient(135deg,#16a37a,#43e8b0)' : 'linear-gradient(135deg,var(--accent),var(--accent-2))', color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.3s' }}>
              {passwordSaved ? <><Check size={18} /> Password Updated!</> : <><Shield size={18} /> Update Password</>}
            </button>
          </div>
        </div>
      )}

      {/* ── Budget Modal — users only ── */}
      {showBudgetModal && user.role !== 'admin' && (
        <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) setShowBudgetModal(false); }}>
          <div style={modalStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.25rem', margin: 0 }}>Set Monthly Budget</h2>
              <button onClick={() => setShowBudgetModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              Set your spending limit. You'll be warned when adding an expense that puts you over.
            </p>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Monthly Budget (₹)</label>
              <div style={{ position: 'relative' }}>
                <IndianRupee size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="number" min="1" value={budgetInput}
                  onChange={e => { setBudgetInput(e.target.value); setBudgetError(''); }}
                  placeholder="Enter your budget e.g. 30000"
                  style={{ ...inputStyle, fontSize: '1.1rem', fontWeight: 700, borderColor: budgetError ? 'var(--coral)' : 'var(--border)' }} autoFocus
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e  => e.target.style.borderColor = budgetError ? 'var(--coral)' : 'var(--border)'} />
              </div>
              {budgetError && <p style={{ color: 'var(--coral)', fontSize: '0.78rem', marginTop: 4 }}>{budgetError}</p>}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {[10000, 20000, 30000, 50000, 80000, 100000].map(preset => (
                <button key={preset} onClick={() => { setBudgetInput(String(preset)); setBudgetError(''); }}
                  style={{ padding: '0.35rem 0.85rem', borderRadius: 99, border: '1.5px solid', borderColor: budgetInput === String(preset) ? 'var(--accent)' : 'var(--border)', background: budgetInput === String(preset) ? 'var(--accent-light)' : 'transparent', color: budgetInput === String(preset) ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
                  ₹{(preset / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
            <button onClick={handleSaveBudget}
              style={{ width: '100%', padding: '0.95rem', borderRadius: 12, border: 'none', background: budgetSaved ? 'linear-gradient(135deg,#16a37a,#43e8b0)' : 'linear-gradient(135deg,var(--accent),var(--accent-2))', color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.3s' }}>
              {budgetSaved ? <><Check size={18} /> Budget Saved!</> : <><Target size={18} /> Set Budget</>}
            </button>
          </div>
        </div>
      )}

      {/* ── Add Account Modal ── */}
      {showAddAccount && (
        <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) setShowAddAccount(false); }}>
          <div style={modalStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>Add Account</h2>
              <button onClick={() => setShowAddAccount(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Give your account a name — Personal, Office, Loan to someone, etc.</p>
            <input type="text" placeholder="e.g. Office, Loan to Ravi, Savings" value={newAccountName}
              onChange={e => setNewAccountName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && newAccountName.trim()) { addAccount(newAccountName.trim()); setNewAccountName(''); setShowAddAccount(false); } }}
              style={{ ...inputStylePlain, marginBottom: '1rem' }} autoFocus />
            <button onClick={() => { if (!newAccountName.trim()) return; addAccount(newAccountName.trim()); setNewAccountName(''); setShowAddAccount(false); }}
              style={{ width: '100%', padding: '0.95rem', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,var(--accent),var(--accent-2))', color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
              Add Account
            </button>
          </div>
        </div>
      )}

      {/* ── Rename Account Modal ── */}
      {showRenameModal && (
        <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) setShowRenameModal(false); }}>
          <div style={modalStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>Rename Account</h2>
              <button onClick={() => setShowRenameModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <input type="text" value={renameVal} onChange={e => setRenameVal(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && renameVal.trim()) { renameAccount(renameTarget.id, renameVal.trim()); setShowRenameModal(false); } }}
              style={{ ...inputStylePlain, marginBottom: '1rem' }} autoFocus />
            <button onClick={() => { if (!renameVal.trim()) return; renameAccount(renameTarget.id, renameVal.trim()); setShowRenameModal(false); }}
              style={{ width: '100%', padding: '0.95rem', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,var(--accent),var(--accent-2))', color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
              Save Name
            </button>
          </div>
        </div>
      )}
    </div>
  );
}