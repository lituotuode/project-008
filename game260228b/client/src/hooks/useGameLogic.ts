import { useState, useCallback, useEffect } from 'react';

export interface GameResult {
  bulls: number;
  cows: number;
}

export interface GameHistory {
  guess: string;
  result: GameResult;
  timestamp: number;
}

export interface GameState {
  answer: string;
  history: GameHistory[];
  isWon: boolean;
  startTime: number;
  currentGuess: string;
}

const generateAnswer = (): string => {
  const digits = Array.from({ length: 10 }, (_, i) => i.toString());
  const answer: string[] = [];
  
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    answer.push(digits[randomIndex]);
    digits.splice(randomIndex, 1);
  }
  
  return answer.join('');
};

const calculateResult = (guess: string, answer: string): GameResult => {
  let bulls = 0;
  let cows = 0;
  
  const answerDigits = answer.split('');
  const guessDigits = guess.split('');
  const usedAnswerIndices = new Set<number>();
  const usedGuessIndices = new Set<number>();
  
  // 计算 Bulls（位置和数字都正确）
  for (let i = 0; i < 4; i++) {
    if (guessDigits[i] === answerDigits[i]) {
      bulls++;
      usedAnswerIndices.add(i);
      usedGuessIndices.add(i);
    }
  }
  
  // 计算 Cows（数字正确但位置错误）
  for (let i = 0; i < 4; i++) {
    if (usedGuessIndices.has(i)) continue;
    
    for (let j = 0; j < 4; j++) {
      if (usedAnswerIndices.has(j)) continue;
      
      if (guessDigits[i] === answerDigits[j]) {
        cows++;
        usedAnswerIndices.add(j);
        break;
      }
    }
  }
  
  return { bulls, cows };
};

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const answer = generateAnswer();
    return {
      answer,
      history: [],
      isWon: false,
      startTime: Date.now(),
      currentGuess: '',
    };
  });

  const makeGuess = useCallback((guess: string): GameResult | null => {
    if (gameState.isWon) return null;
    if (guess.length !== 4) return null;
    
    // 检查是否有重复数字
    const digits = new Set(guess.split(''));
    if (digits.size !== 4) return null;
    
    const result = calculateResult(guess, gameState.answer);
    
    setGameState(prev => {
      const newHistory = [...prev.history, { guess, result, timestamp: Date.now() }];
      const isWon = result.bulls === 4;
      
      return {
        ...prev,
        history: newHistory,
        isWon,
        currentGuess: '',
      };
    });
    
    return result;
  }, [gameState.isWon, gameState.answer]);

  const resetGame = useCallback(() => {
    const answer = generateAnswer();
    setGameState({
      answer,
      history: [],
      isWon: false,
      startTime: Date.now(),
      currentGuess: '',
    });
  }, []);

  const setCurrentGuess = useCallback((guess: string) => {
    // 只允许输入 0-9 的数字，最多 4 位
    const filtered = guess.replace(/[^0-9]/g, '').slice(0, 4);
    
    // 检查是否有重复数字
    const digits = new Set(filtered.split(''));
    if (digits.size === filtered.length) {
      setGameState(prev => ({ ...prev, currentGuess: filtered }));
    } else if (filtered.length < gameState.currentGuess.length) {
      // 允许删除
      setGameState(prev => ({ ...prev, currentGuess: filtered }));
    }
  }, [gameState.currentGuess.length]);

  const getGameStats = useCallback(() => {
    const elapsedTime = Math.floor((Date.now() - gameState.startTime) / 1000);
    const attempts = gameState.history.length;
    
    return {
      elapsedTime,
      attempts,
      isWon: gameState.isWon,
    };
  }, [gameState.startTime, gameState.history.length, gameState.isWon]);

  return {
    gameState,
    makeGuess,
    resetGame,
    setCurrentGuess,
    getGameStats,
  };
};
