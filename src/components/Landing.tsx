import React from 'react';
import { motion } from 'framer-motion';

interface LandingProps {
  onEnter: () => void;
}

function Landing({ onEnter }: LandingProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full">
        <h1 className="text-5xl font-light mb-6 text-center">
          ECO
        </h1>
        <p className="text-lg text-gray-300 mb-12 text-center">
          Uma inteligência artificial que espelha suas emoções, 
          pensamentos e comportamentos — sem julgamentos.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onEnter}
          className="w-full bg-white/10 backdrop-blur-lg text-white px-8 py-4 rounded-2xl 
                     text-lg font-medium hover:bg-white/20 transition-all"
        >
          Começar
        </motion.button>
      </div>
    </div>
  );
}

export default Landing;