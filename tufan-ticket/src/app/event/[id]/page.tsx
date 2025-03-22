'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { FiCalendar, FiMapPin, FiClock, FiShare2, FiHeart, FiDollarSign } from 'react-icons/fi';
import Navbar from '@/components/common/Navbar';
import BottomNavigation from '@/components/common/BottomNavigation';
import RecommendationCarousel from '@/components/recommendations/RecommendationCarousel';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Mock event data - in a real app, this would come from an API
const eventData = {
  id: '1',
  title: 'Summer Music Festival 2023',
  description: 'Experience the best summer music festival featuring top artists from around the world! Join us for three days of music, food, and fun in the heart of the city.',
  date: '2023-07-15T12:00:00Z',
  endDate: '2023-07-17T23:00:00Z',
  location: {
    name: 'Central Park',
    address: '123 Park Avenue',
    city: 'New York',
    state: 'NY',
    postalCode: '10022',
    latitude: 40.7812,
    longitude: -73.9665,
  },
  organizer: {
    id: 'org-1',
    name: 'Event Productions Inc.',
    logo: '/images/organizers/production-inc.png',
  },
  category: 'music',
  subCategory: 'festival',
  tags: ['music', 'festival', 'summer', 'outdoor'],
  imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
  pricing: {
    currency: 'USD',
    basePrice: 49.99,
    tiers: [
      { name: 'General Admission', price: 49.99, availableQuantity: 1800 },
      { name: 'VIP', price: 149.99, availableQuantity: 200 },
    ],
  },
  capacity: 5500,
  ticketsSold: 3200,
  featured: true,
};

export default function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    // In a real app, fetch the event data from the API
    // For now, we'll use the mock data
    setEvent(eventData);
    setLoading(false);
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Event Not Found</h2>
          <p className="mt-2 text-gray-500">The event you're looking for does not exist or has been removed.</p>
          <Link href="/" className="mt-4 btn-primary inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  const startDate = parseISO(event.date);
  const endDate = parseISO(event.endDate);
  
  const selectedTicketTier = event.pricing.tiers[selectedTier];
  const totalPrice = selectedTicketTier.price * quantity;
  
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Navbar />
      
      {/* Event Image */}
      <div className="relative h-64 md:h-96 w-full">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag: string) => (
                <span 
                  key={tag} 
                  className="bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
            <FiShare2 className="w-5 h-5 text-white" />
          </button>
          <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
            <FiHeart className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
      
      {/* Event Details */}
      <div className="px-4 py-6">
        <div className="flex flex-col md:flex-row md:space-x-8">
          {/* Left column - event information */}
          <div className="md:w-2/3">
            <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between mb-6">
                <div className="flex items-center mb-3 sm:mb-0">
                  <FiCalendar className="w-5 h-5 text-primary-600 mr-2" />
                  <div>
                    <div className="font-medium">
                      {format(startDate, 'EEE, MMM d, yyyy')}
                      {!event.endDate || (
                        endDate.toDateString() === startDate.toDateString() ? '' : 
                        ` - ${format(endDate, 'EEE, MMM d, yyyy')}`
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FiMapPin className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{event.location.name}</div>
                    <div className="text-sm text-gray-500">
                      {event.location.city}, {event.location.state}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-2">About this event</h3>
                <p className="text-gray-700">{event.description}</p>
                
                <h4 className="text-md font-semibold mt-4 mb-2">Organizer</h4>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 relative overflow-hidden">
                    <Image
                      src={event.organizer.logo || 'https://via.placeholder.com/40'}
                      alt={event.organizer.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{event.organizer.name}</div>
                    <Link href={`/organizer/${event.organizer.id}`} className="text-sm text-primary-600">
                      View organizer profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Location Map (placeholder) */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-3">Location</h3>
              <div className="aspect-video bg-gray-200 rounded-lg relative overflow-hidden">
                <Image
                  src="https://maps.googleapis.com/maps/api/staticmap?center=40.7812,-73.9665&zoom=15&size=600x300&markers=color:red%7C40.7812,-73.9665&key=YOUR_API_KEY"
                  alt="Event location map"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20">
                  <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
                    <h4 className="font-medium">{event.location.name}</h4>
                    <p className="text-sm text-gray-600">
                      {event.location.address}, {event.location.city}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <Link 
                  href={`https://maps.google.com/?q=${event.location.latitude},${event.location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 text-sm font-medium"
                >
                  View on Google Maps
                </Link>
              </div>
            </div>
            
            {/* Similar Events
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">You might also like</h3>
              <RecommendationCarousel type="personalized" />
            </div> */}
          </div>
          
          {/* Right column - ticket purchase */}
          <div className="md:w-1/3 mt-6 md:mt-0">
            <div className="bg-white p-4 rounded-xl shadow-sm sticky top-20">
              <h3 className="text-lg font-semibold mb-4">Get Tickets</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Ticket Type
                </label>
                <div className="space-y-2">
                  {event.pricing.tiers.map((tier: any, index: number) => (
                    <div 
                      key={tier.name}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedTier === index ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedTier(index)}
                    >
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">{tier.name}</div>
                          <div className="text-sm text-gray-500">
                            {tier.availableQuantity} available
                          </div>
                        </div>
                        <div className="font-semibold text-primary-700">
                          ${tier.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button 
                    className="px-3 py-2 bg-gray-100 text-gray-600"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={selectedTicketTier.availableQuantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(
                      selectedTicketTier.availableQuantity,
                      Math.max(1, parseInt(e.target.value))
                    ))}
                    className="w-full py-2 px-3 text-center focus:outline-none"
                  />
                  <button 
                    className="px-3 py-2 bg-gray-100 text-gray-600"
                    onClick={() => setQuantity(Math.min(selectedTicketTier.availableQuantity, quantity + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${(selectedTicketTier.price * quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Service Fee</span>
                  <span>${(selectedTicketTier.price * quantity * 0.10).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg mt-3">
                  <span>Total</span>
                  <span>${(selectedTicketTier.price * quantity * 1.10).toFixed(2)}</span>
                </div>
              </div>
              
              <button className="btn-primary w-full py-3 flex items-center justify-center">
                <FiDollarSign className="mr-2" /> Get Tickets
              </button>
              
              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Tickets are non-refundable</p>
                <p className="mt-1">
                  By purchasing, you agree to our{' '}
                  <Link href="/terms" className="text-primary-600">
                    terms and conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}