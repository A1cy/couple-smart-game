'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HomeScreen } from '../components/HomeScreen';
import { PlayerSetup } from '../components/PlayerSetup';
import { GameScreen } from '../components/GameScreen';
import { WinScreen } from '../components/WinScreen';
import { getRandomQuestion } from '../lib/questions';
import type { GameState } from '../lib/game-types';

const WIN_SCORE = 10;

function createInitialState(): GameState {
  return {
    screen: 'home',
    players: [
      { name: 'Player 1', score: 0 },
      { name: 'Player 2', score: 0 },
    ],
    currentPlayerIndex: 0,
    currentQuestion: null,
    round: 1,
    selectedAnswer: null,
    answerResult: null,
    usedQuestionIds: new Set(),
  };
}

export default function Home() {
  const [state, setState] = useState<GameState>(createInitialState);

  const goToSetup = useCallback(() => {
    setState(s => ({ ...s, screen: 'setup' }));
  }, []);

  const goHome = useCallback(() => {
    setState(s => ({ ...s, screen: 'home' }));
  }, []);

  const startGame = useCallback((p1Name: string, p2Name: string) => {
    const usedIds = new Set<number>();
    const firstQuestion = getRandomQuestion(usedIds);
    if (!firstQuestion) return;
    usedIds.add(firstQuestion.id);

    setState(s => ({
      ...s,
      screen: 'game',
      players: [
        { name: p1Name, score: 0 },
        { name: p2Name, score: 0 },
      ],
      currentPlayerIndex: 0,
      currentQuestion: firstQuestion,
      round: 1,
      selectedAnswer: null,
      answerResult: null,
      usedQuestionIds: usedIds,
    }));
  }, []);

  const handleAnswer = useCallback((index: number) => {
    setState(s => {
      if (s.selectedAnswer !== null || !s.currentQuestion) return s;

      const isCorrect = index === s.currentQuestion.correct;
      const newScore = isCorrect
        ? s.players[s.currentPlayerIndex].score + 1
        : s.players[s.currentPlayerIndex].score;

      const updatedPlayers: [{ name: string; score: number }, { name: string; score: number }] = [
        { ...s.players[0] },
        { ...s.players[1] },
      ];
      updatedPlayers[s.currentPlayerIndex] = {
        ...updatedPlayers[s.currentPlayerIndex],
        score: newScore,
      };

      return {
        ...s,
        players: updatedPlayers,
        selectedAnswer: index,
        answerResult: isCorrect ? 'correct' : 'wrong',
      };
    });
  }, []);

  const handleNext = useCallback(() => {
    setState(s => {
      // Check if someone has won
      const currentScore = s.players[s.currentPlayerIndex].score;
      if (currentScore >= WIN_SCORE) {
        return { ...s, screen: 'win' };
      }

      const nextPlayerIndex = s.currentPlayerIndex === 0 ? 1 : 0;
      const newRound = nextPlayerIndex === 0 ? s.round + 1 : s.round;

      // Get next question, reset pool if exhausted
      let usedIds = new Set(s.usedQuestionIds);
      let nextQuestion = getRandomQuestion(usedIds);
      if (!nextQuestion) {
        usedIds = new Set<number>();
        nextQuestion = getRandomQuestion(usedIds);
      }
      if (!nextQuestion) return s;
      usedIds.add(nextQuestion.id);

      return {
        ...s,
        currentPlayerIndex: nextPlayerIndex as 0 | 1,
        currentQuestion: nextQuestion,
        round: newRound,
        selectedAnswer: null,
        answerResult: null,
        usedQuestionIds: usedIds,
      };
    });
  }, []);

  const playAgain = useCallback(() => {
    setState(createInitialState());
  }, []);

  const winner = state.screen === 'win'
    ? state.players.reduce((a, b) => (a.score > b.score ? a : b))
    : null;

  return (
    <main className="min-h-screen bg-[#0d0d1a] text-white relative overflow-hidden">
      <AnimatePresence mode="wait">
        {state.screen === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <HomeScreen onStart={goToSetup} />
          </motion.div>
        )}

        {state.screen === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
          >
            <PlayerSetup onStart={startGame} onBack={goHome} />
          </motion.div>
        )}

        {state.screen === 'game' && (
          <motion.div
            key="game"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
          >
            <GameScreen state={state} onAnswer={handleAnswer} onNext={handleNext} />
          </motion.div>
        )}

        {state.screen === 'win' && winner && (
          <motion.div
            key="win"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <WinScreen winner={winner} players={state.players} onPlayAgain={playAgain} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
