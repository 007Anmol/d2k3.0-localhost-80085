// src/hooks/useRecommendations.ts
'use client';

import { useQuery } from '@tanstack/react-query';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  price: number;
  tags?: string[];
}

interface RecommendationsResponse {
  events: Event[];
  success: boolean;
}

export function useGetRecommendations(type: string) {
  return useQuery<RecommendationsResponse>({
    queryKey: ['recommendations', type],
    queryFn: async () => {
      try {
        // In development, you may want to use mock data initially
        // Eventually this will call your real API
        
        // Uncomment this for production use with real API
        const response = await fetch(`/api/recommendations?type=${type}`);
        if (!response.ok) throw new Error('Failed to fetch recommendations');
        return response.json();
        
        // Mock data for development
        // const mockEvents = [
        //   {
        //     id: '1',
        //     title: 'Summer Music Festival',
        //     date: 'June 15, 2023',
        //     location: 'Central Park',
        //     image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
        //     price: 49.99,
        //     tags: ['music', 'festival'],
        //   },
        //   {
        //     id: '2',
        //     title: 'Tech Conference 2023',
        //     date: 'July 10, 2023',
        //     location: 'Convention Center',
        //     image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
        //     price: 99.99,
        //     tags: ['tech', 'conference'],
        //   },
        //   {
        //     id: '3',
        //     title: 'Food & Wine Expo',
        //     date: 'August 5, 2023',
        //     location: 'Downtown Plaza',
        //     image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
        //     price: 29.99,
        //     tags: ['food', 'wine'],
        //   },
        // ];
        
        // // Simulate API response structure
        // return {
        //   success: true,
        //   events: mockEvents
        // };
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
      }
    },
    // Refresh every 5 minutes
    staleTime: 5 * 60 * 1000,
  });
}