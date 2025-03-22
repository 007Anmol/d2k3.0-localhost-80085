// src/components/events/CategoryFilters.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Define categories with icons (you can use any icon library you prefer)
const categories = [
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'arts', name: 'Arts', icon: '🎨' },
  { id: 'food', name: 'Food', icon: '🍔' },
  { id: 'tech', name: 'Tech', icon: '💻' },
];

export default function CategoryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || '';
  
  const handleCategoryClick = (categoryId: string) => {
    // If clicking on already selected category, clear the filter
    const newCategory = currentCategory === categoryId ? '' : categoryId;
    
    // Update URL with the selected category
    const params = new URLSearchParams(searchParams);
    if (newCategory) {
      params.set('category', newCategory);
    } else {
      params.delete('category');
    }
    
    router.push(`/?${params.toString()}`);
  };
  
  return (
    <div className="overflow-x-auto py-4 px-4">
      <div className="flex space-x-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg min-w-[80px] transition-colors ${
              currentCategory === category.id
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="text-xl mb-1">{category.icon}</span>
            <span className="text-sm font-medium">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}