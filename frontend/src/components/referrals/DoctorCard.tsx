import React from 'react';
import { MapPin, Phone, Star, Navigation, Clock, CheckCircle2, Shield } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Doctor } from '../../services/doctorService';

interface DoctorCardProps {
  doctor: Doctor;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <Card variant="default" className="p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge variant="health" size="sm">
                {doctor.locality}
              </Badge>
              <span className="text-[11px] text-slate-400 font-medium">
                {doctor.city}
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {doctor.name}
            </h4>
            <p className="text-xs text-health-700 dark:text-health-400 font-medium mt-0.5">
              {doctor.type}
            </p>
          </div>

          {doctor.rating && (
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 px-2.5 py-1 rounded-xl text-amber-700 dark:text-amber-300 text-xs font-bold flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{doctor.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5 leading-relaxed">
          <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>{doctor.address}</span>
        </p>

        {doctor.openingHours && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{doctor.openingHours}</span>
          </p>
        )}

        {doctor.services && doctor.services.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Relevant Nutritional & Diagnostic Services:
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {doctor.services.map((svc, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-lg"
                >
                  <CheckCircle2 className="w-3 h-3 text-health-600" />
                  {svc}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <a
          href={doctor.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button
            variant="primary"
            size="sm"
            className="w-full text-xs"
            leftIcon={<Navigation className="w-3.5 h-3.5" />}
          >
            Directions in Maps
          </Button>
        </a>

        {doctor.phone && (
          <a href={`tel:${doctor.phone}`} className="flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              leftIcon={<Phone className="w-3.5 h-3.5" />}
            >
              Call
            </Button>
          </a>
        )}
      </div>
    </Card>
  );
};
