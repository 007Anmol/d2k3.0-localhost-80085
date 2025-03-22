"use client"
// src/app/page.tsx
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import BottomNavigation from '@/components/common/BottomNavigation';
import RecommendationCarousel from '@/components/recommendations/RecommendationCarousel';
import CategoryFilters from '@/components/events/CategoryFilters';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import LoyaltyBadges from '@/components/rewards/LoyaltyBadges';
import TrendingArtists from '@/components/events/TrendingArtists';

interface HomeProps {
  viewport?: {
    width: number;
    height: number;
  };
}

const Home = ({ viewport }: HomeProps) => {
  // Get the category from URL params
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || undefined;
  
  return (
    <main className="min-h-screen pb-20 md:pb-0 page-animation">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] max-h-[500px] min-h-[400px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
          alt="Discover events"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent flex flex-col justify-end px-6 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-md"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">Vibe</span>
            </h1>
            <p className="text-white/80 mb-6 text-lg">
              Discover events that match your energy
            </p>
            <Link href="/explore" className="btn-primary inline-flex items-center">
              Explore Events
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Category Filters */}
      <CategoryFilters />
      
      {/* Loyalty Badges */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="mt-6 px-4"
      >
        <LoyaltyBadges />
      </motion.section>
      
      {/* Personalized Recommendations */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="mt-8 px-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">For You</h2>
          <Link href="/recommendations" className="text-violet-400 text-sm font-medium hover:text-violet-300 transition-colors">
            View All
          </Link>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <RecommendationCarousel 
            type="personalized" 
            category={category} 
            limit={10}
          />
        </Suspense>
      </motion.section>
      
      {/* Trending Events */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="mt-8 px-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Trending Now</h2>
          <Link href="/trending" className="text-violet-400 text-sm hover:text-violet-300 transition-colors">
            View All
          </Link>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <RecommendationCarousel 
            type="trending" 
            category={category}
            limit={10}
          />
        </Suspense>
      </motion.section>
      
      {/* Trending Artists */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
        className="mt-8 px-4 mb-12"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Popular Artists</h2>
          <Link href="/artists" className="text-violet-400 text-sm hover:text-violet-300 transition-colors">
            View All
          </Link>
        </div>
        <TrendingArtists />
      </motion.section>
      
      <BottomNavigation />
    </main>
  );
}

export default Home;