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
}

export default function EventCard({
  id,
  title,
  date,
  location,
  image,
  price,
  tags = [],
}: EventCardProps) {
  return (
    <Link href={`/event/${id}`} className="event-card block">
      <div className="relative aspect-[3/2]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
        
        {/* Price badge */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-primary-700">
          ${price}
        </div>
        
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