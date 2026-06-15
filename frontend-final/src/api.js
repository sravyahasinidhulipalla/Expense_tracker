const BASE_URL = 'http://127.0.0.1:8080';

let _token = null;

export const setToken   = (t) => { _token = t; };
export const getToken   = () => _token;
export const clearToken = () => { _token = null; };

function authHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (_token) headers['Authorization'] = `Bearer ${_token}`;
  return headers;
}

// ── AUTH ──────────────────────────────────────────────

export async function apiSignup({ username, email, password, role }) {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ username, email, password, role: role || 'user' }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Signup failed');
  if (data.token) setToken(data.token);
  return normaliseAuthResponse(data, email);
}

export async function apiLogin({ email, password }) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Login failed');
  if (data.token) setToken(data.token);
  return normaliseAuthResponse(data, email);
}

function normaliseAuthResponse(data, email) {
  let rawRole = data.role || null;
  if (!rawRole && Array.isArray(data.roles) && data.roles.length > 0) {
    const first = data.roles[0];
    rawRole = typeof first === 'string' ? first : (first?.name || first?.authority || null);
  }
  return {
    ...data,
    role:     rawRole,
    username: data.username || data.name || email?.split('@')[0] || '',
  };
}

// ── EXPENSES ──────────────────────────────────────────

export async function apiGetMyExpenses() {
  const res = await fetch(`${BASE_URL}/expenses/my`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch expenses');
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data?.expenses && Array.isArray(data.expenses)) return data.expenses;
  return [];
}

export async function apiGetAllExpenses() {
  const res = await fetch(`${BASE_URL}/expenses/all`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch all expenses');
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data?.expenses && Array.isArray(data.expenses)) return data.expenses;
  return [];
}

export async function apiAddExpense({ expenseName, amount, category, description, date }) {
  const res = await fetch(`${BASE_URL}/expenses/add`, {
    method:  'POST',
    headers: authHeaders(),
    body:    JSON.stringify({
      expenseName,
      amount:      parseFloat(amount),
      category,
      description: description || '',
      date:        date || new Date().toISOString().split('T')[0],
    }),
  });
  if (!res.ok) throw new Error('Failed to add expense');
  return res.json();
}

export async function apiDeleteExpense(id) {
  const res = await fetch(`${BASE_URL}/expenses/delete/${id}`, {
    method:  'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete expense');
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

// ── ADMIN ─────────────────────────────────────────────

export async function apiGetAllUsersWithExpenses() {
  const res = await fetch(`${BASE_URL}/profile/all`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`Failed to fetch users (${res.status})`);
  const data = await res.json();
  return Array.isArray(data) ? data : (data?.users || []);
}

export async function apiDeleteUser(userId) {
  const res = await fetch(`${BASE_URL}/profile/${userId}`, {
    method:  'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete user');
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

export async function apiSetUserBudget(userId, budget) {
  const res = await fetch(`${BASE_URL}/profile/${userId}/budget`, {
    method:  'PUT',
    headers: authHeaders(),
    body:    JSON.stringify({ budget: parseFloat(budget) }),
  });
  if (!res.ok) throw new Error('Failed to update budget');
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

// ── PROFILE ───────────────────────────────────────────

export async function apiGetProfile() {
  const res = await fetch(`${BASE_URL}/profile`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}