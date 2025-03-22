// src/hooks/useRecommendations.ts
'use client';

import { useQuery } from '@tanstack/react-query';

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  price: number;
  tags?: string[];
  trend_score?: number;
}

interface RecommendationsResponse {
  success: boolean;
  events: Event[];
}

export function useGetRecommendations(type: string, userId?: string) {
  const queryParams = new URLSearchParams();
  
  if (userId) {
    queryParams.append('user_id', userId);
  }
  
  return useQuery<RecommendationsResponse>({
    queryKey: ['recommendations', type, userId],
    queryFn: async () => {
      const url = `/api/recommendations?type=${type}&${queryParams.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useGetTrendingEvents(category?: string, limit = 10) {
  const queryParams = new URLSearchParams();
  queryParams.append('limit', limit.toString());
  
  if (category) {
    queryParams.append('category', category);
  }
  
  return useQuery<RecommendationsResponse>({
    queryKey: ['trending', category, limit],
    queryFn: async () => {
      const url = `/api/events/trending?${queryParams.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch trending events');
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}