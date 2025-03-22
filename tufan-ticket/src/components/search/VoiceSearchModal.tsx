// src/components/search/VoiceSearchModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, AudioWaveform } from 'lucide-react';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceSearchModal({ isOpen, onClose }: VoiceSearchModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [animationStep, setAnimationStep] = useState(0);

  // Simulate voice recognition
  useEffect(() => {
    if (isListening) {
      const timeout = setTimeout(() => {
        setTranscript('music events in chicago next weekend');
        setIsListening(false);
        setAnimationStep(2);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [isListening]);

  // Redirect after successful voice input
  useEffect(() => {
    if (animationStep === 2 && transcript) {
      const redirectTimeout = setTimeout(() => {
        // Simulate redirect/search
        setAnimationStep(3);
        setTimeout(onClose, 1000);
      }, 1500);
      
      return () => clearTimeout(redirectTimeout);
    }
  }, [animationStep, transcript, onClose]);

  const startListening = () => {
    setIsListening(true);
    setAnimationStep(1);
    // In a real implementation, you would use the Web Speech API here
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="frosted-glass-dark rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-2">
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold mb-2">Voice Search</h2>
              <p className="text-gray-400">
                {animationStep === 0 && "Tap the mic and say what you're looking for"}
                {animationStep === 1 && "Listening..."}
                {animationStep === 2 && "I heard:"}
                {animationStep === 3 && "Searching..."}
              </p>
            </div>
            
            <div className="flex flex-col items-center justify-center">
              {animationStep < 2 ? (
                <button
                  onClick={startListening}
                  disabled={isListening}
                  className={`relative w-24 h-24 rounded-full mb-6 ${
                    isListening ? 'bg-red-500' : 'bg-violet-600 hover:bg-violet-700'
                  } transition-colors`}
                >
                  <Mic className="absolute inset-0 m-auto" size={32} />
                  
                  {isListening && (
                    <motion.div
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 rounded-full border-4 border-red-500/40"
                    />
                  )}
                </button>
              ) : (
                <div className="mb-6 p-4 bg-gray-800/80 rounded-xl w-full">
                  <p className="text-lg font-medium">{transcript}</p>
                </div>
              )}
              
              {isListening && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex space-x-1 items-center justify-center"
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: [15, 30, 15],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                      className="w-1.5 bg-violet-500 rounded-full"
                    />
                  ))}
                </motion.div>
              )}
              
              {animationStep === 3 && (
                <div className="flex items-center justify-center mt-4">
                  <AudioWaveform className="text-violet-500 animate-pulse" />
                  <span className="ml-2">Searching for events...</span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}