import axios from 'axios';
import { api, API_BASE_URL, AI_SERVICE_URL } from './api';
import { ServiceHealth } from '../types';

export const healthService = {
  async checkAllServices(): Promise<ServiceHealth> {
    const health: ServiceHealth = {
      frontend: 'UP',
      backend: 'CHECKING',
      database: 'UNKNOWN',
      aiService: 'CHECKING',
      aiModelStatus: 'unknown',
    };

    // 1. Check Spring Boot Backend
    try {
      const beRes = await api.get('/health', { timeout: 3000 });
      if (beRes.status === 200) {
        health.backend = 'UP';
        health.backendMessage = beRes.data?.service || 'Spring Boot API Online';
      }
    } catch {
      health.backend = 'DOWN';
      health.backendMessage = `Cannot reach Spring Boot API at ${API_BASE_URL}`;
    }

    // 2. Check Database via Backend
    if (health.backend === 'UP') {
      try {
        const dbRes = await api.get('/health/database', { timeout: 3000 });
        if (dbRes.status === 200 && dbRes.data?.data?.database === 'UP') {
          health.database = 'UP';
        } else {
          health.database = 'DOWN';
        }
      } catch {
        health.database = 'DOWN';
      }
    } else {
      health.database = 'UNKNOWN';
    }

    // 3. Check FastAPI AI Service directly or through backend /health/ai
    try {
      const beAiRes = await api.get('/health/ai', { timeout: 3000 });
      if (beAiRes.status === 200 && beAiRes.data?.data) {
        const d = beAiRes.data.data;
        health.aiService = d.status === 'UP' || d.status === 'READY' ? 'UP' : 'DOWN';
        health.aiModelStatus = d.modelAvailable ? 'loaded' : (d.inferenceModel || 'not_loaded');
        health.aiMessage = d.service || 'FastAPI AI Engine';
      }
    } catch {
      // Direct fallback to AI service URL
      try {
        const directAiRes = await axios.get(`${AI_SERVICE_URL}/health`, { timeout: 2500 });
        if (directAiRes.status === 200) {
          health.aiService = 'UP';
          health.aiModelStatus = directAiRes.data?.modelAvailable ? 'loaded' : (directAiRes.data?.inferenceModel || 'not_loaded');
          health.aiMessage = directAiRes.data?.service || 'FastAPI AI Engine';
        }
      } catch {
        health.aiService = 'DOWN';
        health.aiModelStatus = 'unknown';
        health.aiMessage = `Cannot reach AI Microservice at ${AI_SERVICE_URL}`;
      }
    }


    return health;
  },
};
