import { useState } from 'react';
import {
  Bell,
  Contrast,
  Globe,
  LogOut,
  Mail,
  Monitor,
  Moon,
  Palette,
  Shield,
  Sun,
  Type,
  User,
  Zap,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { mockCurrentUser } from '@/data/mockData';

type TextSize = 'small' | 'medium' | 'large';
type Theme = 'light' | 'dark' | 'system';
type Language = 'en' | 'as' | 'bn' | 'hi';

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-slate-300'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </label>
  );
}

interface SectionCardProps {
  id: string;
  icon: typeof User;
  iconClasses: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SectionCard({ id, icon: Icon, iconClasses, title, description, children }: SectionCardProps) {
  return (
    <section className="card overflow-hidden" aria-labelledby={`${id}-title`}>
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClasses}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <h2 id={`${id}-title`} className="text-sm font-semibold text-slate-900">{title}</h2>
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <div className="px-5 py-2">{children}</div>
    </section>
  );
}

const textSizeOptions: { value: TextSize; label: string; description: string }[] = [
  { value: 'small', label: 'Small', description: 'Default size' },
  { value: 'medium', label: 'Medium', description: 'Slightly larger' },
  { value: 'large', label: 'Large', description: 'Easier to read' },
];

const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

const languageOptions: { value: Language; label: string; nativeLabel: string }[] = [
  { value: 'en', label: 'English', nativeLabel: 'English' },
  { value: 'as', label: 'Assamese', nativeLabel: 'অসমীয়া' },
  { value: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { value: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
];

const navLinks = [
  { href: '#profile', label: 'Profile' },
  { href: '#accessibility', label: 'Accessibility' },
  { href: '#notifications', label: 'Notifications' },
  { href: '#language', label: 'Language' },
  { href: '#preferences', label: 'App Preferences' },
  { href: '#privacy', label: 'Privacy' },
  { href: '#account', label: 'Account' },
];

export function SettingsPage() {
  const { signOut } = useAuth();
  const [name, setName] = useState(mockCurrentUser.name);
  const [email, setEmail] = useState(mockCurrentUser.email);
  const [textSize, setTextSize] = useState<TextSize>('medium');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [notifMissedReminders, setNotifMissedReminders] = useState(true);
  const [notifInactivity, setNotifInactivity] = useState(true);
  const [notifSyncErrors, setNotifSyncErrors] = useState(true);
  const [notifGameSessions, setNotifGameSessions] = useState(false);
  const [notifEmailDigest, setNotifEmailDigest] = useState(true);
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('light');
  const [compactView, setCompactView] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showTooltips, setShowTooltips] = useState(true);
  const [savedFlash, setSavedFlash] = useState(false);

  const handleSave = () => {
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2500);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Settings"
        description="Manage your dashboard preferences and account details"
        actions={
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Save changes
          </button>
        }
      />

      {savedFlash && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700" role="status">
          <Shield className="h-4 w-4" aria-hidden="true" />
          Preferences saved. Changes apply to this session only.
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="space-y-6">
        {/* 1. Profile */}
        <SectionCard
          id="profile"
          icon={User}
          iconClasses="bg-blue-50 text-blue-600"
          title="Profile"
          description="Your caregiver account information"
        >
          <div className="space-y-4 py-3">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{name}</p>
                <p className="text-xs text-slate-500">Caregiver</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="settings-name" className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label>
                <input
                  id="settings-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  maxLength={60}
                />
              </div>
              <div>
                <label htmlFor="settings-email" className="mb-1.5 block text-sm font-medium text-slate-700">Email address</label>
                <input
                  id="settings-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* 2. Accessibility */}
        <SectionCard
          id="accessibility"
          icon={Type}
          iconClasses="bg-teal-50 text-teal-600"
          title="Accessibility"
          description="Adjust display and interaction preferences"
        >
          <div className="py-3">
            <div className="mb-1">
              <p className="text-sm font-medium text-slate-800">Text size</p>
              <p className="mt-0.5 text-xs text-slate-500">Adjust the base text size for the dashboard</p>
            </div>
            <div
              role="radiogroup"
              aria-label="Text size preference"
              className="mt-2 grid grid-cols-3 gap-2"
            >
              {textSizeOptions.map((opt) => {
                const isActive = textSize === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setTextSize(opt.value)}
                    className={`rounded-lg border px-3 py-3 text-center transition-all ${
                      isActive
                        ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`block font-semibold ${opt.value === 'small' ? 'text-xs' : opt.value === 'medium' ? 'text-sm' : 'text-base'}`}>
                      {opt.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-400">{opt.description}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-2 divide-y divide-slate-100">
              <ToggleRow
                label="Reduced motion"
                description="Minimize animations and transitions"
                checked={reducedMotion}
                onChange={setReducedMotion}
              />
              <ToggleRow
                label="High contrast"
                description="Increase visual contrast for better readability"
                checked={highContrast}
                onChange={setHighContrast}
              />
            </div>
          </div>
        </SectionCard>

        {/* 3. Notification preferences */}
        <SectionCard
          id="notifications"
          icon={Bell}
          iconClasses="bg-amber-50 text-amber-600"
          title="Notification preferences"
          description="Choose which alerts you receive"
        >
          <div className="divide-y divide-slate-100 py-1">
            <ToggleRow
              label="Missed reminders"
              description="Get notified when a patient misses a reminder"
              checked={notifMissedReminders}
              onChange={setNotifMissedReminders}
            />
            <ToggleRow
              label="Unusual inactivity"
              description="Get notified when a patient shows unusual inactivity"
              checked={notifInactivity}
              onChange={setNotifInactivity}
            />
            <ToggleRow
              label="Sync errors"
              description="Get notified when data synchronization fails"
              checked={notifSyncErrors}
              onChange={setNotifSyncErrors}
            />
            <ToggleRow
              label="Incomplete game sessions"
              description="Get notified when a game session is left unfinished"
              checked={notifGameSessions}
              onChange={setNotifGameSessions}
            />
            <ToggleRow
              label="Weekly email digest"
              description="Receive a weekly summary of alerts and activity"
              checked={notifEmailDigest}
              onChange={setNotifEmailDigest}
            />
          </div>
        </SectionCard>

        {/* 4. Language preferences */}
        <SectionCard
          id="language"
          icon={Globe}
          iconClasses="bg-cyan-50 text-cyan-600"
          title="Language preferences"
          description="Set your preferred display language"
        >
          <div className="py-3">
            <div
              role="radiogroup"
              aria-label="Display language"
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
              {languageOptions.map((opt) => {
                const isActive = language === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setLanguage(opt.value)}
                    className={`flex flex-col items-center gap-1 rounded-lg border px-3 py-3 transition-all ${
                      isActive
                        ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-sm font-semibold">{opt.label}</span>
                    <span className="text-xs text-slate-400">{opt.nativeLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </SectionCard>

        {/* 5. Application preferences */}
        <SectionCard
          id="preferences"
          icon={Palette}
          iconClasses="bg-rose-50 text-rose-600"
          title="Application preferences"
          description="Customize the look and behavior of the dashboard"
        >
          <div className="py-3">
            <div className="mb-1">
              <p className="text-sm font-medium text-slate-800">Theme</p>
              <p className="mt-0.5 text-xs text-slate-500">Choose how the dashboard looks</p>
            </div>
            <div
              role="radiogroup"
              aria-label="Theme preference"
              className="mt-2 grid grid-cols-3 gap-2"
            >
              {themeOptions.map((opt) => {
                const Icon = opt.icon;
                const isActive = theme === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setTheme(opt.value)}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 divide-y divide-slate-100">
              <ToggleRow
                label="Compact view"
                description="Show more information per screen with tighter spacing"
                checked={compactView}
                onChange={setCompactView}
              />
              <ToggleRow
                label="Auto-refresh dashboard"
                description="Automatically refresh dashboard data every few minutes"
                checked={autoRefresh}
                onChange={setAutoRefresh}
              />
              <ToggleRow
                label="Show tooltips"
                description="Display helpful tooltips on hover"
                checked={showTooltips}
                onChange={setShowTooltips}
              />
            </div>
          </div>
        </SectionCard>

        {/* 6. Privacy information */}
        <SectionCard
          id="privacy"
          icon={Shield}
          iconClasses="bg-slate-100 text-slate-600"
          title="Privacy information"
          description="How patient data is handled in this application"
        >
          <div className="space-y-3 py-3">
            <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3.5">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-slate-800">Data is stored locally</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-500">
                  In this prototype, all patient data is stored in your browser using mock data. No information is sent to a server.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-slate-800">No data sharing</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-500">
                  Patient information, memory entries, and activity data are not shared with any third-party services.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3.5">
              <Zap className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-slate-800">No medical data</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-500">
                  This application does not store medical records, diagnoses, or prescription information.
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* 7. Account actions */}
        <SectionCard
          id="account"
          icon={LogOut}
          iconClasses="bg-red-50 text-red-600"
          title="Account actions"
          description="Sign out or reset your local preferences"
        >
          <div className="space-y-3 py-3">
            <button
              type="button"
              onClick={() => void signOut()}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <Contrast className="h-4 w-4" aria-hidden="true" /> Reset preferences to defaults
            </button>
            <p className="text-xs text-slate-400">
              Signing out will clear your current session. You will need to sign in again to access the dashboard.
            </p>
          </div>
        </SectionCard>
      </div>

      <p className="mt-6 text-xs text-slate-400">
        Preferences are stored locally for this session only. No changes are persisted to a server.
      </p>
    </div>
  );
}
