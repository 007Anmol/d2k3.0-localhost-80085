// src/components/events/TrendingArtists.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const artists = [
  {
    id: 'artist1',
    name: 'DJ LUNA',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
    events: 5,
    followers: '120K'
  },
  {
    id: 'artist2',
    name: 'The Breakouts',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390',
    events: 3,
    followers: '85K'
  },
  {
    id: 'artist3',
    name: 'Aurora Lux',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
    events: 8,
    followers: '230K'
  },
  {
    id: 'artist4',
    name: 'KAZUKI',
    image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61',
    events: 2,
    followers: '50K'
  }
];

export default function TrendingArtists() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {artists.map((artist, index) => (
        <motion.div
          key={artist.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Link href={`/artist/${artist.id}`} className="block">
            <div className="relative aspect-square rounded-xl overflow-hidden group">
              <Image
                src={artist.image}
                alt={artist.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="font-semibold text-white">{artist.name}</h3>
                <div className="flex justify-between text-xs text-gray-300 mt-1">
                  <span>{artist.events} events</span>
                  <span>{artist.followers} followers</span>
                </div>
              </div>
              
              <motion.div
                className="absolute top-2 right-2 bg-violet-600/90 text-white text-xs rounded-full px-2 py-0.5"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
              >
                Trending
              </motion.div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}