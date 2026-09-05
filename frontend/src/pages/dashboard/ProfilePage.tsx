import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, MapPin, Globe, Save, Phone, Calendar, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAuthStore } from '../../services/authStore';
import { api } from '../../services/api';
import { showToast } from '../../services/toastStore';
import { User } from '../../types';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('UNSPECIFIED');
  const [dietaryPreference, setDietaryPreference] = useState<User['dietaryPreference']>(user?.dietaryPreference || 'ANY');
  const [preferredLanguage, setPreferredLanguage] = useState<User['preferredLanguage']>(user?.preferredLanguage || 'en');
  const [city, setCity] = useState(user?.city || '');
  const [country, setCountry] = useState('India');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        const profile = res.data?.data;
        if (profile) {
          if (profile.phone) setPhone(profile.phone);
          if (profile.age) setAge(profile.age);
          if (profile.gender) setGender(profile.gender);
          if (profile.dietaryPreference) setDietaryPreference(profile.dietaryPreference as User['dietaryPreference']);
          if (profile.preferredLanguage) setPreferredLanguage(profile.preferredLanguage as User['preferredLanguage']);
          if (profile.city) setCity(profile.city);
          if (profile.country) setCountry(profile.country);
        }
      } catch (err: any) {
        console.warn('Could not fetch remote profile:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        fullName,
        phone: phone || null,
        age: age ? Number(age) : null,
        gender,
        dietaryPreference,
        preferredLanguage,
        city: city || null,
        country: country || 'India',
      };

      const res = await api.put('/users/profile', payload);
      const updatedUser = res.data?.data;

      if (updatedUser) {
        updateUser({
          fullName: updatedUser.fullName,
          dietaryPreference: updatedUser.profile?.dietaryPreference || dietaryPreference,
          preferredLanguage: updatedUser.profile?.preferredLanguage || preferredLanguage,
          city: updatedUser.profile?.city || city,
        });
      }

      showToast.success('Profile Saved', 'Your user profile and preferences were updated in the database.');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to save profile changes.';
      setError(msg);
      showToast.error('Save Error', msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading your profile data..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="User Profile & Settings"
        subtitle="Manage your personal information, dietary filters, and regional preferences stored securely."
      />

      <Card variant="default" className="p-6 sm:p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-health-600 text-white text-2xl font-bold flex items-center justify-center shadow-sm">
              {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{fullName || 'Registered User'}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{email}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[11px] font-semibold text-health-600 dark:text-health-400 bg-health-50 dark:bg-health-950/60 px-2 py-0.5 rounded-md border border-health-200 dark:border-health-800">
                  {user?.role === 'ROLE_ADMIN' ? 'Administrator' : 'Standard Patient/User'}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              leftIcon={<UserIcon className="w-4 h-4" />}
            />

            <Input
              label="Email Address"
              value={email}
              disabled
              helperText="Registered email address is immutable."
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
              leftIcon={<Phone className="w-4 h-4" />}
              helperText="Optional contact number."
            />

            <Input
              label="Age"
              type="number"
              value={age === '' ? '' : age}
              onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value))}
              placeholder="e.g. 24"
              leftIcon={<Calendar className="w-4 h-4" />}
              helperText="Optional age for dietary calibration."
            />

            <Select
              label="Dietary Preference"
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value as User['dietaryPreference'])}
              options={[
                { value: 'ANY', label: 'Any / Flexible Diet' },
                { value: 'VEGETARIAN', label: 'Vegetarian' },
                { value: 'NON_VEGETARIAN', label: 'Non-Vegetarian' },
                { value: 'VEGAN', label: 'Vegan' },
                { value: 'REGIONAL', label: 'Regional Indian Focus' },
              ]}
              helperText="Used to filter generated food plans."
            />

            <Select
              label="Preferred Language"
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value as User['preferredLanguage'])}
              options={[
                { value: 'en', label: 'English' },
                { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
                { value: 'hi', label: 'हिन्दी (Hindi)' },
              ]}
              helperText="Primary display language."
            />

            <Input
              label="City / Region"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Bengaluru"
              leftIcon={<MapPin className="w-4 h-4" />}
              helperText="For local food availability."
            />

            <Input
              label="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="India"
              leftIcon={<Globe className="w-4 h-4" />}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" size="md" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
