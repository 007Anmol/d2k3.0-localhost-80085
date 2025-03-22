// src/components/events/EventCard.tsx
import Link from 'next/link';
import Image from 'next/image';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  price: number;
  tags?: string[];
  trend_score?: number;
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
}: EventCardProps) {
  return (
    <Link href={`/event/${id}`} className="event-card block rounded-lg overflow-hidden shadow-md bg-white transition-transform hover:shadow-lg hover:-translate-y-1">
      <div className="relative aspect-[3/2]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
        
        {/* Price badge */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-primary-700">
          ${price.toFixed(2)}
        </div>
        
        {/* Trending indicator */}
        {trend_score && trend_score > 5 && (
          <div className="absolute top-2 left-2 bg-red-500/90 text-white backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold">
            Trending 🔥
          </div>
        )}
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
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
      
      <div className="p-3">
        <h3 className="font-semibold text-lg leading-tight mb-1 line-clamp-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-1">{date}</p>
        <p className="text-sm text-gray-700 line-clamp-1">{location}</p>
      </div>
    </Link>
  );
}