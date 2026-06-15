import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  apiSignup, apiLogin,
  apiGetMyExpenses, apiGetAllExpenses,
  apiGetAllUsersWithExpenses,
  apiAddExpense, apiDeleteExpense,
  apiDeleteUser, apiSetUserBudget,
  clearToken,
} from '../api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState({ name: '', email: '', budget: 0, role: 'user' });
  const [expenses, setExpenses]         = useState([]);
  const [allUsersData, setAllUsersData] = useState([]);
  const [page, setPage]                 = useState('landing');
  const [loading, setLoading]           = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ── Theme ─────────────────────────────────────────────────────
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const toggleTheme = () => setTheme(prev => {
    const next = prev === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    return next;
  });

  // Apply theme to <html> so CSS vars work globally
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // ── Accounts per user (stored in localStorage keyed by email) ─
  const getAccountsKey  = (email) => `accounts_${email}`;
  const getAccounts     = (email) => {
    try { return JSON.parse(localStorage.getItem(getAccountsKey(email))) || []; }
    catch { return []; }
  };
  const saveAccounts    = (email, accounts) =>
    localStorage.setItem(getAccountsKey(email), JSON.stringify(accounts));

  const [accounts, setAccounts] = useState([]);

  const loadAccounts = useCallback((email) => {
    setAccounts(getAccounts(email));
  }, []);

  const addAccount = (name, type = 'personal') => {
    const newAcc = { id: Date.now(), name, type, createdAt: new Date().toISOString() };
    const updated = [...accounts, newAcc];
    setAccounts(updated);
    saveAccounts(user.email, updated);
    return newAcc;
  };

  const deleteAccount = (id) => {
    const updated = accounts.filter(a => a.id !== id);
    setAccounts(updated);
    saveAccounts(user.email, updated);
  };

  const renameAccount = (id, name) => {
    const updated = accounts.map(a => a.id === id ? { ...a, name } : a);
    setAccounts(updated);
    saveAccounts(user.email, updated);
  };

  // ── Helpers ───────────────────────────────────────────────────
  function normalizeRole(role) {
    if (!role) return 'user';
    return role.toString().toLowerCase().includes('admin') ? 'admin' : 'user';
  }

  function mapExpense(exp) {
    return {
      id:          exp.id,
      title:       exp.expenseName || '',
      amount:      Number(exp.amount) || 0,
      category:    exp.category       || 'Other',
      description: exp.description    || '',
      date:        exp.date           || new Date().toISOString().split('T')[0],
      userId:      exp.userId         || null,
      userName:    exp.userName       || '',
      userEmail:   exp.userEmail      || '',
      account:     exp.account        || 'Personal',
    };
  }

  const fetchExpenses = useCallback(async (roleOverride) => {
    try {
      const role = roleOverride || user.role;
      const raw  = role === 'admin' ? await apiGetAllExpenses() : await apiGetMyExpenses();
      setExpenses(raw.map(mapExpense));
    } catch (err) {
      console.error('fetchExpenses:', err);
      setExpenses([]);
    }
  }, [user.role]);

  const fetchAllUsersData = useCallback(async () => {
    try {
      const raw = await apiGetAllUsersWithExpenses();
      const mapped = raw.map(u => ({
        userId:    String(u.userId   || u.id || ''),
        userName:  u.userName  || u.username || 'Unknown',
        userEmail: u.userEmail || u.email    || '',
        role:      u.role      || 'ROLE_USER',
        budget:    Number(u.budget) || 0,
        expenses:  (u.expenses || []).map(mapExpense),
      }));
      setAllUsersData(mapped);
    } catch (err) {
      console.error('fetchAllUsersData:', err);
      setAllUsersData([]);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (['dashboard', 'reports', 'profile', 'add'].includes(page)) fetchExpenses();
    if (user.role === 'admin' && page === 'admin') fetchAllUsersData();
  }, [page, isAuthenticated, user.role, fetchExpenses, fetchAllUsersData]);

  // ── SIGNUP ────────────────────────────────────────────────────
  const signup = async ({ name, email, password, role }) => {
    setLoading(true);
    try {
      const data         = await apiSignup({ username: name, email, password, role: role || 'user' });
      const assignedRole = normalizeRole(data.role);
      setIsAuthenticated(true);
      setUser({ name: data.username || name, email, budget: 0, role: assignedRole });
      loadAccounts(email);
      setPage(assignedRole === 'admin' ? 'admin' : 'dashboard');
      if (assignedRole === 'admin') {
        await fetchAllUsersData();
      } else {
        await fetchExpenses(assignedRole);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── LOGIN ─────────────────────────────────────────────────────
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const data         = await apiLogin({ email, password });
      const assignedRole = normalizeRole(data.role);
      setIsAuthenticated(true);
      // Load saved budget for this user from localStorage
      const savedBudget = Number(localStorage.getItem(`budget_${email}`)) || 0;
      setUser({ name: data.username || email.split('@')[0], email, budget: savedBudget, role: assignedRole });
      loadAccounts(email);
      setPage(assignedRole === 'admin' ? 'admin' : 'dashboard');
      if (assignedRole === 'admin') {
        await fetchAllUsersData();
      } else {
        await fetchExpenses(assignedRole);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── LOGOUT ────────────────────────────────────────────────────
  const logout = () => {
    clearToken();
    setIsAuthenticated(false);
    setUser({ name: '', email: '', budget: 0, role: 'user' });
    setExpenses([]);
    setAllUsersData([]);
    setAccounts([]);
    setPage('landing');
  };

  const updateProfile = ({ name, email, budget }) => {
    setUser(prev => {
      const newBudget = budget !== undefined ? Number(budget) : prev.budget;
      // Persist budget per user email
      if (budget !== undefined) {
        localStorage.setItem(`budget_${prev.email}`, String(newBudget));
      }
      return {
        ...prev,
        name:   name   !== undefined ? name   : prev.name,
        email:  email  !== undefined ? email  : prev.email,
        budget: newBudget,
      };
    });
  };

  const addExpense = async (exp) => {
    const expenseName = (exp.name || exp.title || exp.description || exp.category || 'Unnamed').trim();
    const payload = {
      expenseName,
      amount:      parseFloat(exp.amount),
      category:    exp.category,
      description: exp.description || '',
      date:        exp.date || new Date().toISOString().split('T')[0],
      account:     exp.account || 'Personal',
    };
    try {
      await apiAddExpense(payload);
      await fetchExpenses();
    } catch (err) {
      console.error('addExpense:', err);
      setExpenses(prev => [{
        id: Date.now(), title: expenseName, amount: parseFloat(exp.amount),
        category: exp.category, description: exp.description || '',
        date: exp.date, userId: null, userName: user.name,
        userEmail: user.email, account: exp.account || 'Personal',
      }, ...prev]);
    }
  };

  const deleteExpense = async (id) => {
    try { await apiDeleteExpense(id); } catch (err) { console.error(err); }
    setExpenses(prev => prev.filter(e => e.id !== id));
    setAllUsersData(prev => prev.map(u => ({ ...u, expenses: u.expenses.filter(e => e.id !== id) })));
  };

  const editExpense = (id, updated) => {
    const patch = { ...updated, amount: parseFloat(updated.amount) };
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e));
    setAllUsersData(prev =>
      prev.map(u => ({ ...u, expenses: u.expenses.map(e => e.id === id ? { ...e, ...patch } : e) }))
    );
  };

  const adminDeleteUser = async (userId) => {
    try { await apiDeleteUser(userId); } catch (err) { console.error('adminDeleteUser:', err); }
    setAllUsersData(prev => prev.filter(u => u.userId !== String(userId)));
  };

  const adminSetUserBudget = async (userId, budget) => {
    try { await apiSetUserBudget(userId, budget); } catch (err) { console.warn('adminSetUserBudget (optimistic):', err); }
    setAllUsersData(prev =>
      prev.map(u => u.userId === String(userId) ? { ...u, budget: Number(budget) } : u)
    );
  };

  const adminExportCSV = () => {
    const rows = [['User', 'Email', 'Date', 'Category', 'Title', 'Amount', 'Account']];
    allUsersData.forEach(u => {
      (u.expenses || []).forEach(e => {
        rows.push([u.userName, u.userEmail, e.date, e.category, e.title, e.amount, e.account || '']);
      });
    });
    const csv  = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `spendly-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Computed values ───────────────────────────────────────────
  const totalExpense   = expenses.reduce((s, e) => s + e.amount, 0);
  const currentMonth   = new Date().toISOString().slice(0, 7);
  const monthlyExpense = expenses
    .filter(e => e.date?.startsWith(currentMonth))
    .reduce((s, e) => s + e.amount, 0);

  // Running balance: budget minus ALL expenses ever (not just this month)
  const remainingBalance = user.budget > 0 ? user.budget - totalExpense : null;

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount; return acc;
  }, {});

  const highestCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const monthlyBreakdown = (() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d     = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const key   = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '00')}`;
      const label = d.toLocaleString('default', { month: 'short' });
      return { month: label, amount: expenses.filter(e => e.date?.startsWith(key)).reduce((s, e) => s + e.amount, 0) };
    });
  })();

  const weeklyBreakdown = [
    { week: 'W1', start: 1, end: 7 }, { week: 'W2', start: 8, end: 14 },
    { week: 'W3', start: 15, end: 21 }, { week: 'W4', start: 22, end: 31 },
  ].map(({ week, start, end }) => ({
    week,
    spend: expenses.filter(e => {
      if (!e.date?.startsWith(currentMonth)) return false;
      const day = parseInt(e.date.split('-')[2], 10);
      return day >= start && day <= end;
    }).reduce((s, e) => s + e.amount, 0),
  }));

  const adminStats = (() => {
    if (user.role !== 'admin') return null;
    const allExp      = allUsersData.flatMap(u => u.expenses);
    const totalSpend  = allExp.reduce((s, e) => s + e.amount, 0);
    const totalUsers  = allUsersData.length;
    const avgPerUser  = totalUsers ? totalSpend / totalUsers : 0;
    const overBudget  = allUsersData.filter(u => u.budget > 0 && u.expenses.reduce((s, e) => s + e.amount, 0) > u.budget).length;
    const catMap      = allExp.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {});
    const topCategory = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    const monthlyTotal = allExp.filter(e => e.date?.startsWith(currentMonth)).reduce((s, e) => s + e.amount, 0);
    return { totalSpend, totalUsers, avgPerUser, overBudget, topCategory, monthlyTotal };
  })();

  return (
    <AppContext.Provider value={{
      user, expenses, allUsersData,
      addExpense, deleteExpense, editExpense,
      adminDeleteUser, adminSetUserBudget, adminExportCSV,
      updateProfile, signup, login, logout,
      loading, isAuthenticated, page, setPage,
      totalExpense, monthlyExpense, remainingBalance,
      highestCategory, categoryTotals, monthlyBreakdown, weeklyBreakdown,
      fetchExpenses, fetchAllUsersData, adminStats,
      theme, toggleTheme,
      accounts, addAccount, deleteAccount, renameAccount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);