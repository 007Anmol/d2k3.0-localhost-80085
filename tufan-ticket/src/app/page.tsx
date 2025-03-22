import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import BottomNavigation from '@/components/common/BottomNavigation';
import EventCard from '@/components/events/EventCard';
import RecommendationCarousel from '@/components/recommendations/RecommendationCarousel';
import CategoryFilters from '@/components/events/CategoryFilters';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function Home() {
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
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
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
      <section className="mt-6 px-4">
        <CategoryFilters />
      </section>
      
      {/* Personalized Recommendations */}
      <section className="mt-8 px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">For You</h2>
          <Link href="/recommendations" className="text-primary-600 text-sm font-medium">
            View All
          </Link>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <RecommendationCarousel type="personalized" />
        </Suspense>
      </section>
      
      {/* Trending Events */}
      <section className="mt-8 px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Trending Now</h2>
          <Link href="/trending" className="text-primary-600 text-sm font-medium">
            View All
          </Link>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <RecommendationCarousel type="trending" />
        </Suspense>
      </section>
      
      {/* Nearby Events */}
      <section className="mt-8 px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Nearby Events</h2>
          <Link href="/nearby" className="text-primary-600 text-sm font-medium">
            View Map
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((id) => (
            <EventCard 
              key={id}
              id={id.toString()}
              title={`Local Event ${id}`}
              date="Tomorrow, 7:00 PM"
              location="Downtown Venue"
              image={`/images/event-${id}.jpg`}
              price={25 + id * 5}
              tags={['music', 'local']}
            />
          ))}
        </div>
      </section>
      
      <BottomNavigation />
    </div>
  );
}