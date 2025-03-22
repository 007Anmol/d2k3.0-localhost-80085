// src/components/recommendations/RecommendationCarousel.tsx
'use client';

import { useState, useRef, useEffect, Key } from 'react';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import EventCard, { EventCardProps } from '@/components/events/EventCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetRecommendations, useGetTrendingEvents } from '@/hooks/useRecommendation';

interface RecommendationCarouselProps {
  type: 'personalized' | 'trending' | 'nearby' | 'discovery';
  userId?: string;
  category?: string;
  limit?: number;
  title?: string;
}

export default function RecommendationCarousel({ 
  type, 
  userId = 'user_1',
  category,
  limit = 10,
  title
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
  
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => scrollToIndex(Math.min(currentIndex + 1, events.length - 1)),
    onSwipedRight: () => scrollToIndex(Math.max(currentIndex - 1, 0)),
    trackMouse: true
  });
  
  const scrollToIndex = (index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: index * containerRef.current.offsetWidth * 0.85,
        behavior: 'smooth',
      });
      setCurrentIndex(index);
    }
  };
  
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
      <div className="text-gray-500 text-center py-6 px-4 rounded-xl border border-gray-800 bg-gray-900">
        <p>No {type} events found</p>
        <p className="text-sm mt-2">Try adjusting your filters or check back later</p>
      </div>
    );
  }
  
  return (
    <div className="relative" {...swipeHandlers}>
      {/* Navigation Buttons for Desktop */}
      {events.length > 1 && (
        <>
          <button 
            onClick={() => scrollToIndex(Math.max(currentIndex - 1, 0))}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 lg:flex hidden items-center justify-center w-10 h-10 rounded-full bg-gray-900/80 text-white cursor-pointer hover:bg-violet-600 transition-colors"
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={20} />
          </button>
          
          <button 
            onClick={() => scrollToIndex(Math.min(currentIndex + 1, events.length - 1))}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 lg:flex hidden items-center justify-center w-10 h-10 rounded-full bg-gray-900/80 text-white cursor-pointer hover:bg-violet-600 transition-colors"
            disabled={currentIndex === events.length - 1}
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
      
      <div 
        ref={containerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pb-6 pt-2"
      >
        {events.map((event: EventCardProps, index: number) => (
          <motion.div 
            key={event.id || index}
            className="flex-none w-[85%] pr-4 snap-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <EventCard {...event} />
          </motion.div>
        ))}
      </div>
      
      {/* Only show pagination if we have more than one item */}
      {events.length > 1 && (
        <div className="flex justify-center mt-2">
          {events.map((_: any, index: Key | null | undefined) => (
            <button
              key={index}
              className={`w-2 h-2 mx-1 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-violet-600 w-4' : 'bg-gray-700'
              }`}
              onClick={() => scrollToIndex(index as number)}
            />
          ))}
        </div>
      )}
    </div>
  );
}