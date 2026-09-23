import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Activity, Menu, X, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '../common/ThemeToggle';
import { LanguageSelector } from '../common/LanguageSelector';
import { Button } from '../common/Button';

export const PublicLayout: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: t('nav.home', 'Home'), path: '/' },
    { name: t('nav.howItWorks', 'How It Works'), path: '/how-it-works' },
    { name: t('nav.about', 'About'), path: '/about' },
    { name: 'Try Demo 🎓', path: '/demo' },
    { name: 'Find a Doctor', path: '/doctors' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-health-600 flex items-center justify-center text-white shadow-sm group-hover:bg-health-700 transition-colors">
              <Activity className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                NutriVision <span className="text-health-600 dark:text-health-400">AI</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                PRELIMINARY HEALTH ENGINE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-health-600 dark:text-health-400 bg-health-50 dark:bg-health-950/60 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Header Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            <LanguageSelector />
            <ThemeToggle />
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
            <Link to="/login">
              <Button variant="ghost" size="sm">
                {t('nav.login', 'Log In')}
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">
                {t('nav.register', 'Get Started')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-1.5">
            <LanguageSelector />
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive(link.path)
                    ? 'text-health-600 dark:text-health-400 bg-health-50 dark:bg-health-950/60 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  {t('nav.login', 'Log In')}
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full">
                  {t('nav.register', 'Get Started')}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-health-600 flex items-center justify-center text-white">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg text-slate-900 dark:text-slate-100">
                  NutriVision <span className="text-health-600 dark:text-health-400">AI</span>
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                An educational prototype providing AI-assisted preliminary vitamin deficiency screening and personalized nutrition recommendations based on visual features and self-reported symptoms.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-health-700 dark:text-health-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Educational College Prototype • Non-Diagnostic System</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
                Navigation
              </h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><Link to="/" className="hover:text-health-600 dark:hover:text-health-400">Home</Link></li>
                <li><Link to="/how-it-works" className="hover:text-health-600 dark:hover:text-health-400">How It Works</Link></li>
                <li><Link to="/about" className="hover:text-health-600 dark:hover:text-health-400">About the Project</Link></li>
                <li><Link to="/disclaimer" className="hover:text-health-600 dark:hover:text-health-400">Medical Disclaimer</Link></li>
                <li><Link to="/dev/status" className="hover:text-health-600 dark:hover:text-health-400">Service Status (Dev)</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
                Safety & Disclaimers
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Results provided are preliminary indicators only and do not constitute clinical diagnoses. Always consult certified healthcare professionals for medical advice.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
            <p>© {new Date().getFullYear()} NutriVision AI Project. Built with Free & Open Source Technologies.</p>
            <div className="flex items-center gap-4">
              <Link to="/disclaimer" className="hover:underline">Medical Disclaimer</Link>
              <span>•</span>
              <Link to="/about" className="hover:underline">Ethical AI Policies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
