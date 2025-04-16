import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Landing from './Landing';
import Interaction from './Interaction';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'interaction'>('landing');
  const [message, setMessage] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1B1B3A] to-[#0D0D1F] text-white overflow-hidden">
      <AnimatePresence mode="wait">
        {currentView === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Landing onEnter={() => setCurrentView('interaction')} />
          </motion.div>
        ) : (
          <motion.div
            key="interaction"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Interaction 
              message={message} 
              setMessage={setMessage}
              onBack={() => setCurrentView('landing')} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
