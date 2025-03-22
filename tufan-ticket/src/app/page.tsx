// src/app/page.tsx
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import Navbar from '@/components/common/Navbar';
import BottomNavigation from '@/components/common/BottomNavigation';
import RecommendationCarousel from '@/components/recommendations/RecommendationCarousel';
import RecommendationsProvider from '@/providers/RecommendationsProvider';
import CategoryFilters from '@/components/events/CategoryFilters';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export const metadata: Metadata = {
  title: 'TufanTicket - Discover Events',
  description: 'AI-powered event discovery for Gen Z'
};

export default function Home({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | string[] | undefined } 
}) {
  // Get the category from URL params
  const category = typeof searchParams.category === 'string' 
    ? searchParams.category 
    : undefined;
  
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-60 md:h-80 w-full">
        <Image
          src="/images/hero-background.jpg"
          alt="Discover events"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/70 to-secondary-900/50 flex items-center px-6">
          <div className="max-w-md">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Discover Your Next Experience
            </h1>
            <p className="text-white/90 mb-4">
              Personalized events curated just for you
            </p>
            <Link href="/explore" className="btn-primary inline-block">
              Explore Now
            </Link>
          </div>
        </div>
      </section>
      
      {/* Category Filters */}
      <CategoryFilters />
      
      {/* Personalized Recommendations */}
      <section className="mt-8 px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">For You</h2>
          <Link href="/recommendations" className="text-primary-600 text-sm font-medium">
            View All
          </Link>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <RecommendationsProvider 
            type="personalized" 
            category={category} 
            limit={10}
          />
        </Suspense>
      </section>

      {/* Trending Events */}
      <section className="mt-8 px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Trending Now</h2>
          <Link href="/trending" className="text-primary-600 text-sm">
            View All
          </Link>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <RecommendationsProvider 
            type="trending" 
            category={category}
            limit={10}
          />
        </Suspense>
      </section>
      
      <BottomNavigation />
    </div>
  );
}