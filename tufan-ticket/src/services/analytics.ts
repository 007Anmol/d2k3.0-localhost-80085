import api from './api';

export interface SalesAnalyticsRequest {
  organizerId: string;
  eventId?: string;
  timeRange?: '7d' | '30d' | '90d';
}

export interface AudienceAnalyticsRequest {
  organizerId: string;
  eventId?: string;
}

export interface PerformanceAnalyticsRequest {
  organizerId: string;
  eventId?: string;
}

export interface PriceOptimizationRequest {
  eventId: string;
  currentPrice?: number;
  targetAttendance?: number;
}

export const getSalesAnalytics = async (request: SalesAnalyticsRequest) => {
  const { organizerId, eventId, timeRange = '30d' } = request;
  
  const params = new URLSearchParams();
  params.append('organizerId', organizerId);
  params.append('type', 'sales');
  params.append('timeRange', timeRange);
  
  if (eventId) {
    params.append('eventId', eventId);
  }
  
  const response = await api.get(`/analytics?${params.toString()}`);
  return response.data;
};

export const getAudienceAnalytics = async (request: AudienceAnalyticsRequest) => {
  const { organizerId, eventId } = request;
  
  const params = new URLSearchParams();
  params.append('organizerId', organizerId);
  params.append('type', 'audience');
  
  if (eventId) {
    params.append('eventId', eventId);
  }
  
  const response = await api.get(`/analytics?${params.toString()}`);
  return response.data;
};

export const getPerformanceAnalytics = async (request: PerformanceAnalyticsRequest) => {
  const { organizerId, eventId } = request;
  
  const params = new URLSearchParams();
  params.append('organizerId', organizerId);
  params.append('type', 'performance');
  
  if (eventId) {
    params.append('eventId', eventId);
  }
  
  const response = await api.get(`/analytics?${params.toString()}`);
  return response.data;
};

export const optimizePrice = async (request: PriceOptimizationRequest) => {
  const response = await api.post('/ml/price-optimization', request);
  return response.data;
};

export const analyzeSentiment = async (text: string) => {
  const response = await api.post('/ml/sentiment', { text });
  return response.data;
};

export const detectAnomalies = async (metrics: any, eventId: string) => {
  const response = await api.post('/ml/anomaly-detection', { metrics, eventId });
  return response.data;
};