'use client';

import { motion } from 'framer-motion';

interface AnswerButtonProps {
  label: string;
  index: number;
  selectedAnswer: number | null;
  correctIndex: number;
  answerResult: 'correct' | 'wrong' | null;
  onClick: (index: number) => void;
}

export function AnswerButton({
  label,
  index,
  selectedAnswer,
  correctIndex,
  answerResult,
  onClick,
}: AnswerButtonProps) {
  const isSelected = selectedAnswer === index;
  const isCorrect = index === correctIndex;
  const hasAnswered = answerResult !== null;

  let bgClass = 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-purple-400';
  let textClass = 'text-white';

  if (hasAnswered) {
    if (isCorrect) {
      bgClass = 'bg-emerald-500/30 border-emerald-400';
      textClass = 'text-emerald-200';
    } else if (isSelected && !isCorrect) {
      bgClass = 'bg-red-500/30 border-red-400';
      textClass = 'text-red-200';
    } else {
      bgClass = 'bg-white/5 border-white/10 opacity-40';
    }
  }

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <motion.button
      whileHover={!hasAnswered ? { scale: 1.02 } : {}}
      whileTap={!hasAnswered ? { scale: 0.98 } : {}}
      onClick={() => !hasAnswered && onClick(index)}
      disabled={hasAnswered}
      className={`
        w-full p-4 rounded-2xl border-2 text-left transition-all duration-300
        flex items-center gap-3 cursor-pointer disabled:cursor-default
        ${bgClass}
      `}
    >
      <span className={`
        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
        ${hasAnswered && isCorrect ? 'bg-emerald-500 text-white' : ''}
        ${hasAnswered && isSelected && !isCorrect ? 'bg-red-500 text-white' : ''}
        ${!hasAnswered ? 'bg-purple-500/40 text-purple-200' : ''}
        ${hasAnswered && !isCorrect && !isSelected ? 'bg-white/10 text-white/40' : ''}
      `}>
        {letters[index]}
      </span>
      <span className={`text-sm sm:text-base font-medium ${textClass}`}>{label}</span>
    </motion.button>
  );
}
