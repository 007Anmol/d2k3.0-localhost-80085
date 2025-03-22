'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiSearch, FiUser } from 'react-icons/fi';
import { PiTicket } from 'react-icons/pi';

export default function BottomNavigation() {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <nav className="mobile-nav md:hidden">
      <Link 
        href="/" 
        className={`flex flex-col items-center ${isActive('/') ? 'text-primary-600' : 'text-gray-500'}`}
      >
        <FiHome className="w-6 h-6" />
        <span className="text-xs mt-1">Home</span>
      </Link>
      
      <Link 
        href="/explore" 
        className={`flex flex-col items-center ${isActive('/explore') ? 'text-primary-600' : 'text-gray-500'}`}
      >
        <FiSearch className="w-6 h-6" />
        <span className="text-xs mt-1">Explore</span>
      </Link>
      
      <Link 
        href="/tickets" 
        className={`flex flex-col items-center ${isActive('/tickets') ? 'text-primary-600' : 'text-gray-500'}`}
      >
        <PiTicket className="w-6 h-6" />
        <span className="text-xs mt-1">Tickets</span>
      </Link>
      
      <Link 
        href="/profile" 
        className={`flex flex-col items-center ${isActive('/profile') ? 'text-primary-600' : 'text-gray-500'}`}
      >
        <FiUser className="w-6 h-6" />
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </nav>
  );
}