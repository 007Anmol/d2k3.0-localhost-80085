// src/hooks/useAnalytics.ts
'use client';

import { useQuery, useMutation } from '@tanstack/react-query';

interface SalesForecastDataPoint {
  date: string;
  predicted_sales: number;
  lower_bound: number;
  upper_bound: number;
}

interface SalesForecastResponse {
  success: boolean;
  forecast: SalesForecastDataPoint[];
}

interface SentimentAnalysisRequest {
  text: string;
}

interface SentimentAnalysisResponse {
  success: boolean;
  sentiment: {
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    confidence: number;
    aspects: Record<string, {
      sentiment: 'positive' | 'negative' | 'neutral';
      score: number;
      mentions: number;
    }>;
  };
}

interface AnomalyDetectionRequest {
  metrics: Record<string, number | string>;
}

interface AnomalyDetectionResponse {
  success: boolean;
  anomalies: {
    is_anomaly: boolean;
    anomaly_score: number;
    anomalous_features: {
      feature: string;
      value: number;
      z_score: number;
      direction: 'high' | 'low';
    }[];
    explanation: string[];
  };
}

interface PricingOptimizationResponse {
  success: boolean;
  event: {
    id: string;
    title?: string;
    category?: string;
    location?: string;
    current_price?: number;
  };
  optimal_price: number;
  price_increase: number;
}

export function useSalesAnalytics(eventId: string, daysAhead = 30) {
  return useQuery<SalesForecastResponse>({
    queryKey: ['sales-forecast', eventId, daysAhead],
    queryFn: async () => {
      const response = await fetch(
        `/api/analytics/sales-forecast?event_id=${eventId}&days_ahead=${daysAhead}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch sales forecast');
      }
      
      return response.json();
    },
    enabled: !!eventId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useSentimentAnalysis() {
  return useMutation<
    SentimentAnalysisResponse,
    Error,
    SentimentAnalysisRequest
  >({
    mutationFn: async (data) => {
      const response = await fetch('/api/analytics/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze sentiment');
      }
      
      return response.json();
    },
  });
}

export function useAnomalyDetection() {
  return useMutation<
    AnomalyDetectionResponse,
    Error,
    AnomalyDetectionRequest
  >({
    mutationFn: async (data) => {
      const response = await fetch('/api/analytics/anomaly-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to detect anomalies');
      }
      
      return response.json();
    },
  });
}

export function usePricingOptimization(eventId: string, currentPrice?: number) {
  const queryParams = new URLSearchParams();
  queryParams.append('event_id', eventId);
  
  if (currentPrice !== undefined) {
    queryParams.append('current_price', currentPrice.toString());
  }
  
  return useQuery<PricingOptimizationResponse>({
    queryKey: ['pricing-optimization', eventId, currentPrice],
    queryFn: async () => {
      const response = await fetch(
        `/api/analytics/pricing?${queryParams.toString()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to optimize pricing');
      }
      
      return response.json();
    },
    enabled: !!eventId,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}