import api from './api';

export interface RecommendationRequest {
  type: 'personalized' | 'trending' | 'nearby' | 'discovery';
  userId?: string;
  latitude?: number;
  longitude?: number;
  limit?: number;
  category?: string;
}

export const getRecommendations = async (request: RecommendationRequest) => {
  const { type, userId, latitude, longitude, limit = 10, category } = request;
  
  const params = new URLSearchParams();
  params.append('type', type);
  
  if (userId) {
    params.append('userId', userId);
  }
  
  if (latitude && longitude) {
    params.append('latitude', latitude.toString());
    params.append('longitude', longitude.toString());
  }
  
  params.append('limit', limit.toString());
  
  if (category) {
    params.append('category', category);
  }
  
  const response = await api.get(`/recommendations?${params.toString()}`);
  return response.data;
};

export const getTrendingEvents = async (limit = 10, category?: string) => {
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  
  if (category) {
    params.append('category', category);
  }
  
  const response = await api.get(`/trending?${params.toString()}`);
  return response.data;
};

export const getDiscoveryEvents = async (userId: string, limit = 10) => {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('limit', limit.toString());
  
  const response = await api.get(`/discovery?${params.toString()}`);
  return response.data;
};