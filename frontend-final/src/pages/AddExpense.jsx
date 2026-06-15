import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import { Tag, Calendar, FileText, Plus, CheckCircle, Delete } from 'lucide-react';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Rent', 'Utilities', 'Other'];
const CATEGORY_ICONS = {
  Food: '🍽️', Transport: '🚗', Shopping: '🛍️', Entertainment: '🎬',
  Health: '💊', Rent: '🏠', Utilities: '💡', Other: '📦',
};

// ── Safe calculator engine ───────────────────────────────────────
// Stores: { left, operator, right, display, justEvaluated }
// "left" and "right" are always plain numeric strings — never an expression.
function calcReducer(state, action) {
  const { left, operator, right, justEvaluated } = state;

  switch (action.type) {
    case 'DIGIT': {
      const d = action.digit;
      if (justEvaluated) {
        return { left: d, operator: '', right: '', display: d, justEvaluated: false };
      }
      if (!operator) {
        if (left === '0' && d !== '.') return { ...state, left: d, display: d };
        if (d === '.' && left.includes('.')) return state;
        const next = (left || '') + d;
        return { ...state, left: next, display: next };
      } else {
        if (right === '0' && d !== '.') return { ...state, right: d, display: d };
        if (d === '.' && right.includes('.')) return state;
        const next = (right || '') + d;
        return { ...state, right: next, display: next };
      }
    }

    case 'OPERATOR': {
      const op = action.op;
      if (left && operator && right) {
        const result = safeEval(parseFloat(left), operator, parseFloat(right));
        if (result === null) return { left: '', operator: '', right: '', display: 'Error', justEvaluated: false };
        const rs = trimNumber(result);
        return { left: rs, operator: op, right: '', display: rs, justEvaluated: false };
      }
      if (left) return { ...state, operator: op, right: '', display: left, justEvaluated: false };
      return state;
    }

    case 'EQUALS': {
      if (!left || !operator || !right) return state;
      const result = safeEval(parseFloat(left), operator, parseFloat(right));
      if (result === null) return { left: '', operator: '', right: '', display: 'Error', justEvaluated: false };
      const rs = trimNumber(result);
      return { left: rs, operator: '', right: '', display: rs, justEvaluated: true };
    }

    case 'CLEAR':
      return { left: '', operator: '', right: '', display: '', justEvaluated: false };

    case 'BACKSPACE': {
      if (justEvaluated) return { left: '', operator: '', right: '', display: '', justEvaluated: false };
      if (operator && right) {
        const next = right.slice(0, -1);
        return { ...state, right: next, display: next || left };
      }
      if (operator && !right) return { ...state, operator: '', display: left };
      const next = left.slice(0, -1);
      return { ...state, left: next, display: next };
    }

    default:
      return state;
  }
}

function safeEval(a, op, b) {
  if (isNaN(a) || isNaN(b)) return null;
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '×': return a * b;
    case '÷': return b === 0 ? null : a / b;
    default:  return null;
  }
}

function trimNumber(n) {
  return parseFloat(n.toFixed(10)).toString();
}

// ── Component ────────────────────────────────────────────────────
export default function AddExpense() {
  const { addExpense, user } = useApp();
  const [form, setForm] = useState({
    name:        '',
    category:    '',
    date:        new Date().toISOString().split('T')[0],
    description: '',
  });
  const [calc, setCalc] = useState({ left: '', operator: '', right: '', display: '', justEvaluated: false });
  const [success, setSuccess] = useState(false);
  const [errors,  setErrors]  = useState({});

  const dispatch = (action) => setCalc(prev => calcReducer(prev, action));

  // The committed amount is only valid when: no operator pending, OR just evaluated
  const amountValue = calc.operator === '' ? calc.left : '';

  const validate = () => {
    const e = {};
    if (!form.name.trim())                        e.name     = 'Enter an expense name';
    const amt = parseFloat(amountValue);
    if (!amountValue || isNaN(amt) || amt <= 0)   e.amount   = 'Enter a valid amount (press = first if using operators)';
    if (!form.category)                           e.category = 'Select a category';
    if (!form.date)                               e.date     = 'Select a date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await addExpense({
      name:        form.name.trim(),
      amount:      parseFloat(amountValue),
      category:    form.category,
      date:        form.date,
      description: form.description,
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setForm({ name: '', category: '', date: new Date().toISOString().split('T')[0], description: '' });
      setCalc({ left: '', operator: '', right: '', display: '', justEvaluated: false });
      setErrors({});
    }, 2000);
  };

  const budget    = user?.budget ?? 50000;
  const remaining = budget - (parseFloat(amountValue) || 0);

  const inputStyle = {
    width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem',
    border: '1.5px solid var(--border)', borderRadius: 12,
    fontSize: '0.9rem', background: 'var(--bg)', outline: 'none',
    transition: 'all 0.2s', color: 'var(--text-primary)', boxSizing: 'border-box',
  };

  const calcBtn = (label, onClick, variant = 'num') => {
    const bg    = variant === 'op' ? 'var(--accent)' : variant === 'eq' ? '#16a37a' : 'transparent';
    const color = variant === 'op' || variant === 'eq' ? '#fff'
                : variant === 'clear' ? 'var(--coral)' : 'var(--text-primary)';
    const border = variant === 'op' || variant === 'eq' ? 'none'
                 : variant === 'clear' ? '1.5px solid var(--coral)' : '1.5px solid var(--border)';
    return (
      <button
        key={label}
        onClick={onClick}
        style={{ padding: '0.65rem 0', borderRadius: 10, border, background: bg, color,
          fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        {label}
      </button>
    );
  };

  const displayText = calc.display === '' ? '0' : calc.display;
  const isError     = calc.display === 'Error';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar active="add" />
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '2rem' }}>

        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>Add Expense</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Log a new expense to keep your records up to date</p>
        </div>

        {/* Remaining balance banner */}
        <div style={{
          background: remaining < 0 ? '#fee2e2' : 'var(--mint-light)',
          border: `1px solid ${remaining < 0 ? '#fca5a5' : '#a7f3d0'}`,
          borderRadius: 14, padding: '0.85rem 1.25rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: '1.1rem' }}>💰</span>
          <span style={{ fontWeight: 600, color: remaining < 0 ? '#dc2626' : '#16a37a', fontSize: '0.9rem' }}>
            Remaining balance: ₹{remaining.toLocaleString('en-IN')}
          </span>
        </div>

        {success && (
          <div style={{
            background: 'var(--mint-light)', border: '1px solid #a7f3d0', borderRadius: 14,
            padding: '1rem 1.25rem', marginBottom: '1.5rem',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <CheckCircle size={20} color="#16a37a" />
            <span style={{ fontWeight: 600, color: '#16a37a', fontSize: '0.9rem' }}>Expense added successfully!</span>
          </div>
        )}

        <div style={{ background: 'var(--surface)', borderRadius: 24, padding: '2.25rem', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>

            {/* Expense Name */}
            <div>
              <label style={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                Expense Name <span style={{ color: 'var(--coral)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <FileText size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="e.g. Grocery run, Uber to airport"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{ ...inputStyle, borderColor: errors.name ? 'var(--coral)' : 'var(--border)' }}
                  onFocus={e  => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e   => e.target.style.borderColor = errors.name ? 'var(--coral)' : 'var(--border)'}
                />
              </div>
              {errors.name && <p style={{ color: 'var(--coral)', fontSize: '0.78rem', marginTop: 4 }}>{errors.name}</p>}
            </div>

            {/* Amount — calculator */}
            <div>
              <label style={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                Amount (₹) <span style={{ color: 'var(--coral)' }}>*</span>
              </label>

              {/* Display screen */}
              <div style={{
                border: `1.5px solid ${errors.amount || isError ? 'var(--coral)' : 'var(--border)'}`,
                borderRadius: 12, padding: '0.85rem 1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'var(--bg)', marginBottom: '0.6rem',
              }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: isError ? 'var(--coral)' : 'var(--text-primary)' }}>
                  ₹{isError ? 'Error' : displayText}
                  {calc.operator && !calc.justEvaluated && (
                    <span style={{ color: 'var(--accent)', fontSize: '1.1rem', marginLeft: 4 }}>{calc.operator}</span>
                  )}
                </span>
                <button
                  onClick={() => dispatch({ type: 'BACKSPACE' })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
                >
                  <Delete size={20} />
                </button>
              </div>

              {/* Keypad — 4 columns: [op] [7] [8] [9] etc. */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
                {calcBtn('+', () => dispatch({ type: 'OPERATOR', op: '+' }), 'op')}
                {calcBtn('7', () => dispatch({ type: 'DIGIT', digit: '7' }))}
                {calcBtn('8', () => dispatch({ type: 'DIGIT', digit: '8' }))}
                {calcBtn('9', () => dispatch({ type: 'DIGIT', digit: '9' }))}

                {calcBtn('-', () => dispatch({ type: 'OPERATOR', op: '-' }), 'op')}
                {calcBtn('4', () => dispatch({ type: 'DIGIT', digit: '4' }))}
                {calcBtn('5', () => dispatch({ type: 'DIGIT', digit: '5' }))}
                {calcBtn('6', () => dispatch({ type: 'DIGIT', digit: '6' }))}

                {calcBtn('×', () => dispatch({ type: 'OPERATOR', op: '×' }), 'op')}
                {calcBtn('1', () => dispatch({ type: 'DIGIT', digit: '1' }))}
                {calcBtn('2', () => dispatch({ type: 'DIGIT', digit: '2' }))}
                {calcBtn('3', () => dispatch({ type: 'DIGIT', digit: '3' }))}

                {calcBtn('÷', () => dispatch({ type: 'OPERATOR', op: '÷' }), 'op')}
                {calcBtn('0', () => dispatch({ type: 'DIGIT', digit: '0' }))}
                {calcBtn('.', () => dispatch({ type: 'DIGIT', digit: '.' }))}
                {calcBtn('=', () => dispatch({ type: 'EQUALS' }), 'eq')}
              </div>

              <button
                onClick={() => dispatch({ type: 'CLEAR' })}
                style={{
                  width: '100%', marginTop: '0.4rem', padding: '0.5rem',
                  background: 'transparent', border: '1.5px solid var(--coral)',
                  borderRadius: 10, color: 'var(--coral)', fontWeight: 700,
                  fontSize: '0.9rem', cursor: 'pointer',
                }}
              >
                Clear
              </button>

              {errors.amount && <p style={{ color: 'var(--coral)', fontSize: '0.78rem', marginTop: 4 }}>{errors.amount}</p>}
            </div>

            {/* Account (static display) */}
            <div>
              <label style={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Account</label>
              <div style={{ position: 'relative' }}>
                <FileText size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <div style={{ ...inputStyle, color: 'var(--text-muted)' }}>Personal (default)</div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label style={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                Category <span style={{ color: 'var(--coral)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Tag size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }} />
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', borderColor: errors.category ? 'var(--coral)' : 'var(--border)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e  => e.target.style.borderColor = errors.category ? 'var(--coral)' : 'var(--border)'}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
                </select>
              </div>
              {errors.category && <p style={{ color: 'var(--coral)', fontSize: '0.78rem', marginTop: 4 }}>{errors.category}</p>}
            </div>

            {/* Quick category pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '-0.5rem' }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setForm({ ...form, category: c })} style={{
                  padding: '0.35rem 0.75rem', borderRadius: 99, border: '1.5px solid',
                  borderColor: form.category === c ? 'var(--accent)' : 'var(--border)',
                  background:  form.category === c ? 'var(--accent-light)' : 'transparent',
                  color:       form.category === c ? 'var(--accent)' : 'var(--text-secondary)',
                  fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  {CATEGORY_ICONS[c]} {c}
                </button>
              ))}
            </div>

            {/* Date */}
            <div>
              <label style={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Date</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="date" value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e  => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                Description <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <FileText size={16} style={{ position: 'absolute', left: '0.875rem', top: '1rem', color: 'var(--text-muted)' }} />
                <textarea
                  placeholder="Any extra notes about this expense"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  style={{ ...inputStyle, paddingLeft: '2.75rem', resize: 'vertical', minHeight: 90 }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e  => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>

            {/* Submit */}
            <button onClick={handleSubmit} style={{
              width: '100%', padding: '1rem', borderRadius: 14, border: 'none',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              color: 'white', fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 20px rgba(124,111,247,0.4)', transition: 'all 0.25s', marginTop: '0.5rem',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,111,247,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,111,247,0.4)'; }}>
              <Plus size={20} /> Add Expense
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}