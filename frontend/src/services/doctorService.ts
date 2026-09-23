import { api } from './api';

export interface Doctor {
  id: string;
  name: string;
  type: string;
  specialty: string;
  address: string;
  locality: string;
  city: string;
  phone: string;
  rating: number;
  reviewCount: number;
  openingHours: string;
  latitude: number;
  longitude: number;
  mapUrl: string;
  services: string[];
}

export const doctorService = {
  getBengaluruDoctors: async (
    locality?: string,
    type?: string,
    coords?: { lat: number; lon: number }
  ): Promise<Doctor[]> => {
    const params: Record<string, any> = {};
    if (locality && locality !== 'All Bengaluru') {
      params.locality = locality;
    }
    if (type && type !== 'ALL') {
      params.type = type;
    }
    if (coords) {
      params.lat = coords.lat;
      params.lon = coords.lon;
    }

    const res = await api.get('/doctors/bengaluru', { params });
    return res.data?.data || [];
  },

  getLocalities: async (): Promise<string[]> => {
    const res = await api.get('/doctors/localities');
    return res.data?.data || [];
  },
};
