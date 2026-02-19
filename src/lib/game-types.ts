export type GameScreen = 'home' | 'setup' | 'game' | 'win';

export type QuestionCategory = 'couples' | 'knowledge' | 'quirky';

export interface Question {
  id: number;
  category: QuestionCategory;
  question: string;
  options: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
}

export interface Player {
  name: string;
  score: number;
}

export interface GameState {
  screen: GameScreen;
  players: [Player, Player];
  currentPlayerIndex: 0 | 1;
  currentQuestion: Question | null;
  round: number;
  selectedAnswer: number | null;
  answerResult: 'correct' | 'wrong' | null;
  usedQuestionIds: Set<number>;
}
