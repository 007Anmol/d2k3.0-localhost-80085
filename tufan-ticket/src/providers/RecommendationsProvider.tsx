// src/components/providers/RecommendationsProvider.tsx
'use client';

import { ReactNode } from 'react';
import RecommendationCarousel from '@/components/recommendations/RecommendationCarousel';

interface RecommendationsProviderProps {
  type: 'personalized' | 'trending' | 'nearby' | 'discovery';
  userId?: string;
  category?: string;
  limit?: number;
}

export default function RecommendationsProvider({
  type,
  userId,
  category,
  limit
}: RecommendationsProviderProps) {
  return (
    <RecommendationCarousel 
      type={type} 
      userId={userId}
      category={category}
      limit={limit}
    />
  );
}