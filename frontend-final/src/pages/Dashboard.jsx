import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Target, CreditCard, Award } from 'lucide-react';

const COLORS = ['#7c6ff7', '#43e8b0', '#ff6b8a', '#ffa940', '#60c3f9', '#f093fb', '#a78bfa', '#34d399'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'white', border: '1px solid var(--border)',
        borderRadius: 12, padding: '0.75rem 1rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      }}>
        <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 4 }}>{label}</p>
        <p style={{ color: 'var(--accent)', fontWeight: 700 }}>
          ₹{Number(payload[0].value || 0).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const {
    user, expenses,
    totalExpense, monthlyExpense,
    highestCategory, categoryTotals,
    monthlyBreakdown, weeklyBreakdown,
  } = useApp();

  const budget    = user.budget || 0;
  const remaining = budget - monthlyExpense;
  const budgetSet = budget > 0;
  const monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  const pieData = Object.entries(categoryTotals)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  const cards = [
    {
      label: 'Total Expenses',
      value: `₹${totalExpense.toLocaleString()}`,
      icon: CreditCard, color: 'var(--accent)', bg: 'var(--accent-light)',
      sub: `${expenses.length} transaction${expenses.length !== 1 ? 's' : ''}`, up: true,
    },
    {
      label: 'This Month',
      value: `₹${monthlyExpense.toLocaleString()}`,
      icon: Wallet, color: 'var(--coral)', bg: 'var(--coral-light)',
      sub: monthName, up: true,
    },
    {
      label: 'Top Category',
      value: highestCategory,
      icon: Award, color: 'var(--amber)', bg: 'var(--amber-light)',
      sub: highestCategory !== 'N/A'
        ? `₹${(categoryTotals[highestCategory] || 0).toLocaleString()}`
        : 'No data yet',
      up: false,
    },
    {
      label: budgetSet ? 'Remaining Budget' : 'Budget Not Set',
      value: budgetSet ? `₹${remaining.toLocaleString()}` : '—',
      icon: Target,
      color: remaining >= 0 ? 'var(--mint)' : 'var(--coral)',
      bg:    remaining >= 0 ? 'var(--mint-light)' : 'var(--coral-light)',
      sub: budgetSet
        ? (remaining >= 0 ? `of ₹${budget.toLocaleString()} budget` : '⚠️ Over budget!')
        : 'Set in Profile page →',
      up: remaining >= 0,
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar active="dashboard" />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem' }}>

        {/* Greeting */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>
            Welcome back, {user.name?.split(' ')[0] || 'User'} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Here's your financial overview for {monthName}
          </p>
        </div>

        {/* Over-budget banner */}
        {budgetSet && remaining < 0 && (
          <div style={{
            background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 14,
            padding: '1rem 1.25rem', marginBottom: '1.5rem',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
            <span style={{ fontWeight: 600, color: '#dc2626', fontSize: '0.9rem' }}>
              You've exceeded your monthly budget by ₹{Math.abs(remaining).toLocaleString()}!
            </span>
          </div>
        )}

        {/* Empty state */}
        {expenses.length === 0 && (
          <div style={{
            background: 'var(--surface)', border: '1px dashed var(--border)',
            borderRadius: 16, padding: '2.5rem', marginBottom: '2rem',
            textAlign: 'center', color: 'var(--text-muted)',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📊</div>
            <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem' }}>No expenses yet</p>
            <p style={{ fontSize: '0.85rem' }}>Add your first expense to see charts and stats here.</p>
          </div>
        )}

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.1rem', marginBottom: '2rem' }}>
          {cards.map(({ label, value, icon: Icon, color, bg, sub, up }) => (
            <div key={label} style={{
              background: 'var(--surface)', borderRadius: 20, padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', transition: 'all 0.25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={color} />
                </div>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: 99,
                  background: up ? 'var(--accent-light)' : 'var(--coral-light)',
                  color: up ? 'var(--accent)' : 'var(--coral)',
                  display: 'flex', alignItems: 'center', gap: 3,
                }}>
                  {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                </span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color, marginBottom: '0.2rem' }}>{value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.15rem' }}>{label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Charts — only when there is real data */}
        {expenses.length > 0 && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem', marginBottom: '1.25rem' }}>

              {/* Pie chart */}
              <div style={{ background: 'var(--surface)', borderRadius: 20, padding: '1.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.25rem' }}>By Category</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={v => `₹${Number(v).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                  {pieData.map((item, i) => (
                    <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem' }}>
                      <div style={{ width: 8, height: 8, borderRadius: 99, background: COLORS[i % COLORS.length] }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>₹{Number(item.value).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bar chart — last 6 months real data */}
              <div style={{ background: 'var(--surface)', borderRadius: 20, padding: '1.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.25rem' }}>Monthly Expenses (Last 6 Months)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={monthlyBreakdown} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                      tickFormatter={v => v >= 1000 ? `₹${v / 1000}k` : `₹${v}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="amount" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c6ff7" />
                        <stop offset="100%" stopColor="#c4b5fd" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Line chart — weekly real data */}
            <div style={{ background: 'var(--surface)', borderRadius: 20, padding: '1.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                Weekly Spending — {monthName}
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weeklyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                    tickFormatter={v => v >= 1000 ? `₹${v / 1000}k` : `₹${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#7c6ff7" />
                      <stop offset="100%" stopColor="#43e8b0" />
                    </linearGradient>
                  </defs>
                  <Line type="monotone" dataKey="spend" stroke="url(#lineGrad)" strokeWidth={3}
                    dot={{ r: 5, fill: '#7c6ff7', strokeWidth: 2, stroke: 'white' }}
                    activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}