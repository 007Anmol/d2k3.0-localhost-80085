'use client';

import { useMemo } from 'react';
import { usePerformanceAnalytics } from '@/hooks/useAnalytics';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';

interface PerformanceMetricsProps {
  organizerId: string;
  eventId?: string;
}

export default function PerformanceMetrics({ organizerId, eventId }: PerformanceMetricsProps) {
  const { data, isLoading, error } = usePerformanceAnalytics({ organizerId, eventId });
  
  const performanceData = useMemo(() => {
    if (!data?.metrics || data.metrics.length === 0) return [];
    
    // If specific event provided, use that data
    if (eventId) {
      const eventData = data.metrics[0];
      return [
        { subject: 'Sales', A: eventData.salesPerformance, fullMark: 100 },
        { subject: 'Engagement', A: eventData.attendeeEngagement, fullMark: 100 },
        { subject: 'Pricing', A: eventData.priceEfficiency, fullMark: 100 },
        { subject: 'Marketing', A: eventData.marketingEffectiveness, fullMark: 100 },
      ];
    }
    
    // Otherwise calculate average across all events
    const avgSales = data.metrics.reduce((sum: number, event: any) => sum + event.salesPerformance, 0) / data.metrics.length;
    const avgEngagement = data.metrics.reduce((sum: number, event: any) => sum + event.attendeeEngagement, 0) / data.metrics.length;
    const avgPricing = data.metrics.reduce((sum: number, event: any) => sum + event.priceEfficiency, 0) / data.metrics.length;
    const avgMarketing = data.metrics.reduce((sum: number, event: any) => sum + event.marketingEffectiveness, 0) / data.metrics.length;
    
    return [
      { subject: 'Sales', A: avgSales, fullMark: 100 },
      { subject: 'Engagement', A: avgEngagement, fullMark: 100 },
      { subject: 'Pricing', A: avgPricing, fullMark: 100 },
      { subject: 'Marketing', A: avgMarketing, fullMark: 100 },
    ];
  }, [data, eventId]);
  
  if (isLoading) {
    return (
      <div className="h-80 w-full flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="animate-pulse text-gray-400">Loading performance metrics...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-80 w-full flex items-center justify-center bg-red-50 rounded-lg">
        <div className="text-red-500">Failed to load performance metrics</div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">
        {eventId ? 'Event Performance Metrics' : 'Overall Performance Metrics'}
      </h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#4B5563', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Performance"
              dataKey="A"
              stroke="#0EA5E9"
              fill="#0EA5E9"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      {eventId ? (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <PerformanceCard 
            title="Event Date" 
            value={new Date(data.metrics[0].eventDate).toLocaleDateString()} 
            icon="📅"
          />
          <PerformanceCard 
            title="Overall Score" 
            value={`${Math.round((
              data.metrics[0].salesPerformance + 
              data.metrics[0].attendeeEngagement + 
              data.metrics[0].priceEfficiency + 
              data.metrics[0].marketingEffectiveness
            ) / 4)}%`} 
            icon="🎯"
          />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.metrics.slice(0, 4).map((event: any) => (
            <div key={event.eventId} className="bg-gray-50 p-3 rounded-lg text-center">
              <h4 className="text-sm font-medium mb-1 truncate">{event.eventName}</h4>
              <p className="text-xs text-gray-500">{new Date(event.eventDate).toLocaleDateString()}</p>
              <div className="mt-2 text-lg font-semibold text-primary-700">
                {Math.round((
                  event.salesPerformance + 
                  event.attendeeEngagement + 
                  event.priceEfficiency + 
                  event.marketingEffectiveness
                ) / 4)}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface PerformanceCardProps {
  title: string;
  value: string;
  icon: string;
}

function PerformanceCard({ title, value, icon }: PerformanceCardProps) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <div className="flex items-center">
        <div className="text-xl mr-3">{icon}</div>
        <div>
          <h4 className="text-sm font-medium text-gray-700">{title}</h4>
          <p className="text-lg font-semibold text-primary-700">{value}</p>
        </div>
      </div>
    </div>
  );
}