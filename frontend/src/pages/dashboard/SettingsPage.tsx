import React from 'react';
import { Settings, Shield, Bell, Moon, Sun, Globe } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { LanguageSelector } from '../../components/common/LanguageSelector';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="Settings & Preferences"
        subtitle="Manage interface theme, language localizations, and privacy permissions."
      />

      <div className="space-y-6">
        <Card variant="default" className="p-6 space-y-4">
          <CardTitle className="text-base">Interface Appearance & Theme</CardTitle>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Dark / Light Mode</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Switch color theme or sync with system preferences</p>
            </div>
            <ThemeToggle />
          </div>
        </Card>

        <Card variant="default" className="p-6 space-y-4">
          <CardTitle className="text-base">Language & Localization</CardTitle>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Application Language</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Select language for interface strings and reports</p>
            </div>
            <LanguageSelector />
          </div>
        </Card>

        <Card variant="default" className="p-6 space-y-4">
          <CardTitle className="text-base">Data & Privacy</CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            All user images are encrypted in local storage during assessment processing and accessible only by your authenticated session.
          </p>
        </Card>
      </div>
    </div>
  );
};
