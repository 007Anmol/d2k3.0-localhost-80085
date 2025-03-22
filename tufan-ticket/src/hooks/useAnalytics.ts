import { useQuery } from '@tanstack/react-query';
import { 
  getSalesAnalytics, 
  getAudienceAnalytics,

  getPerformanceAnalytics,
  SalesAnalyticsRequest, 
  AudienceAnalyticsRequest,
  PerformanceAnalyticsRequest
} from '@/services/analytics';

export const useSalesAnalytics = (request: SalesAnalyticsRequest, options = {}) => {
  return useQuery({
    queryKey: ['sales-analytics', request.organizerId, request.eventId, request.timeRange],
    queryFn: () => getSalesAnalytics(request),
    staleTime: 1000 * 60 * 15, // 15 minutes
    ...options,
  });
};

export const useAudienceAnalytics = (request: AudienceAnalyticsRequest, options = {}) => {
    return useQuery({
      queryKey: ['audience-analytics', request.organizerId, request.eventId],
      queryFn: () => getAudienceAnalytics(request),
      staleTime: 1000 * 60 * 60, // 1 hour
      ...options,
    });
  };
export const usePerformanceAnalytics = (request: PerformanceAnalyticsRequest, options = {}) => {
  return useQuery({
    queryKey: ['performance-analytics', request.organizerId, request.eventId],
    queryFn: () => getPerformanceAnalytics(request),
    staleTime: 1000 * 60 * 60, // 1 hour
    ...options,
  });
}
 
