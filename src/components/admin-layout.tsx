import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { Link, useLocation, Redirect } from 'wouter';
import { supabase } from '@/lib/supabase';
import {
  AdminAuthContext,
  type AdminAuthState,
  isDirectLoginUser,
  validateDirectLogin,
  signInWithPassword,
  signInWithOtp,
  verifyOtpToken,
  signOut,
  getSession,
} from '@/lib/admin-auth';
import {
  LayoutDashboard,
  Package,
  Images,
  Briefcase,
  UserCog,
  ScrollText,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

// ── Session storage key for direct-login users ──
const DIRECT_LOGIN_KEY = 'sb_admin_direct_login';

function getDirectLoginSession(): { email: string } | null {
  try {
    const raw = sessionStorage.getItem(DIRECT_LOGIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── Admin Auth Provider ──
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    email: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check session on mount
  useEffect(() => {
    async function checkSession() {
      // Check direct login first
      const directLogin = getDirectLoginSession();
      if (directLogin) {
        setState({
          user: null,
          email: directLogin.email,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }

      // Check Supabase session
      const session = await getSession();
      if (session?.user) {
        setState({
          user: session.user,
          email: session.user.email || null,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setState({ user: null, email: null, isAuthenticated: false, isLoading: false });
      }
    }
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setState({
          user: session.user,
          email: session.user.email || null,
          isAuthenticated: true,
          isLoading: false,
        });
      } else if (!getDirectLoginSession()) {
        setState({ user: null, email: null, isAuthenticated: false, isLoading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithPassword = useCallback(async (email: string, password: string) => {
    // Direct login bypass
    if (isDirectLoginUser(email)) {
      if (validateDirectLogin(email, password)) {
        sessionStorage.setItem(DIRECT_LOGIN_KEY, JSON.stringify({ email }));
        setState({
          user: null,
          email,
          isAuthenticated: true,
          isLoading: false,
        });
        // Log activity
        await supabase.from('activity_logs').insert({
          user_email: email,
          action: 'LOGIN',
          entity_type: 'auth',
          entity_id: null,
          details: 'Direct admin login',
        });
        return { needsOtp: false };
      } else {
        return { needsOtp: false, error: 'Invalid credentials' };
      }
    }

    // For other users, try Supabase password login
    const { error } = await signInWithPassword(email, password);
    if (error) {
      // If password login fails, try sending OTP
      const otpResult = await signInWithOtp(email);
      if (otpResult.error) {
        return { needsOtp: false, error: otpResult.error.message };
      }
      return { needsOtp: true };
    }
    return { needsOtp: false };
  }, []);

  const verifyOtp = useCallback(async (email: string, token: string) => {
    const { error } = await verifyOtpToken(email, token);
    if (error) {
      return { error: error.message };
    }
    return {};
  }, []);

  const logout = useCallback(async () => {
    sessionStorage.removeItem(DIRECT_LOGIN_KEY);
    await signOut();
    setState({ user: null, email: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        ...state,
        loginWithPassword,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

// ── Auth Guard ──
export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    email: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    async function check() {
      const directLogin = getDirectLoginSession();
      if (directLogin) {
        setState({ user: null, email: directLogin.email, isAuthenticated: true, isLoading: false });
        return;
      }
      const session = await getSession();
      setState({
        user: session?.user || null,
        email: session?.user?.email || null,
        isAuthenticated: !!session?.user,
        isLoading: false,
      });
    }
    check();
  }, [location]);

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return <Redirect to="/admin" />;
  }

  return <>{children}</>;
}

// ── Sidebar Navigation Items ──
const sidebarItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products & Services', href: '/admin/products', icon: Package },
  { label: 'Gallery', href: '/admin/gallery', icon: Images },
  { label: 'Projects', href: '/admin/projects', icon: Briefcase },
  { label: 'Profile & Contact', href: '/admin/profile', icon: UserCog },
  { label: 'Activity Logs', href: '/admin/logs', icon: ScrollText },
];

// ── Admin Layout ──
export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authState, setAuthState] = useState<{ email: string | null }>({ email: null });

  useEffect(() => {
    const directLogin = getDirectLoginSession();
    if (directLogin) {
      setAuthState({ email: directLogin.email });
      return;
    }
    getSession().then((session) => {
      setAuthState({ email: session?.user?.email || null });
    });
  }, []);

  const handleLogout = async () => {
    sessionStorage.removeItem(DIRECT_LOGIN_KEY);
    await signOut();
    window.location.href = '/admin';
  };

  return (
    <div className="h-screen w-screen bg-zinc-950 flex overflow-hidden">
      {/* Sidebar - Fixed to 100vh screen height */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-zinc-900/95 backdrop-blur-xl border-r border-zinc-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:flex-shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-zinc-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden flex-shrink-0">
                <img src="/logo1.png" alt="S.B. Technologies" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-white font-bold text-sm">S.B. Technologies</h2>
                <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Nav Links - Scrollable inside sidebar if needed */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => {
              const isActive = location === item.href || (item.href !== '/admin/dashboard' && location.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${isActive
                      ? 'bg-primary/15 text-primary border border-primary/20'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60 border border-transparent'
                    }`}
                >
                  <Icon size={18} className={isActive ? 'text-primary' : 'text-zinc-500 group-hover:text-primary'} />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto text-primary/60" />}
                </Link>
              );
            })}
          </nav>

          {/* User Info - Pinned at bottom of sidebar */}
          <div className="p-4 border-t border-zinc-800 flex-shrink-0">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-blue-500/30 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
                {(authState.email || 'A')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">{authState.email || 'Admin'}</p>
                <p className="text-zinc-500 text-[10px]">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all mt-1 cursor-pointer"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content Area - Only right side content is scrollable */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="flex-shrink-0 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex-1">
            <h1 className="text-white font-bold text-lg">
              {sidebarItems.find((i) => location === i.href || (i.href !== '/admin/dashboard' && location.startsWith(i.href)))?.label || 'Admin'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20 uppercase tracking-wider">
              Live
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
