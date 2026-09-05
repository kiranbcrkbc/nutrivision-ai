import { api } from './api';
import { DashboardAnalytics } from '../types';

export const analyticsService = {
  getDashboardAnalytics: async (): Promise<DashboardAnalytics> => {
    const res = await api.get('/analytics/dashboard');
    return res.data.data;
  },
};
