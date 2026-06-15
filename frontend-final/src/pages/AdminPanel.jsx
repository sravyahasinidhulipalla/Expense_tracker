import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield, Users, TrendingUp, DollarSign, Trash2, Download,
  Search, ChevronDown, ChevronUp, AlertTriangle, CheckCircle,
  BarChart2, PieChart, Activity, Bell, Edit2, X, Save, RefreshCw,
  UserX, Eye, Wallet,
} from 'lucide-react';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const pct = (part, total) => (total ? ((part / total) * 100).toFixed(1) : '0.0');

const CATEGORY_COLORS = {
  Food: '#f59e0b', Transport: '#3b82f6', Entertainment: '#8b5cf6',
  Shopping: '#ec4899', Health: '#10b981', Education: '#06b6d4',
  Utilities: '#64748b', Other: '#94a3b8',
};

function StatCard({ icon: Icon, label, value, sub, color = '#7c6ff7', danger }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
      border: `1.5px solid ${danger ? '#fca5a5' : 'var(--border)'}`,
      borderRadius: 16, padding: '1.25rem 1.5rem',
      display: 'flex', alignItems: 'flex-start', gap: 14,
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
        background: danger ? '#fff0f0' : `${color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} color={danger ? '#ef4444' : color} />
      </div>
      <div>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: '1.35rem', fontWeight: 800, color: danger ? '#ef4444' : 'var(--text-primary)', lineHeight: 1.1 }}>{value}</div>
        {sub && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3 }}>{sub}</div>}
      </div>
    </div>
  );
}

function BudgetEditor({ user: u, onSave, onClose }) {
  const [val, setVal] = useState(String(u.budget || 50000));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <input type="number" value={val} onChange={e => setVal(e.target.value)} style={{
        width: 120, padding: '0.35rem 0.6rem', borderRadius: 8,
        border: '1.5px solid var(--accent)', fontSize: '0.85rem',
        background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none',
      }} />
      <button onClick={() => onSave(Number(val))} style={{ background: '#10b981', border: 'none', borderRadius: 7, padding: '0.35rem 0.6rem', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center' }}>
        <Save size={14} />
      </button>
      <button onClick={onClose} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 7, padding: '0.35rem 0.6rem', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
        <X size={14} />
      </button>
    </div>
  );
}

function UserRow({ u, onDelete, onSetBudget }) {
  const [expanded, setExpanded]     = useState(false);
  const [editBudget, setEditBudget] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const spent      = useMemo(() => u.expenses.reduce((s, e) => s + e.amount, 0), [u.expenses]);
  const budget     = u.budget || 50000;
  const usedPct    = Math.min((spent / budget) * 100, 100);
  const overBudget = spent > budget;
  const isAdmin    = u.role?.toLowerCase().includes('admin');
  const barColor   = usedPct > 90 ? '#ef4444' : usedPct > 70 ? '#f59e0b' : '#10b981';

  return (
    <div style={{
      background: 'rgba(255,255,255,0.95)',
      border: `1.5px solid ${overBudget ? '#fca5a5' : 'var(--border)'}`,
      borderRadius: 14, overflow: 'hidden',
    }}>
      <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Avatar */}
        <div style={{
          width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
          background: isAdmin ? 'linear-gradient(135deg,#f59e0b,#ef4444)' : 'linear-gradient(135deg,var(--accent),var(--accent-2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.8rem', fontWeight: 800, color: 'white',
        }}>
          {u.userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
        </div>

        {/* Name + badges */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{u.userName}</span>
            {isAdmin && (
              <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: 99, background: 'linear-gradient(135deg,#f59e0b,#ef4444)', color: 'white' }}>ADMIN</span>
            )}
            {overBudget && (
              <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: 99, background: '#fff0f0', color: '#ef4444', border: '1px solid #fca5a5' }}>
                <AlertTriangle size={9} style={{ display: 'inline', marginRight: 3 }} />OVER BUDGET
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.userEmail}</div>
        </div>

        {/* Budget bar */}
        <div style={{ width: 140, flexShrink: 0 }}>
          {editBudget ? (
            <BudgetEditor user={u} onSave={v => { onSetBudget(u.userId, v); setEditBudget(false); }} onClose={() => setEditBudget(false)} />
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                <span>{fmt(spent)}</span>
                <button onClick={() => setEditBudget(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.7rem' }}>
                  {fmt(budget)} <Edit2 size={10} />
                </button>
              </div>
              <div style={{ height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${usedPct}%`, height: '100%', background: barColor, borderRadius: 99, transition: 'width 0.4s' }} />
              </div>
            </>
          )}
        </div>

        {/* Expense count */}
        <div style={{ textAlign: 'center', flexShrink: 0, minWidth: 56 }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{u.expenses.length}</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>expenses</div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button onClick={() => setExpanded(x => !x)} style={{
            padding: '0.4rem 0.6rem', borderRadius: 8, border: '1px solid var(--border)',
            background: expanded ? 'var(--accent-light)' : 'var(--bg)', cursor: 'pointer',
            color: expanded ? 'var(--accent)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <Eye size={14} />
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {confirmDel ? (
            <>
              <button onClick={() => { onDelete(u.userId); setConfirmDel(false); }} style={{ padding: '0.4rem 0.7rem', borderRadius: 8, border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>Confirm</button>
              <button onClick={() => setConfirmDel(false)} style={{ padding: '0.4rem 0.7rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem' }}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setConfirmDel(true)} style={{
              padding: '0.4rem 0.6rem', borderRadius: 8, border: '1px solid #fca5a5',
              background: '#fff0f0', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center',
            }}>
              <UserX size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Expanded expense table */}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)', padding: '0.75rem 1.25rem' }}>
          {u.expenses.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', padding: '0.75rem 0' }}>No expenses recorded</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  {['Date', 'Title', 'Category', 'Amount'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.35rem 0.5rem', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {u.expenses.slice().sort((a, b) => b.date?.localeCompare(a.date)).map(e => (
                  <tr key={e.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.4rem 0.5rem', color: 'var(--text-muted)' }}>{e.date}</td>
                    <td style={{ padding: '0.4rem 0.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>{e.title}</td>
                    <td style={{ padding: '0.4rem 0.5rem' }}>
                      <span style={{
                        padding: '0.15rem 0.5rem', borderRadius: 99, fontSize: '0.7rem', fontWeight: 600,
                        background: `${CATEGORY_COLORS[e.category] || '#94a3b8'}20`,
                        color: CATEGORY_COLORS[e.category] || '#64748b',
                      }}>{e.category}</span>
                    </td>
                    <td style={{ padding: '0.4rem 0.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{fmt(e.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

function CategoryDonut({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '2rem 0' }}>No data</div>;

  const cx = 80, cy = 80, r = 60, inner = 36;
  let angle = -Math.PI / 2;

  const slices = data.map(d => {
    const sweep = (d.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    angle += sweep;
    const x2 = cx + r * Math.cos(angle);
    const y2 = cy + r * Math.sin(angle);
    const xi1 = cx + inner * Math.cos(angle - sweep);
    const xi2 = cx + inner * Math.cos(angle);
    const yi1 = cy + inner * Math.sin(angle - sweep);
    const yi2 = cy + inner * Math.sin(angle);
    const lg  = sweep > Math.PI ? 1 : 0;
    return { ...d, path: `M${x1},${y1} A${r},${r} 0 ${lg},1 ${x2},${y2} L${xi2},${yi2} A${inner},${inner} 0 ${lg},0 ${xi1},${yi1} Z` };
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <svg width={160} height={160} viewBox="0 0 160 160">
        {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} />)}
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize={10} fill="var(--text-muted)">Total</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--text-primary)">{fmt(total)}</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.78rem', flex: 1, color: 'var(--text-secondary)' }}>{s.label}</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>{pct(s.value, total)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const { allUsersData, adminStats, adminDeleteUser, adminSetUserBudget, adminExportCSV, fetchAllUsersData } = useApp();

  const [search,     setSearch]     = useState('');
  const [sortBy,     setSortBy]     = useState('name');
  const [filterOB,   setFilterOB]   = useState(false);
  const [tab,        setTab]        = useState('users');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllUsersData();
    setRefreshing(false);
  };

  const filtered = useMemo(() => {
    let list = allUsersData.filter(u => !u.role?.toLowerCase().includes('admin'));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(u => u.userName.toLowerCase().includes(q) || u.userEmail.toLowerCase().includes(q));
    }
    if (filterOB) list = list.filter(u => u.expenses.reduce((s, e) => s + e.amount, 0) > (u.budget || 50000));
    return [...list].sort((a, b) => {
      if (sortBy === 'name')     return a.userName.localeCompare(b.userName);
      if (sortBy === 'spent')    return b.expenses.reduce((s, e) => s + e.amount, 0) - a.expenses.reduce((s, e) => s + e.amount, 0);
      if (sortBy === 'expenses') return b.expenses.length - a.expenses.length;
      return 0;
    });
  }, [allUsersData, search, sortBy, filterOB]);

  const categoryData = useMemo(() => {
    const allExp = allUsersData.flatMap(u => u.expenses);
    const map    = allExp.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {});
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6)
      .map(([k, v]) => ({ label: k, value: v, color: CATEGORY_COLORS[k] || '#94a3b8' }));
  }, [allUsersData]);

  const alerts = useMemo(() =>
    allUsersData
      .filter(u => !u.role?.toLowerCase().includes('admin'))
      .map(u => { const spent = u.expenses.reduce((s, e) => s + e.amount, 0); const budget = u.budget || 50000; return { ...u, spent, budget, usedPct: (spent / budget) * 100 }; })
      .filter(u => u.usedPct >= 80)
      .sort((a, b) => b.usedPct - a.usedPct),
  [allUsersData]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 13, background: 'linear-gradient(135deg,#f59e0b,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={22} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>Admin Panel</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
              {adminStats?.totalUsers ?? 0} users · {allUsersData.flatMap(u => u.expenses).length} total expenses
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleRefresh} disabled={refreshing} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '0.55rem 1rem',
            borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--bg)',
            cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)',
          }}>
            <RefreshCw size={14} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
            Refresh
          </button>
          <button onClick={adminExportCSV} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '0.55rem 1.1rem',
            borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,var(--accent),var(--accent-2))',
            color: 'white', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700,
            boxShadow: '0 3px 12px rgba(124,111,247,0.35)',
          }}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stat cards */}
      {adminStats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: 14, marginBottom: '1.75rem' }}>
          <StatCard icon={Users}         label="Total Users"    value={adminStats.totalUsers}        color="#3b82f6" />
          <StatCard icon={DollarSign}    label="Platform Spend" value={fmt(adminStats.totalSpend)}   color="#7c6ff7" />
          <StatCard icon={TrendingUp}    label="Avg per User"   value={fmt(adminStats.avgPerUser)}   color="#10b981" />
          <StatCard icon={BarChart2}     label="This Month"     value={fmt(adminStats.monthlyTotal)} color="#06b6d4" />
          <StatCard icon={AlertTriangle} label="Over Budget"    value={adminStats.overBudget}        sub="users exceeding limit" danger={adminStats.overBudget > 0} />
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: '1.25rem', background: 'var(--bg)', borderRadius: 12, padding: '0.3rem', border: '1px solid var(--border)', width: 'fit-content' }}>
        {[
          { key: 'users',     label: 'Users',     Icon: Users    },
          { key: 'analytics', label: 'Analytics', Icon: PieChart },
          { key: 'alerts',    label: `Alerts${alerts.length ? ` (${alerts.length})` : ''}`, Icon: Bell },
        ].map(({ key, label, Icon }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1.1rem',
            borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: '0.83rem', fontWeight: 600,
            background: tab === key ? 'white' : 'transparent',
            color: tab === key ? 'var(--accent)' : 'var(--text-secondary)',
            boxShadow: tab === key ? '0 1px 6px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s',
          }}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* ── USERS tab ─────────────────────────────────── */}
      {tab === 'users' && (
        <>
          <div style={{ display: 'flex', gap: 10, marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1 1 220px' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…" style={{
                width: '100%', padding: '0.55rem 0.75rem 0.55rem 2.1rem',
                border: '1.5px solid var(--border)', borderRadius: 10,
                fontSize: '0.85rem', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none',
              }} />
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
              padding: '0.55rem 0.9rem', border: '1.5px solid var(--border)', borderRadius: 10,
              fontSize: '0.83rem', background: 'var(--bg)', color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none',
            }}>
              <option value="name">Sort: Name</option>
              <option value="spent">Sort: Most Spent</option>
              <option value="expenses">Sort: Most Expenses</option>
            </select>
            <button onClick={() => setFilterOB(x => !x)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '0.55rem 0.9rem', borderRadius: 10,
              border: `1.5px solid ${filterOB ? '#fca5a5' : 'var(--border)'}`,
              background: filterOB ? '#fff0f0' : 'var(--bg)',
              color: filterOB ? '#ef4444' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.83rem', fontWeight: 600,
            }}>
              <AlertTriangle size={13} /> Over Budget Only
            </button>
          </div>

          {allUsersData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'rgba(255,255,255,0.7)', borderRadius: 16, border: '1px dashed var(--border)' }}>
              <Users size={36} color="var(--text-muted)" style={{ marginBottom: 12 }} />
              <p style={{ color: 'var(--text-muted)', fontWeight: 600, margin: 0 }}>No user data yet</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '6px 0 0' }}>Click Refresh to load from the server</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No users match your filters</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map(u => (
                <UserRow key={u.userId} u={u} onDelete={adminDeleteUser} onSetBudget={adminSetUserBudget} />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── ANALYTICS tab ──────────────────────────────── */}
      {tab === 'analytics' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
          <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 16, border: '1px solid var(--border)', padding: '1.25rem 1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <PieChart size={16} color="var(--accent)" /> Spending by category
            </h3>
            <CategoryDonut data={categoryData} />
          </div>

          <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 16, border: '1px solid var(--border)', padding: '1.25rem 1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={16} color="#f59e0b" /> Top spenders
            </h3>
            {(() => {
              const ranked = allUsersData
                .filter(u => !u.role?.toLowerCase().includes('admin'))
                .map(u => ({ ...u, spent: u.expenses.reduce((s, e) => s + e.amount, 0) }))
                .sort((a, b) => b.spent - a.spent).slice(0, 5);
              const max = ranked[0]?.spent || 1;
              return ranked.length === 0
                ? <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>No data</p>
                : ranked.map((u, i) => (
                  <div key={u.userId} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', width: 16, textAlign: 'right' }}>#{i + 1}</span>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,var(--accent),var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>
                      {u.userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.userName}</div>
                      <div style={{ height: 5, background: 'var(--border)', borderRadius: 99, marginTop: 4 }}>
                        <div style={{ width: `${(u.spent / max) * 100}%`, height: '100%', background: 'linear-gradient(90deg,var(--accent),var(--accent-2))', borderRadius: 99 }} />
                      </div>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>{fmt(u.spent)}</span>
                  </div>
                ));
            })()}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 16, border: '1px solid var(--border)', padding: '1.25rem 1.5rem', gridColumn: 'span 2' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={16} color="#10b981" /> User activity overview
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {allUsersData.filter(u => !u.role?.toLowerCase().includes('admin')).map(u => {
                const spent  = u.expenses.reduce((s, e) => s + e.amount, 0);
                const budget = u.budget || 50000;
                const p      = Math.min((spent / budget) * 100, 100);
                const color  = p > 90 ? '#ef4444' : p > 70 ? '#f59e0b' : '#10b981';
                return (
                  <div key={u.userId} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, width: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>{u.userName}</span>
                    <div style={{ flex: 1, height: 18, background: 'var(--border)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                      <div style={{ width: `${p}%`, height: '100%', background: color, borderRadius: 6, transition: 'width 0.5s' }} />
                      <span style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>{p.toFixed(0)}%</span>
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, width: 90, textAlign: 'right', color: 'var(--text-primary)' }}>{fmt(spent)}</span>
                  </div>
                );
              })}
              {allUsersData.filter(u => !u.role?.toLowerCase().includes('admin')).length === 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>No users yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── ALERTS tab ─────────────────────────────────── */}
      {tab === 'alerts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {alerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'rgba(255,255,255,0.7)', borderRadius: 16, border: '1px dashed var(--border)' }}>
              <CheckCircle size={36} color="#10b981" style={{ marginBottom: 12 }} />
              <p style={{ color: '#10b981', fontWeight: 700, margin: 0 }}>All users within budget</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '6px 0 0' }}>No one has exceeded 80% of their budget</p>
            </div>
          ) : alerts.map(u => (
            <div key={u.userId} style={{
              background: 'rgba(255,255,255,0.95)',
              border: `1.5px solid ${u.usedPct >= 100 ? '#fca5a5' : '#fde68a'}`,
              borderRadius: 14, padding: '1rem 1.25rem',
              display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: u.usedPct >= 100 ? '#fff0f0' : '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={18} color={u.usedPct >= 100 ? '#ef4444' : '#f59e0b'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{u.userName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.userEmail}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: u.usedPct >= 100 ? '#ef4444' : '#f59e0b' }}>{u.usedPct.toFixed(0)}% used</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{fmt(u.spent)} of {fmt(u.budget)}</div>
              </div>
              <div style={{ width: '100%', height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(u.usedPct, 100)}%`, height: '100%', background: u.usedPct >= 100 ? '#ef4444' : '#f59e0b', borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}