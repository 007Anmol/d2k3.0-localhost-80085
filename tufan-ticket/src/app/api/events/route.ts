import { NextRequest, NextResponse } from 'next/server';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  organizer: {
    id: string;
    name: string;
    logo?: string;
  };
  category: string;
  subCategory?: string;
  tags: string[];
  imageUrl: string;
  pricing: {
    currency: string;
    basePrice: number;
    minPrice?: number;
    maxPrice?: number;
    tiers?: {
      name: string;
      price: number;
      availableQuantity?: number;
    }[];
  };
  capacity: number;
  ticketsSold?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock data for demonstration purposes
export const events: Event[] = [
  {
    id: '1',
    title: 'Summer Music Festival',
    description: 'A three-day music festival featuring top artists from around the world.',
    date: '2023-06-15',
    startTime: '12:00',
    endTime: '23:00',
    location: {
      name: 'Central Park',
      address: '123 Park Ave',
      city: 'New York',
      state: 'NY',
      postalCode: '10022',
      country: 'USA',
      latitude: 40.7812,
      longitude: -73.9665,
    },
    organizer: {
      id: 'org-1',
      name: 'Event Productions Inc.',
      logo: '/logos/event-productions.png',
    },
    category: 'music',
    subCategory: 'festival',
    tags: ['music', 'festival', 'summer', 'outdoor'],
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
    pricing: {
      currency: 'USD',
      basePrice: 49.99,
      tiers: [
        { name: 'General Admission', price: 49.99, availableQuantity: 5000 },
        { name: 'VIP', price: 149.99, availableQuantity: 500 },
      ],
    },
    capacity: 5500,
    ticketsSold: 3200,
    status: 'upcoming',
    featured: true,
    createdAt: '2023-01-15T12:00:00Z',
    updatedAt: '2023-02-01T10:30:00Z',
  },
  // Additional events would be defined here
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Parse query parameters
  const category = searchParams.get('category');
  const location = searchParams.get('location');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const limit = parseInt(searchParams.get('limit') || '10');
  const page = parseInt(searchParams.get('page') || '1');
  
  // Filter events based on query parameters
  let filteredEvents = [...events];
  
  if (category) {
    filteredEvents = filteredEvents.filter(event => 
      event.category === category || event.tags.includes(category)
    );
  }
  
  // Additional filtering logic would be implemented here
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);
  
  const totalEvents = filteredEvents.length;
  const totalPages = Math.ceil(totalEvents / limit);
  
  return NextResponse.json({
    events: paginatedEvents,
    pagination: {
      total: totalEvents,
      page,
      limit,
      totalPages,
    },
  });
}