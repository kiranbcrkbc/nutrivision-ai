import React, { useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { PageHeader } from '../../components/common/PageHeader';

export const FindDoctorPage: React.FC = () => {
  const [locality, setLocality] = useState('');
  const [specialty, setSpecialty] = useState('general physician');
  const query = `${specialty} ${locality.trim()} Bengaluru Karnataka`;
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  return <div className="max-w-3xl mx-auto space-y-6 py-8 px-4">
    <PageHeader title="Find care in Bengaluru" subtitle="Search for a clinician near you to discuss your symptoms and whether testing is appropriate." />
    <Card className="p-6 sm:p-8 space-y-6">
      <MapPin className="w-10 h-10 text-health-600" />
      <div><label htmlFor="specialty" className="block font-semibold mb-2">Type of care</label><select id="specialty" value={specialty} onChange={e => setSpecialty(e.target.value)} className="w-full p-3 rounded-xl border bg-white dark:bg-slate-900"><option value="general physician">General physician</option><option value="registered dietitian">Dietitian</option><option value="dermatologist">Dermatologist</option><option value="ophthalmologist">Eye specialist</option><option value="hospital emergency department">Emergency department</option></select></div>
      <div><label htmlFor="locality" className="block font-semibold mb-2">Neighbourhood (optional)</label><input id="locality" maxLength={100} value={locality} onChange={e => setLocality(e.target.value)} placeholder="For example, Jayanagar or Whitefield" className="w-full p-3 rounded-xl border bg-white dark:bg-slate-900" /></div>
      <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-health-600 text-white px-5 py-3 rounded-xl font-semibold">Search Google Maps <ExternalLink className="w-4 h-4" /></a>
      <p className="text-sm text-slate-500">Maps opens in a new tab. Check current contact details, qualifications, hours, and availability with the provider. Search results are not endorsements. We do not publish unverified ratings or phone numbers.</p>
    </Card>
    <Card className="p-6 border-amber-300"><h2 className="font-semibold mb-2">Need urgent help?</h2><p>For severe breathing difficulty, chest pain, collapse, or uncontrolled bleeding, seek emergency care immediately. Do not wait for an assessment here.</p></Card>
  </div>;
};
