// src/app/event/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, Users, Share2, 
  Heart, BookmarkPlus, Award, AlertTriangle, 
  User, Check, ChevronDown, CreditCard,
  Ticket
} from 'lucide-react';
import Navbar from '@/components/common/Navbar';
import BottomNavigation from '@/components/common/BottomNavigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import RecommendationCarousel from '@/components/recommendations/RecommendationCarousel';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [ticketOption, setTicketOption] = useState<string>('general');
  const [ticketCount, setTicketCount] = useState<number>(1);
  const [showOptions, setShowOptions] = useState(false);
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 30
  });
  
  // Sample event data - would come from API in real app
  const event = {
    id,
    title: 'Ultra Music Festival 2025',
    description: 'Experience the world\'s premier electronic music festival featuring top DJs and stunning production on multiple stages. This year\'s lineup includes never-before-seen performances and jaw-dropping light shows.',
    longDescription: 'Ultra Music Festival is an annual outdoor electronic music festival that takes place in March in Miami, Florida. The festival was founded in 1999 by Russell Faibisch and Alex Omes and is named after the 1997 Depeche Mode album, Ultra. Ultra Music Festival coincides with Miami Music Week, a series of electronic music events, which was first held from March 22-27, 2011. Ultra has since become a worldwide brand with festivals in multiple countries including South Korea, Croatia, South Africa, Japan, Brazil, and more.',
    date: 'March 21-23, 2025',
    time: '12:00 PM - 12:00 AM',
    location: 'Bayfront Park, Miami, FL',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
    organizer: 'Ultra Enterprises',
    category: 'music',
    tags: ['electronic', 'edm', 'festival', 'outdoor'],
    price: 349.99,
    originalPrice: 399.99,
    attendees: 2587,
    maxAttendees: 3000,
    rating: 4.8,
    reviews: 412,
    ticketOptions: [
      { id: 'general', name: 'General Admission', price: 349.99, originalPrice: 399.99 },
      { id: 'vip', name: 'VIP Access', price: 749.99, originalPrice: 799.99 },
      { id: 'ultra', name: 'Ultra Experience', price: 1249.99, originalPrice: 1299.99 }
    ],
    features: [
      '3-day festival access',
      'Multiple stages with top performers',
      'Food and beverage vendors',
      'Exclusive merchandise',
      'Interactive experiences'
    ],
    lineup: [
      'Martin Garrix',
      'David Guetta',
      'Calvin Harris',
      'Tiesto',
      'Armin van Buuren',
      'Nina Kraviz',
      'Carl Cox',
      'Charlotte de Witte'
    ]
  };
  
  // Mock friends attending
  const friendsAttending = [
    { id: 'friend1', name: 'Alex K.', image: 'https://i.pravatar.cc/150?img=1' },
    { id: 'friend2', name: 'Jamie L.', image: 'https://i.pravatar.cc/150?img=2' },
    { id: 'friend3', name: 'Taylor R.', image: 'https://i.pravatar.cc/150?img=3' },
  ];

  // Calculate the percentage of tickets sold
  const percentSold = (event.attendees / event.maxAttendees) * 100;
  const remainingTickets = event.maxAttendees - event.attendees;
  
  // Current option details
  const selectedOption = event.ticketOptions.find(option => option.id === ticketOption) || event.ticketOptions[0];
  
  // Calculate total price
  const basePrice = selectedOption.price * ticketCount;
  const serviceFee = basePrice * 0.15;
  const totalPrice = basePrice + serviceFee;
  
  // Discount info
  const discount = selectedOption.originalPrice - selectedOption.price;
  const discountPercentage = (discount / selectedOption.originalPrice) * 100;
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  
  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds -= 1;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes -= 1;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours -= 1;
            } else {
              // Timer finished
              clearInterval(interval);
            }
          }
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-20 md:pb-0 page-animation">
      <Navbar />
      
      {/* Hero Image */}
      <div className="relative h-[40vh] lg:h-[50vh]">
        <Image
          src={event.image}
          alt={event.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
        
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-black/50 text-white"
          onClick={() => window.history.back()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </motion.button>
        
        {/* Actions Buttons */}
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          <button className="p-2 rounded-full bg-black/50 text-white">
            <Share2 size={20} />
          </button>
          <button className="p-2 rounded-full bg-black/50 text-white">
            <Heart size={20} />
          </button>
          <button className="p-2 rounded-full bg-black/50 text-white">
            <BookmarkPlus size={20} />
          </button>
        </div>
      </div>
      
      {/* Event Details */}
      <div className="px-4 pt-6 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">{event.title}</h1>
            <div className="flex items-center bg-violet-600/20 text-violet-400 rounded-md px-2 py-1">
              <Award size={16} className="mr-1" />
              <span className="text-sm font-medium">{event.rating}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-gray-400">
              <Calendar size={16} className="mr-1.5" />
              <span className="text-sm">{event.date}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Clock size={16} className="mr-1.5" />
              <span className="text-sm">{event.time}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <MapPin size={16} className="mr-1.5" />
              <span className="text-sm">{event.location}</span>
            </div>
          </div>
          
          {/* Price Badge with Discount */}
          {discount > 0 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mb-6 frosted-glass-dark inline-block px-4 py-2 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="text-red-400 font-semibold">
                  <span className="line-through text-gray-500 text-sm">${selectedOption.originalPrice.toFixed(2)}</span>
                  <span className="block text-green-400 text-lg">${selectedOption.price.toFixed(2)}</span>
                </div>
                <div className="text-white bg-green-500 px-2 py-1 rounded text-xs font-bold">
                  SAVE {discountPercentage.toFixed(0)}%
                </div>
              </div>
              
              {/* Early Bird Timer */}
              <div className="text-xs text-orange-400 mt-1 flex items-center">
                <AlertTriangle size={12} className="mr-1" />
                <span>Early bird pricing ends in {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
              </div>
            </motion.div>
          )}
          
          {/* Tickets Remaining */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mb-6"
          >
            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="text-gray-400">Tickets remaining</span>
              <span className="font-semibold">{remainingTickets} of {event.maxAttendees}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentSold}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600"
              />
            </div>
            {remainingTickets < 100 && (
              <p className="text-orange-400 text-xs mt-1 animate-pulse">
                Hurry! Only {remainingTickets} tickets left
              </p>
            )}
          </motion.div>
          
          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">About This Event</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{event.description}</p>
            <p className="text-gray-400 text-sm leading-relaxed mt-3">{event.longDescription}</p>
          </div>
          
          {/* Lineup */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Lineup</h2>
            <div className="grid grid-cols-2 gap-2">
              {event.lineup.map((artist, index) => (
                <motion.div
                  key={artist}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="flex items-center p-2 bg-gray-800/50 rounded-md"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                    {artist.charAt(0)}
                  </div>
                  <span className="text-sm">{artist}</span>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Social Proof - Friends Attending */}
          {friendsAttending.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="mb-6 p-3 bg-violet-900/20 border border-violet-900/30 rounded-lg"
            >
              <h3 className="font-medium text-sm mb-2 flex items-center">
                <Users size={16} className="mr-1.5 text-violet-400" />
                Friends Going
              </h3>
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  {friendsAttending.map((friend) => (
                    <div key={friend.id} className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-gray-900">
                      <Image
                        src={friend.image}
                        alt={friend.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-300">
                  <span className="font-medium">{friendsAttending[0].name}</span>
                  {friendsAttending.length > 1 && (
                    <span> and {friendsAttending.length - 1} other{friendsAttending.length > 2 ? 's' : ''}</span>
                  )}
                  <span> are attending</span>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Features */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">What's Included</h2>
            <ul className="space-y-2">
              {event.features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="flex items-start"
                >
                  <Check size={18} className="text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
        
        {/* Similar Events */}
        <div className="mt-10 mb-6">
          <h2 className="text-lg font-semibold mb-4">You May Also Like</h2>
          <RecommendationCarousel type="trending" category={event.category} limit={5} />
        </div>
      </div>
      
      {/* Ticket Selection Drawer */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="fixed bottom-0 left-0 right-0 z-30 frosted-glass-dark rounded-t-2xl px-4 pt-4 pb-8 md:pb-4 border-t border-gray-800 shadow-2xl shadow-black/50"
      >
        <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-4" />
        
        <div className="flex flex-col">
          {/* Ticket type selector */}
          <div className="mb-3">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="flex items-center justify-between w-full p-3 bg-gray-800 rounded-lg"
            >
              <div className="flex items-center">
                <Ticket size={16} className="mr-2 text-violet-400" />
                <span className="font-medium">{selectedOption.name}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 font-semibold">${selectedOption.price.toFixed(2)}</span>
                <ChevronDown size={18} className={`transition-transform ${showOptions ? 'rotate-180' : ''}`} />
              </div>
            </button>
            
            <AnimatePresence>
              {showOptions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-1 bg-gray-900 rounded-lg mt-2 divide-y divide-gray-800">
                    {event.ticketOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setTicketOption(option.id);
                          setShowOptions(false);
                        }}
                        className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                          ticketOption === option.id ? 'bg-violet-900/30' : 'hover:bg-gray-800'
                        }`}
                      >
                        <span className="font-medium">{option.name}</span>
                        <div>
                          {option.originalPrice > option.price && (
                            <span className="line-through text-gray-500 text-sm mr-2">${option.originalPrice.toFixed(2)}</span>
                          )}
                          <span className="font-semibold">${option.price.toFixed(2)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Quantity selector */}
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-400">Quantity</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-white"
                  disabled={ticketCount <= 1}
                >
                  -
                </button>
                <span className="w-6 text-center">{ticketCount}</span>
                <button
                  onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-white"
                  disabled={ticketCount >= 10}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          
          {/* Price details */}
          <div className="mb-4">
            <button
              onClick={() => setShowPriceDetails(!showPriceDetails)}
              className="flex items-center justify-between w-full text-sm text-gray-400 mb-2"
            >
              <span>Price details</span>
              <ChevronDown size={16} className={`transition-transform ${showPriceDetails ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {showPriceDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 text-sm px-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{selectedOption.name} × {ticketCount}</span>
                      <span>${basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Service fee</span>
                      <span>${serviceFee.toFixed(2)}</span>
                    </div>
                    {ticketCount >= 4 && (
                      <div className="flex justify-between text-green-400">
                        <span>Group discount (10%)</span>
                        <span>-${(basePrice * 0.1).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-800 pt-2 flex justify-between font-medium">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Buy button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="btn-primary py-3 flex items-center justify-center space-x-2"
          >
            <CreditCard size={18} />
            <span>Buy Tickets • ${totalPrice.toFixed(2)}</span>
          </motion.button>
        </div>
      </motion.div>
      
      <BottomNavigation />
    </div>
  );
}