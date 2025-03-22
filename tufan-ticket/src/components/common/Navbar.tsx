'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiSearch, FiUser, FiBell } from 'react-icons/fi';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/TTLogo.png"
            alt="TufanTicket"
            width={70}
            height={70}
            className="mr-2"
          />
          <span className="text-xl font-display font-bold text-primary-600 hidden sm:inline">
            TufanTicket
          </span>
        </Link>
        
        {isSearchOpen ? (
          <div className="flex-1 mx-4 relative">
            <input
              type="text"
              placeholder="Search events, artists, venues..."
              className="input-field"
              autoFocus
              onBlur={() => setIsSearchOpen(false)}
            />
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              onClick={() => setIsSearchOpen(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <nav className="hidden md:flex space-x-6">
            <Link href="/explore" className="nav-link">Explore</Link>
            <Link href="/trending" className="nav-link">Trending</Link>
            <Link href="/recommendations" className="nav-link">For You</Link>
            <Link href="/tickets" className="nav-link">My Tickets</Link>
          </nav>
        )}
        
        <div className="flex items-center space-x-3">
          {!isSearchOpen && (
            <button 
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => setIsSearchOpen(true)}
            >
              <FiSearch className="w-5 h-5 text-gray-700" />
            </button>
          )}
          <Link href="/notifications" className="p-2 rounded-full hover:bg-gray-100 hidden sm:block">
            <FiBell className="w-5 h-5 text-gray-700" />
          </Link>
          <Link href="/profile" className="p-2 rounded-full hover:bg-gray-100">
            <FiUser className="w-5 h-5 text-gray-700" />
          </Link>
        </div>
      </div>
    </header>
  );
}