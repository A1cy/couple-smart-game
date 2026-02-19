'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface PlayerSetupProps {
  onStart: (player1: string, player2: string) => void;
  onBack: () => void;
}

export function PlayerSetup({ onStart, onBack }: PlayerSetupProps) {
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');

  const handleStart = () => {
    onStart(p1.trim() || 'Player 1', p2.trim() || 'Player 2');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <button
          onClick={onBack}
          className="text-white/50 hover:text-white/80 transition-colors mb-8 flex items-center gap-2 text-sm"
        >
          ← Back
        </button>

        <h2 className="text-3xl font-black text-white mb-2">Who&apos;s playing?</h2>
        <p className="text-white/50 text-sm mb-8">Enter your names to personalize the game</p>

        <div className="space-y-4 mb-8">
          {/* Player 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-semibold text-purple-300 mb-2">
              💜 Player 1
            </label>
            <input
              type="text"
              value={p1}
              onChange={(e) => setP1(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              placeholder="Player 1"
              maxLength={20}
              className="w-full py-4 px-5 rounded-2xl bg-white/10 border-2 border-purple-500/40 text-white placeholder-white/30 text-lg font-medium focus:outline-none focus:border-purple-400 transition-colors"
            />
          </motion.div>

          {/* VS divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/40 font-bold text-sm">VS</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Player 2 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-semibold text-pink-300 mb-2">
              🩷 Player 2
            </label>
            <input
              type="text"
              value={p2}
              onChange={(e) => setP2(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              placeholder="Player 2"
              maxLength={20}
              className="w-full py-4 px-5 rounded-2xl bg-white/10 border-2 border-pink-500/40 text-white placeholder-white/30 text-lg font-medium focus:outline-none focus:border-pink-400 transition-colors"
            />
          </motion.div>
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleStart}
          className="w-full py-5 rounded-2xl text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-900/50 transition-all"
        >
          Let&apos;s Play! 🎮
        </motion.button>
      </motion.div>
    </div>
  );
}
