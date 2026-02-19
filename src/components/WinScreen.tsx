'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { Player } from '../lib/game-types';

interface WinScreenProps {
  winner: Player;
  players: [Player, Player];
  onPlayAgain: () => void;
}

export function WinScreen({ winner, players, onPlayAgain }: WinScreenProps) {
  useEffect(() => {
    // Launch confetti burst
    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        origin: { y: 0.6 },
        ...opts,
        particleCount: Math.floor(200 * particleRatio),
      });
    };

    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#a855f7', '#ec4899'] });
    fire(0.2, { spread: 60, colors: ['#7c3aed', '#db2777'] });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#c084fc', '#f9a8d4'] });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#ffffff'] });
    fire(0.1, { spread: 120, startVelocity: 45, colors: ['#a855f7', '#ec4899'] });

    // Second burst after short delay
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#a855f7', '#ec4899', '#c084fc'],
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#a855f7', '#ec4899', '#c084fc'],
      });
    }, 500);
  }, []);

  const loser = players.find(p => p.name !== winner.name)!;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      {/* Background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
        className="relative z-10 max-w-md w-full"
      >
        {/* Trophy */}
        <motion.div
          animate={{ rotate: [-5, 5, -5], y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-8xl mb-4"
        >
          🏆
        </motion.div>

        {/* Winner label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-2"
        >
          Winner!
        </motion.p>

        {/* Winner name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 bg-clip-text text-transparent mb-2"
        >
          {winner.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/60 text-base mb-8"
        >
          wins CoupleQuest! 🎉
        </motion.p>

        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 border border-white/20 rounded-3xl p-6 mb-8"
        >
          <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">Final Scores</p>
          <div className="space-y-3">
            {[winner, loser].map((player, i) => (
              <div key={player.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{i === 0 ? '🥇' : '🥈'}</span>
                  <span className="text-white font-semibold">{player.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 rounded-full bg-white/10 w-24 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(player.score / 10) * 100}%` }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
                      className={`h-full rounded-full ${i === 0 ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-white/30'}`}
                    />
                  </div>
                  <span className={`text-xl font-black ${i === 0 ? 'text-purple-300' : 'text-white/50'}`}>
                    {player.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Play again button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlayAgain}
          className="w-full py-5 rounded-2xl text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-900/50 transition-all"
        >
          Play Again 🔄
        </motion.button>
      </motion.div>
    </div>
  );
}
