import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  Crosshair,
  Building2,
  Stethoscope,
  Apple,
  FlaskConical,
  AlertCircle,
  ShieldCheck,
  Phone,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { DoctorCard } from '../../components/referrals/DoctorCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { doctorService, Doctor } from '../../services/doctorService';
import { showToast } from '../../services/toastStore';

export const FindDoctorPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [localities, setLocalities] = useState<string[]>([]);
  const [selectedLocality, setSelectedLocality] = useState<string>('All Bengaluru');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [locationPermissionState, setLocationPermissionState] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');

  // Load localities and initial doctor catalog
  useEffect(() => {
    const initData = async () => {
      try {
        const [locList, docList] = await Promise.all([
          doctorService.getLocalities(),
          doctorService.getBengaluruDoctors(),
        ]);
        setLocalities(locList);
        setDoctors(docList);
      } catch (err: any) {
        showToast.error('Load Error', 'Could not retrieve Bengaluru healthcare directory.');
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, []);

  // Filter when locality or type changes
  const handleFilter = async (loc?: string, type?: string) => {
    const targetLoc = loc ?? selectedLocality;
    const targetType = type ?? selectedType;
    setSelectedLocality(targetLoc);
    setSelectedType(targetType);

    setIsLoading(true);
    try {
      const data = await doctorService.getBengaluruDoctors(targetLoc, targetType);
      setDoctors(data);
    } catch (err: any) {
      showToast.error('Filter Error', 'Failed to filter healthcare providers.');
    } finally {
      setIsLoading(false);
    }
  };

  // Safe Geolocation Permission Flow (Privacy Conscious - One-time only, no tracking)
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      showToast.error('Location Error', 'Geolocation is not supported by your browser.');
      return;
    }

    setLocationPermissionState('requesting');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocationPermissionState('granted');
        showToast.success('Location Detected', 'Displaying healthcare facilities closest to your position.');
        setIsLoading(true);
        try {
          const data = await doctorService.getBengaluruDoctors(
            undefined,
            selectedType,
            { lat: pos.coords.latitude, lon: pos.coords.longitude }
          );
          setDoctors(data);
        } catch (err) {
          showToast.error('Search Error', 'Could not locate nearest centers.');
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setLocationPermissionState('denied');
        showToast.info(
          'Location Access Not Granted',
          'You can still search by selecting any Bengaluru locality manually below.'
        );
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  const filteredDoctors = doctors.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.locality.toLowerCase().includes(q) ||
      d.specialty.toLowerCase().includes(q) ||
      d.address.toLowerCase().includes(q)
    );
  });

  const typeFilters = [
    { id: 'ALL', label: 'All Centers', icon: <Building2 className="w-4 h-4" /> },
    { id: 'Hospital', label: 'Multispecialty Hospitals', icon: <Stethoscope className="w-4 h-4" /> },
    { id: 'Nutrition', label: 'Nutritionists & Dietitians', icon: <Apple className="w-4 h-4" /> },
    { id: 'Diagnostic', label: 'Diagnostic Labs', icon: <FlaskConical className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <PageHeader
        title="Find Healthcare & Clinics in Bengaluru"
        subtitle="Consult registered medical practitioners, clinical dietitians, and accredited diagnostic centers for professional evaluation."
      />

      {/* Medical Safety & Privacy Guarantee Banner */}
      <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-teal-900 dark:text-teal-200 leading-relaxed">
          <strong className="block font-bold mb-0.5">Privacy & Medical Confirmation Notice:</strong>
          NutriVision AI never shares your photos or assessment history with clinics without your explicit consent. Your GPS location is accessed only with your one-time permission and is never continuously tracked. A physical consultation and standard blood test (e.g. CBC, Serum B12, Ferritin) are needed for official clinical diagnosis.
        </div>
      </div>

      {/* Search & Location Bar */}
      <Card variant="default" className="p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by hospital name, doctor, or landmark in Bengaluru..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-health-500"
            />
          </div>

          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            {/* Locality Dropdown */}
            <select
              value={selectedLocality}
              onChange={(e) => handleFilter(e.target.value, selectedType)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-health-500"
            >
              {localities.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {/* Geolocation Button */}
            <Button
              variant="outline"
              size="md"
              onClick={handleUseLocation}
              isLoading={locationPermissionState === 'requesting'}
              leftIcon={<Crosshair className="w-4 h-4 text-health-600" />}
              className="whitespace-nowrap"
            >
              Near Me
            </Button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 pt-1">
          {typeFilters.map((tf) => (
            <button
              key={tf.id}
              onClick={() => handleFilter(selectedLocality, tf.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedType === tf.id
                  ? 'bg-health-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tf.icon}
              <span>{tf.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Results Section */}
      {isLoading ? (
        <div className="min-h-[30vh] flex items-center justify-center">
          <LoadingSpinner size="lg" label="Finding verified healthcare providers..." />
        </div>
      ) : filteredDoctors.length === 0 ? (
        <Card variant="default" className="p-8 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
            No healthcare centers found matching your filter
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try choosing 'All Bengaluru' or clearing the search keyword to see accredited hospitals and clinics.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedLocality('All Bengaluru');
              setSelectedType('ALL');
              setSearchQuery('');
              handleFilter('All Bengaluru', 'ALL');
            }}
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>
              Showing <strong>{filteredDoctors.length}</strong> verified healthcare locations in Bengaluru
            </span>
            <span>Tap "Directions in Maps" to navigate</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredDoctors.map((doc) => (
              <DoctorCard key={doc.id} doctor={doc} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
