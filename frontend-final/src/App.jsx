import { AppProvider, useApp } from './context/AppContext';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';

function Router() {
  const { page, theme } = useApp();

  const pages = {
    landing:   Landing,
    signin:    SignIn,
    signup:    SignUp,
    dashboard: Dashboard,
    add:       AddExpense,
    reports:   Reports,
    profile:   Profile,
    admin:     AdminPanel,
  };

  const Page = pages[page] || Landing;

  if (page === 'admin') {
    return (
      <>
        <Navbar active="admin" />
        <Page />
      </>
    );
  }

  return <Page />;
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

function AppShell() {
  const { theme } = useApp();
  return (
    <div data-theme={theme} style={{ minHeight: '100vh' }}>
      <Router />
    </div>
  );
}