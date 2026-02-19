'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AnswerButton } from './AnswerButton';
import type { GameState } from '../lib/game-types';

interface GameScreenProps {
  state: GameState;
  onAnswer: (index: number) => void;
  onNext: () => void;
}

const categoryLabel: Record<string, string> = {
  couples: '💑 Couples',
  knowledge: '🧠 Knowledge',
  quirky: '🎭 Quirky',
};

const WIN_SCORE = 10;

export function GameScreen({ state, onAnswer, onNext }: GameScreenProps) {
  const { players, currentPlayerIndex, currentQuestion, round, selectedAnswer, answerResult } = state;
  const currentPlayer = players[currentPlayerIndex];
  const otherPlayer = players[currentPlayerIndex === 0 ? 1 : 0];
  const isP1Turn = currentPlayerIndex === 0;

  if (!currentQuestion) return null;

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 max-w-lg mx-auto">
      {/* Score Header */}
      <div className="flex items-center justify-between mb-6 gap-3">
        {/* Player 1 Score */}
        <motion.div
          animate={isP1Turn ? { scale: 1.05 } : { scale: 1 }}
          className={`
            flex-1 py-3 px-4 rounded-2xl flex flex-col items-center transition-all duration-300
            ${isP1Turn
              ? 'bg-purple-600/30 border-2 border-purple-400 shadow-lg shadow-purple-500/30'
              : 'bg-white/5 border-2 border-white/10'
            }
          `}
        >
          {isP1Turn && (
            <span className="text-purple-300 text-xs font-bold mb-1 animate-pulse">● YOUR TURN</span>
          )}
          <span className="text-white/70 text-xs font-medium truncate max-w-full">{players[0].name}</span>
          <span className="text-white text-2xl font-black">{players[0].score}</span>
          <span className="text-white/40 text-xs">/ {WIN_SCORE}</span>
        </motion.div>

        {/* Round counter */}
        <div className="flex flex-col items-center shrink-0">
          <span className="text-white/30 text-xs">Round</span>
          <span className="text-white font-bold text-lg">{round}</span>
        </div>

        {/* Player 2 Score */}
        <motion.div
          animate={!isP1Turn ? { scale: 1.05 } : { scale: 1 }}
          className={`
            flex-1 py-3 px-4 rounded-2xl flex flex-col items-center transition-all duration-300
            ${!isP1Turn
              ? 'bg-pink-600/30 border-2 border-pink-400 shadow-lg shadow-pink-500/30'
              : 'bg-white/5 border-2 border-white/10'
            }
          `}
        >
          {!isP1Turn && (
            <span className="text-pink-300 text-xs font-bold mb-1 animate-pulse">● YOUR TURN</span>
          )}
          <span className="text-white/70 text-xs font-medium truncate max-w-full">{players[1].name}</span>
          <span className="text-white text-2xl font-black">{players[1].score}</span>
          <span className="text-white/40 text-xs">/ {WIN_SCORE}</span>
        </motion.div>
      </div>

      {/* Current player banner */}
      <motion.div
        key={`player-${currentPlayerIndex}-${round}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          text-center py-2 px-4 rounded-xl mb-4 text-sm font-semibold
          ${isP1Turn ? 'bg-purple-500/20 text-purple-300' : 'bg-pink-500/20 text-pink-300'}
        `}
      >
        {currentPlayer.name}&apos;s turn to answer
      </motion.div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          {/* Category badge */}
          <div className="mb-3">
            <span className="text-xs font-semibold text-white/50 bg-white/10 px-3 py-1 rounded-full">
              {categoryLabel[currentQuestion.category]}
            </span>
          </div>

          {/* Question */}
          <div className="bg-white/10 border border-white/15 rounded-3xl p-5 mb-4">
            <p className="text-white font-semibold text-lg leading-snug">
              {currentQuestion.question}
            </p>
          </div>

          {/* Answer options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, i) => (
              <AnswerButton
                key={i}
                label={option}
                index={i}
                selectedAnswer={selectedAnswer}
                correctIndex={currentQuestion.correct}
                answerResult={answerResult}
                onClick={onAnswer}
              />
            ))}
          </div>

          {/* Feedback + Next button */}
          <AnimatePresence>
            {answerResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {/* Result message */}
                <div className={`
                  text-center py-3 px-4 rounded-2xl mb-4 font-bold text-lg
                  ${answerResult === 'correct'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-red-500/20 text-red-300'
                  }
                `}>
                  {answerResult === 'correct'
                    ? `✅ Correct! +1 point for ${currentPlayer.name}`
                    : `❌ Wrong! Correct: ${currentQuestion.options[currentQuestion.correct]}`
                  }
                </div>

                {/* Next button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onNext}
                  className={`
                    w-full py-4 rounded-2xl text-lg font-bold text-white transition-all shadow-lg
                    ${isP1Turn
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-purple-900/40'
                      : 'bg-gradient-to-r from-pink-600 to-purple-600 shadow-pink-900/40'
                    }
                  `}
                >
                  {otherPlayer.name}&apos;s Turn →
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
