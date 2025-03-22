'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const categories = [
  { id: 'all', name: 'All', icon: '🌟' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'arts', name: 'Arts', icon: '🎨' },
  { id: 'food', name: 'Food', icon: '🍔' },
  { id: 'nightlife', name: 'Nightlife', icon: '🍸' },
  { id: 'tech', name: 'Tech', icon: '💻' },
  { id: 'workshops', name: 'Workshops', icon: '🔧' },
];

export default function CategoryFilters() {
  const [activeCategory, setActiveCategory] = useState('all');
  
  return (
    <div className="relative">
      <div className="flex overflow-x-auto scrollbar-hide py-2 -mx-1">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`flex flex-col items-center px-4 py-2 mx-1 rounded-full whitespace-nowrap transition-colors ${
              activeCategory === category.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            <span className="text-lg mb-1">{category.icon}</span>
            <span className="text-xs font-medium">{category.name}</span>
          </button>
        ))}
      </div>
      
      {/* Shadow indicators for scroll */}
      <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none" />
    </div>
  );
}