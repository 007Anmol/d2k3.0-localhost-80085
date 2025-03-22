'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useAudienceAnalytics } from '@/hooks/useAnalytics';

interface AudienceDemographicsProps {
  organizerId: string;
  eventId?: string;
}

export default function AudienceDemographics({ organizerId, eventId }: AudienceDemographicsProps) {
  const { data, isLoading, error } = useAudienceAnalytics({ organizerId, eventId });
  
  const ageData = useMemo(() => {
    if (!data?.metrics?.demographics?.ageGroups) return [];
    
    return data.metrics.demographics.ageGroups.map((item: any) => ({
      name: item.label,
      value: item.percentage,
    }));
  }, [data]);
  
  const genderData = useMemo(() => {
    if (!data?.metrics?.demographics?.gender) return [];
    
    return data.metrics.demographics.gender.map((item: any) => ({
      name: item.label,
      value: item.percentage,
    }));
  }, [data]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A259FF'];
  
  if (isLoading) {
    return (
      <div className="h-64 w-full flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="animate-pulse text-gray-400">Loading audience data...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-64 w-full flex items-center justify-center bg-red-50 rounded-lg">
        <div className="text-red-500">Failed to load audience data</div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Audience Demographics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2 text-center">Age Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ageData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Percentage']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2 text-center">Gender Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Percentage']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-600 mb-3">Top Locations</h4>
        <div className="grid grid-cols-2 gap-2">
          {data?.metrics?.demographics?.location.map((item: any) => (
            <div key={item.city} className="flex justify-between items-center bg-gray-50 p-2 rounded">
              <span className="text-sm font-medium">{item.city}</span>
              <span className="text-sm text-gray-500">{item.count} users</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}