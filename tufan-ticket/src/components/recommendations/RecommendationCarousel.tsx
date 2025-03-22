// src/components/recommendations/RecommendationCarousel.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import EventCard from '@/components/events/EventCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useGetRecommendations, useGetTrendingEvents } from '@/hooks/useRecommendation';

interface RecommendationCarouselProps {
  type: 'personalized' | 'trending' | 'nearby' | 'discovery';
  userId?: string;
  category?: string;
  limit?: number;
}

export default function RecommendationCarousel({ 
  type, 
  userId = 'user_1', // Default user for demo purposes
  category,
  limit = 10
}: RecommendationCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use the appropriate hook based on recommendation type
  const { 
    data: recommendationsData, 
    isLoading: isRecommendationsLoading, 
    error: recommendationsError 
  } = type === 'trending' 
    ? useGetTrendingEvents(category, limit)
    : useGetRecommendations(type, userId);
  
  // Extract events from the response
  const events = recommendationsData?.events || [];
  
  // Handle scroll behavior for pagination
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollPosition = containerRef.current.scrollLeft;
        const itemWidth = containerRef.current.offsetWidth * 0.85;
        const newIndex = Math.round(scrollPosition / itemWidth);
        setCurrentIndex(newIndex);
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  if (isRecommendationsLoading) {
    return <div className="flex justify-center py-10"><LoadingSpinner /></div>;
  }
  
  if (recommendationsError) {
    return (
      <div className="text-red-500 text-center py-4">
        Error loading recommendations
      </div>
    );
  }
  
  // Fallback if no events are returned
  if (events.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        No {type} events found
      </div>
    );
  }
  
  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 py-2"
      >
        {events.map((event: any, index: number) => (
          <div 
            key={event.id || index}
            className="flex-none w-[85%] pr-4 snap-start"
          >
            <EventCard {...event} />
          </div>
        ))}
      </div>
      
      {/* Only show pagination if we have more than one item */}
      {events.length > 1 && (
        <div className="flex justify-center mt-4">
          {events.map((_: any, index: number) => (
            <button
              key={index.toString()}
              className={`w-2 h-2 mx-1 rounded-full ${
                index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
              }`}
              onClick={() => {
                if (containerRef.current) {
                  containerRef.current.scrollTo({
                    left: index * containerRef.current.offsetWidth * 0.85,
                    behavior: 'smooth',
                  });
                  setCurrentIndex(index);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}