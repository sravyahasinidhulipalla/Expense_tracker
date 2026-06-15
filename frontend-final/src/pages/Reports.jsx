import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import { Filter, Download, Search, Trash2, Edit2, Check, X, AlertTriangle } from 'lucide-react';

const CATEGORIES = ['All', 'Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Rent', 'Utilities', 'Medical', 'Trips', 'Miscellaneous', 'Other'];
const EDIT_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Rent', 'Utilities', 'Medical', 'Trips', 'Miscellaneous', 'Other'];
const CAT_COLORS = { Food: '#ff6b8a', Transport: '#60c3f9', Shopping: '#7c6ff7', Entertainment: '#f093fb', Health: '#43e8b0', Rent: '#ffa940', Utilities: '#a78bfa', Medical: '#f87171', Trips: '#34d399', Miscellaneous: '#fb923c', Other: '#9ca3af' };
const MONTHS = ['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const PAGE_SIZE = 8;

export default function Reports() {
  const { expenses, deleteExpense, editExpense, user, monthlyExpense } = useApp();
  const [category, setCategory] = useState('All');
  const [month, setMonth] = useState('All');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const filtered = expenses.filter(e => {
    const catOk = category === 'All' || e.category === category;
    const monthOk = month === 'All' || new Date(e.date).toLocaleString('default', { month: 'long' }) === month;
    const searchOk = !search || (e.description || '').toLowerCase().includes(search.toLowerCase()) || (e.category || '').toLowerCase().includes(search.toLowerCase());
    return catOk && monthOk && searchOk;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);

  const budgetSet = user.budget > 0;
  const spent = budgetSet ? Math.round((monthlyExpense / user.budget) * 100) : 0;
  const isNearLimit = budgetSet && spent >= 80;
  const isOver = budgetSet && spent >= 100;

  const startEdit = (exp) => { setEditingId(exp.id); setEditForm({ amount: String(exp.amount), category: exp.category, description: exp.description || '', date: exp.date }); };
  const cancelEdit = () => { setEditingId(null); setEditForm({}); };
  const saveEdit = () => { if (!editForm.amount || isNaN(editForm.amount) || +editForm.amount <= 0) return; editExpense(editingId, editForm); cancelEdit(); };

  const cellStyle = { padding: '0.875rem 1rem', fontSize: '0.875rem', verticalAlign: 'middle' };
  const inlineInputStyle = { padding: '0.4rem 0.6rem', border: '1.5px solid var(--accent)', borderRadius: 8, fontSize: '0.85rem', background: 'var(--bg)', outline: 'none', color: 'var(--text-primary)' };

  // ── Running balance: sort ALL expenses oldest→newest, deduct from budget in order ──
  const sortedAll = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));
  let runningBalance = user.budget || 0;
  const balanceMap = {};
  sortedAll.forEach(exp => {
    runningBalance -= exp.amount;
    balanceMap[exp.id] = runningBalance;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar active="reports" />
      <div style={{ maxWidth: 1150, margin: '0 auto', padding: '2rem' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>Reports</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {filtered.length} transactions · Total: <strong style={{ color: 'var(--text-primary)' }}>₹{totalFiltered.toLocaleString()}</strong>
            </p>
          </div>
          <button
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.75rem 1.5rem', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: 'white', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(124,111,247,0.35)', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <Download size={16} /> Download PDF
          </button>
        </div>

        {isNearLimit && (
          <div style={{ background: isOver ? '#fff0f0' : '#fffbeb', border: `1.5px solid ${isOver ? '#fca5a5' : '#fcd34d'}`, borderRadius: 14, padding: '0.875rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertTriangle size={18} color={isOver ? '#dc2626' : '#d97706'} />
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: isOver ? '#dc2626' : '#92400e', margin: 0 }}>
              {isOver
                ? `⚠️ Budget exceeded! Spent ₹${monthlyExpense.toLocaleString()} of ₹${user.budget.toLocaleString()}`
                : `⚠️ ${spent}% of ₹${user.budget.toLocaleString()} monthly budget used.`}
            </p>
          </div>
        )}

        {/* Filters */}
        <div style={{ background: 'var(--surface)', borderRadius: 18, padding: '1.25rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
            <Filter size={16} color="var(--text-muted)" />
            <div style={{ position: 'relative', flex: '1 1 200px' }}>
              <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                placeholder="Search expenses..."
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                style={{ width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.2rem', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: '0.85rem', background: 'var(--bg)', outline: 'none', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <select
              value={month}
              onChange={e => { setMonth(e.target.value); setCurrentPage(1); }}
              style={{ padding: '0.6rem 1rem', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: '0.85rem', background: 'var(--bg)', outline: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}>
              {MONTHS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => { setCategory(c); setCurrentPage(1); }}
                style={{ padding: '0.3rem 0.7rem', borderRadius: 99, border: '1.5px solid', borderColor: category === c ? 'var(--accent)' : 'var(--border)', background: category === c ? 'var(--accent-light)' : 'transparent', color: category === c ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: 'var(--surface)', borderRadius: 20, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                  {['Date', 'Description', 'Category', 'Amount', 'Balance', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No expenses found</td>
                  </tr>
                ) : paged.map((exp, i) => {
                  const isEditing = editingId === exp.id;
                  const remainingAfter = balanceMap[exp.id] ?? (user.budget || 0);
                  const rowIsOver = remainingAfter < 0;
                  const rowIsWarning = !rowIsOver && user.budget > 0 && remainingAfter < user.budget * 0.2;

                  return (
                    <tr
                      key={exp.id}
                      style={{ borderBottom: i < paged.length - 1 ? '1px solid var(--border)' : 'none', background: isEditing ? 'rgba(124,111,247,0.04)' : 'transparent', transition: 'background 0.15s' }}
                      onMouseEnter={e => { if (!isEditing) e.currentTarget.style.background = 'var(--bg)'; }}
                      onMouseLeave={e => { if (!isEditing) e.currentTarget.style.background = 'transparent'; }}>

                      {/* DATE */}
                      <td style={cellStyle}>
                        {isEditing
                          ? <input type="date" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} style={{ ...inlineInputStyle, width: 130 }} />
                          : <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>{new Date(exp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                      </td>

                      {/* DESCRIPTION */}
                      <td style={{ ...cellStyle, maxWidth: 220 }}>
                        {isEditing
                          ? <input type="text" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} placeholder="Description" style={{ ...inlineInputStyle, width: '100%' }} />
                          : <span style={{ fontWeight: 500 }}>{exp.description || '—'}</span>}
                      </td>

                      {/* CATEGORY */}
                      <td style={cellStyle}>
                        {isEditing
                          ? <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} style={{ ...inlineInputStyle, cursor: 'pointer' }}>
                              {EDIT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                          : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '0.28rem 0.7rem', borderRadius: 99, fontSize: '0.76rem', fontWeight: 600, background: `${CAT_COLORS[exp.category] || '#9ca3af'}20`, color: CAT_COLORS[exp.category] || 'var(--text-secondary)' }}>
                              <span style={{ width: 6, height: 6, borderRadius: 99, background: CAT_COLORS[exp.category] || '#9ca3af' }} />
                              {exp.category}
                            </span>}
                      </td>

                      {/* AMOUNT */}
                      <td style={cellStyle}>
                        {isEditing
                          ? <input type="number" value={editForm.amount} onChange={e => setEditForm({ ...editForm, amount: e.target.value })} style={{ ...inlineInputStyle, width: 100 }} />
                          : <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--accent)' }}>₹{exp.amount.toLocaleString()}</span>}
                      </td>

                      {/* BALANCE */}
                      <td style={cellStyle}>
                        {user.budget > 0 ? (
                          <>
                            <div style={{ fontWeight: 600, fontSize: '0.83rem', color: rowIsOver ? '#dc2626' : rowIsWarning ? '#d97706' : 'var(--mint)' }}>
                              {rowIsOver
                                ? `₹${Math.abs(remainingAfter).toLocaleString()} over`
                                : `₹${remainingAfter.toLocaleString()} left`}
                            </div>
                            <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: 2 }}>
                              of ₹{user.budget.toLocaleString()} budget
                            </div>
                            {(rowIsOver || rowIsWarning) && (
                              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: rowIsOver ? '#dc2626' : '#d97706', marginTop: 2 }}>
                                {rowIsOver ? '⚠️ Over budget' : '⚠️ Low balance'}
                              </div>
                            )}
                          </>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No budget set</span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td style={{ ...cellStyle, whiteSpace: 'nowrap' }}>
                        {isEditing
                          ? <div style={{ display: 'flex', gap: 6 }}>
                              <button onClick={saveEdit} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'var(--mint-light)', color: '#16a37a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={15} /></button>
                              <button onClick={cancelEdit} style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={15} /></button>
                            </div>
                          : <div style={{ display: 'flex', gap: 6 }}>
                              <button onClick={() => startEdit(exp)} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'var(--accent-light)', color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Edit"><Edit2 size={14} /></button>
                              <button onClick={() => setConfirmDeleteId(exp.id)} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'var(--coral-light)', color: 'var(--coral)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete"><Trash2 size={14} /></button>
                            </div>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Page {currentPage} of {totalPages} · {filtered.length} results</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  style={{ width: 34, height: 34, borderRadius: 9, border: '1.5px solid', borderColor: currentPage === p ? 'var(--accent)' : 'var(--border)', background: currentPage === p ? 'var(--accent-light)' : 'transparent', color: currentPage === p ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {confirmDeleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--surface)', borderRadius: 20, padding: '1.75rem', maxWidth: 380, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--coral-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Trash2 size={22} color="var(--coral)" />
            </div>
            <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Delete Expense?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setConfirmDeleteId(null)} style={{ flex: 1, padding: '0.75rem', borderRadius: 12, border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { deleteExpense(confirmDeleteId); setConfirmDeleteId(null); }} style={{ flex: 1, padding: '0.75rem', borderRadius: 12, border: 'none', background: 'var(--coral)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,107,138,0.4)' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}