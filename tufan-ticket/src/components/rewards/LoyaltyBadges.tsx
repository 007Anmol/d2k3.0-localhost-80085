// src/components/rewards/LoyaltyBadges.tsx
'use client';

import { motion } from 'framer-motion';
import { Trophy, Gift, Star, Ticket } from 'lucide-react';

export default function LoyaltyBadges() {
  const userPoints = 350;
  const nextRewardAt = 500;
  const progress = (userPoints / nextRewardAt) * 100;
  
  return (
    <motion.div 
      className="p-4 rounded-xl bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-gray-800"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-violet-600/20 mr-3">
            <Trophy size={18} className="text-violet-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Event Explorer</h3>
            <p className="text-xs text-gray-400">Level 3</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">{userPoints} pts</p>
          <p className="text-xs text-gray-400">{nextRewardAt - userPoints} until next reward</p>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
        <motion.div 
          className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
      
      {/* Badges */}
      <div className="flex justify-between">
        <motion.div 
          className="flex flex-col items-center"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="p-2 rounded-full bg-yellow-500/20 mb-1">
            <Star size={16} className="text-yellow-400" />
          </div>
          <span className="text-xs">5 Reviews</span>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="p-2 rounded-full bg-green-500/20 mb-1">
            <Ticket size={16} className="text-green-400" />
          </div>
          <span className="text-xs">3 Events</span>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
          animate={{ y: [0, -3, 0] }}
          transition={{ 
            repeat: Infinity, 
            repeatType: "reverse", 
            duration: 1.5,
            repeatDelay: 3
          }}
        >
          <div className="p-2 rounded-full bg-fuchsia-500/20 mb-1 relative">
            <Gift size={16} className="text-fuchsia-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-fuchsia-500 rounded-full animate-pulse"></span>
          </div>
          <span className="text-xs">1 Reward</span>
        </motion.div>
      </div>
    </motion.div>
  );
}