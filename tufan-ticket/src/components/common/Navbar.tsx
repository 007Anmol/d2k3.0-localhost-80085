// src/components/common/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Bell, Mic } from 'lucide-react';
import VoiceSearchModal from '@/components/search/VoiceSearchModal';

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleSearch = () => {
    setShowSearchBar(!showSearchBar);
    if (!showSearchBar) {
      setTimeout(() => document.getElementById('search-input')?.focus(), 100);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchInput);
    setShowSearchBar(false);
    setSearchInput('');
  };

  const openVoiceSearch = () => {
    setIsVoiceSearchOpen(true);
  };

  return (
    <>
      <motion.header
        initial={{ y: 0, opacity: 1 }}
        animate={{ 
          y: isVisible ? 0 : -100, 
          opacity: isVisible ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className={`floating-nav max-w-lg mx-auto ${!isVisible ? 'pointer-events-none' : ''}`}
      >
        <nav className="flex items-center justify-between w-full p-1">
          <Link 
            href="/"
            className={`px-4 py-2 rounded-full ${pathname === '/' ? 'bg-violet-600' : 'hover:bg-gray-800'} transition-colors duration-300`}
          >
            <span className="text-lg font-medium">Home</span>
          </Link>
          
          <div className="flex space-x-1">
            <button
              onClick={toggleSearch}
              className="p-3 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            
            <button
              onClick={openVoiceSearch}
              className="p-3 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Voice Search"
            >
              <Mic size={20} />
            </button>
            
            <Link
              href="/notifications"
              className="p-3 rounded-full hover:bg-gray-800 transition-colors relative"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>
            
            <Link
              href="/profile"
              className="p-3 rounded-full hover:bg-gray-800 transition-colors"
            >
              <User size={20} />
            </Link>
          </div>
        </nav>
      </motion.header>
      
      <AnimatePresence>
        {showSearchBar && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 z-50 p-4 bg-gray-900/95 backdrop-blur-md"
          >
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                id="search-input"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search events, artists, venues..."
                className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button
                type="submit"
                className="p-3 bg-violet-600 rounded-r-lg"
              >
                <Search size={20} />
              </button>
              <button
                type="button"
                onClick={toggleSearch}
                className="ml-2 p-3 bg-gray-800 rounded-lg"
              >
                Cancel
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <VoiceSearchModal
        isOpen={isVoiceSearchOpen}
        onClose={() => setIsVoiceSearchOpen(false)}
      />
    </>
  );
}