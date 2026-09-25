import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  TrendingUp,
  Utensils,
  CalendarDays,
  FileText,
  MessageSquare,
  User,
  Settings,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Activity,
  ActivitySquare,
  MapPin,
} from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { LanguageSelector } from '../common/LanguageSelector';
import { MedicalDisclaimer } from '../common/MedicalDisclaimer';
import { useAuthStore } from '../../services/authStore';
import { showToast } from '../../services/toastStore';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Clean Navigation Structure (Section 17)
  const navItems = [
    { label: 'Home', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Check', path: '/assessment/new', icon: <PlusCircle className="w-5 h-5" /> },
    { label: 'My Results', path: '/history', icon: <History className="w-5 h-5" /> },
    { label: 'Nutrition', path: '/recommendations', icon: <Utensils className="w-5 h-5" /> },
    { label: 'Find a Doctor', path: '/doctors', icon: <MapPin className="w-5 h-5" /> },
    { label: 'Nutrition questions', path: '/chatbot', icon: <MessageSquare className="w-5 h-5" /> },
    { label: 'Activity chart', path: '/progress', icon: <Activity className="w-5 h-5" /> },
    { label: 'Reports', path: '/reports', icon: <FileText className="w-5 h-5" /> },
    { label: 'About', path: '/about', icon: <FileText className="w-5 h-5" /> },
  ];

  const adminItems = [
    { label: 'Admin Portal', path: '/admin/dashboard', icon: <ShieldCheck className="w-5 h-5" /> },
  ];

  const settingItems = [
    { label: 'Profile', path: '/profile', icon: <User className="w-5 h-5" /> },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
    await logout();
    showToast.info('Logged Out', 'Your session has been terminated.');
    navigate('/login');
  };

  const userName = user?.fullName || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Mobile Top Navbar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-health-600 flex items-center justify-center text-white">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 dark:text-slate-100">
            Vitamin <span className="text-health-600">Deficiency</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle Menu"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 flex-1 overflow-y-auto space-y-6">
          {/* Logo */}
          <Link to="/dashboard" className="hidden md:flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-health-600 flex items-center justify-center text-white shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight">
              Vitamin <span className="text-health-600 dark:text-health-400">Deficiency</span>
            </span>
          </Link>

          {/* Primary Nav */}
          <nav className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 block mb-2">
              Main Menu
            </span>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-health-50 dark:bg-health-950/70 text-health-700 dark:text-health-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <span className={isActive ? 'text-health-600 dark:text-health-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Admin Navigation */}
          {user?.role === 'ROLE_ADMIN' && (
            <nav className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 block mb-2">
                Administration
              </span>
              {adminItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="text-purple-600 dark:text-purple-400">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Settings & Diagnostics */}
          <nav className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 block mb-2">
              Preferences & System
            </span>
            {settingItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className="text-slate-400">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Account Footer & Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-health-600 text-white font-bold flex items-center justify-center flex-shrink-0">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {userName}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {user?.email || 'Authenticated User'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>

        <footer className="py-4 px-6 border-t border-slate-200 dark:border-slate-800 text-center">
          <MedicalDisclaimer variant="compact" />
        </footer>
      </div>
    </div>
  );
};
