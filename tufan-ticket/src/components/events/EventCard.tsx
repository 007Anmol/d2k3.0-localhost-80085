// src/components/events/EventCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Star } from 'lucide-react';

export interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  price: number;
  tags?: string[];
  trend_score?: number;
  attendeeCount?: number;
  averageRating?: number;
}

export default function EventCard({
  id,
  title,
  date,
  location,
  image,
  price,
  tags = [],
  trend_score,
  attendeeCount = Math.floor(Math.random() * 500) + 50,
  averageRating = (Math.random() * 2) + 3,
}: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="event-card block rounded-2xl overflow-hidden shadow-lg relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/event/${id}`} className="block">
        <div className="relative aspect-[3/2]">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          
          {/* Frosted Glass Stats Bar */}
          <div className="absolute bottom-0 left-0 right-0 frosted-glass-dark py-2 px-3 flex items-center justify-between text-xs">
            <div className="flex items-center">
              <Users size={14} className="mr-1" />
              <span>{attendeeCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center">
              <Star size={14} className="mr-1 text-yellow-400" />
              <span>{averageRating.toFixed(1)}</span>
            </div>
          </div>
          
          {/* Price badge - Early Bird or Regular */}
          <div className="absolute top-2 right-2 frosted-glass px-3 py-1 text-sm font-semibold">
            {Math.random() > 0.5 ? (
              <>
                <span className="line-through text-gray-400 mr-1">${(price * 1.25).toFixed(0)}</span>
                <span className="text-green-400">${price.toFixed(0)}</span>
              </>
            ) : (
              <span>${price.toFixed(0)}</span>
            )}
          </div>
          
          {/* Trending indicator with fire animation */}
          {trend_score && trend_score > 5 && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full px-3 py-1 text-xs font-bold flex items-center">
              <span className="mr-1">Trending</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                🔥
              </motion.span>
            </div>
          )}
          
          {/* Limited availability badge */}
          {Math.random() > 0.7 && (
            <div className="absolute top-12 left-0 bg-red-500/90 text-white text-xs font-bold py-1 px-2 rounded-r-lg">
              Only {Math.floor(Math.random() * 20) + 5} tickets left!
            </div>
          )}
          
          {/* Tags */}
          {tags.length > 0 && (
            <div className="absolute bottom-12 left-2 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span 
                  key={tag} 
                  className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 bg-gray-800/95">
          <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-1">{title}</h3>
          
          <div className="flex items-center text-gray-400 text-sm mb-1.5">
            <Calendar size={14} className="mr-1.5" />
            <span>{date}</span>
          </div>
          
          <div className="flex items-center text-gray-400 text-sm">
            <MapPin size={14} className="mr-1.5" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>
        
        {/* Friends attending badge */}
        {Math.random() > 0.6 && (
          <div className="absolute -right-2 -bottom-2 bg-violet-600 text-white text-xs font-bold py-1 px-2 rounded-lg transform rotate-12">
            {Math.floor(Math.random() * 3) + 1} friends going
          </div>
        )}
      </Link>
    </motion.div>
  );
}