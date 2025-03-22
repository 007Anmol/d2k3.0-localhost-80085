// src/components/events/CategoryFilters.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Music, Dumbbell, PaintBucket, Utensils, Laptop } from 'lucide-react';

const categories = [
  { id: 'music', name: 'Music', icon: Music, color: 'bg-purple-600' },
  { id: 'sports', name: 'Sports', icon: Dumbbell, color: 'bg-blue-600' },
  { id: 'arts', name: 'Arts', icon: PaintBucket, color: 'bg-pink-600' },
  { id: 'food', name: 'Food', icon: Utensils, color: 'bg-yellow-600' },
  { id: 'tech', name: 'Tech', icon: Laptop, color: 'bg-green-600' },
];

export default function CategoryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || '';
  
  const handleCategoryClick = (categoryId: string) => {
    // If clicking on already selected category, clear the filter
    const newCategory = currentCategory === categoryId ? '' : categoryId;
    
    // Update URL with the selected category
    const params = new URLSearchParams(searchParams.toString());
    if (newCategory) {
      params.set('category', newCategory);
    } else {
      params.delete('category');
    }
    
    router.push(`/?${params.toString()}`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="overflow-x-auto py-4 px-4 scrollbar-hide"
    >
      <div className="flex space-x-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = currentCategory === category.id;
          
          return (
            <motion.button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center justify-center p-3 rounded-xl min-w-[80px] transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/30'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <div className={`p-2 rounded-full mb-2 ${isActive ? 'bg-white/20' : 'bg-gray-700'}`}>
                <Icon size={20} />
              </div>
              <span className="text-sm font-medium">{category.name}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}