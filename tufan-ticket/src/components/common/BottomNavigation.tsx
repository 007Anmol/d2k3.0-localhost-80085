// src/components/common/BottomNavigation.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Compass, Ticket, Calendar, Trophy } from 'lucide-react';

export default function BottomNavigation() {
  const pathname = usePathname();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/explore', label: 'Explore', icon: Compass },
    { path: '/tickets', label: 'My Tickets', icon: Ticket },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/rewards', label: 'Rewards', icon: Trophy },
  ];

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 20 }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 frosted-glass-dark pb-safe"
    >
      <nav className="flex justify-around py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className="flex flex-col items-center"
            >
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-full bg-violet-600"
                    style={{ padding: '100%', transform: 'translate(-25%, -25%)' }}
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
                <Icon
                  size={24}
                  className={`relative z-10 ${isActive ? 'text-white' : 'text-gray-400'}`}
                />
                
                {item.path === '/rewards' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </div>
              <span className={`text-xs mt-1 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </motion.div>
  );
}