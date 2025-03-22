// src/components/recommendations/RecommendationCarousel.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import EventCard from '@/components/events/EventCard';
import { useGetRecommendations } from '@/hooks/useRecommendation';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface RecommendationCarouselProps {
  type: 'personalized' | 'trending' | 'nearby' | 'discovery';
}

export default function RecommendationCarousel({ type }: RecommendationCarouselProps) {
  const { data, isLoading, error } = useGetRecommendations(type);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mock data for development
  const mockEvents = [
    {
      id: '1',
      title: 'Summer Music Festival',
      date: 'June 15, 2023',
      location: 'Central Park',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
      price: 49.99,
      tags: ['music', 'festival'],
    },
    {
      id: '2',
      title: 'Tech Conference 2023',
      date: 'July 10, 2023',
      location: 'Convention Center',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
      price: 99.99,
      tags: ['tech', 'conference'],
    },
    {
      id: '3',
      title: 'Food & Wine Expo',
      date: 'August 5, 2023',
      location: 'Downtown Plaza',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
      price: 29.99,
      tags: ['food', 'wine'],
    },
  ];
  
  // Make sure displayEvents is always an array
  const displayEvents = (Array.isArray(data?.events) ? data.events : 
                         Array.isArray(data) ? data : 
                         mockEvents).map(event => ({
                           ...event,
                           tags: event.tags || []
                         }));
  
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
  
  if (isLoading) {
    return <div className="flex justify-center py-10"><LoadingSpinner /></div>;
  }
  
  if (error) {
    return <div className="text-red-500 text-center py-4">Error loading recommendations</div>;
  }
  
  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 py-2"
      >
        {displayEvents.map((event: { id: string; title: string; date: string; location: string; image: string; price: number; tags: string[] }, index: number) => (
          <div 
            key={event.id || index}
            className="flex-none w-[85%] pr-4 snap-start"
          >
            <EventCard {...event} />
          </div>
        ))}
      </div>
      
      {/* Only show pagination if we have more than one item */}
      {displayEvents.length > 1 && (
        <div className="flex justify-center mt-4">
          {displayEvents.map((_: any, index: string | number | bigint | ((prevState: number) => number) | null | undefined) => (
            <button
              key={index as number}
              className={`w-2 h-2 mx-1 rounded-full ${
                index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
              }`}
              onClick={() => {
                if (containerRef.current) {
                  containerRef.current.scrollTo({
                    left: Number(index) * containerRef.current.offsetWidth * 0.85,
                    behavior: 'smooth',
                  });
                  setCurrentIndex(index as number);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}