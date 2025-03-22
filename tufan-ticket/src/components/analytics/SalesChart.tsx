'use client';

import { useMemo } from 'react';
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { useSalesAnalytics } from '@/hooks/useAnalytics';

interface SalesChartProps {
  organizerId: string;
  eventId?: string;
  timeRange: '7d' | '30d' | '90d';
}

export default function SalesChart({ organizerId, eventId, timeRange }: SalesChartProps) {
  const { data, isLoading, error } = useSalesAnalytics({ organizerId, eventId, timeRange });
  
  const salesData = useMemo(() => {
    if (!data?.metrics?.revenueTrend) return [];
    
    return data.metrics.revenueTrend.map((item: any) => ({
      date: item.date,
      revenue: item.revenue,
      formattedDate: format(parseISO(item.date), 'MMM d'),
    }));
  }, [data]);
  
  if (isLoading) {
    return (
      <div className="h-64 w-full flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="animate-pulse text-gray-400">Loading sales data...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-64 w-full flex items-center justify-center bg-red-50 rounded-lg">
        <div className="text-red-500">Failed to load sales data</div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Revenue Trend</h3>
        <div className="text-sm font-medium text-gray-500">
          {timeRange === '7d' ? 'Last 7 days' : 
           timeRange === '30d' ? 'Last 30 days' : 'Last 90 days'}
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={salesData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="formattedDate" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              width={50}
            />
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f4f6" />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                fontSize: '12px',
              }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#0ea5e9" 
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-sm text-blue-700 font-medium">Total Sales</p>
          <p className="text-xl font-bold text-blue-900">
            ${data?.metrics?.totalSales.toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-sm text-green-700 font-medium">Tickets Sold</p>
          <p className="text-xl font-bold text-green-900">
            {data?.metrics?.ticketsSold.toLocaleString()}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <p className="text-sm text-purple-700 font-medium">Avg. Price</p>
          <p className="text-xl font-bold text-purple-900">
            ${data?.metrics?.averageTicketPrice.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}