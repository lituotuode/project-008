import { useState, useCallback, useEffect } from 'react';

export interface GameRecord {
  attempts: number;
  elapsedTime: number;
  timestamp: number;
}

export interface GameStats {
  bestAttempts: number;
  bestTime: number;
  totalGames: number;
  recentRecords: GameRecord[];
}

const STORAGE_KEY = 'bulls_and_cows_stats';
const MAX_RECENT_RECORDS = 10;

const getDefaultStats = (): GameStats => ({
  bestAttempts: Infinity,
  bestTime: Infinity,
  totalGames: 0,
  recentRecords: [],
});

export const useLocalStorage = () => {
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : getDefaultStats();
    } catch {
      return getDefaultStats();
    }
  });

  const saveGameRecord = useCallback((attempts: number, elapsedTime: number) => {
    setStats(prev => {
      const newRecord: GameRecord = {
        attempts,
        elapsedTime,
        timestamp: Date.now(),
      };

      const newStats: GameStats = {
        bestAttempts: Math.min(prev.bestAttempts, attempts),
        bestTime: Math.min(prev.bestTime, elapsedTime),
        totalGames: prev.totalGames + 1,
        recentRecords: [newRecord, ...prev.recentRecords].slice(0, MAX_RECENT_RECORDS),
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
      } catch {
        console.error('Failed to save game record to localStorage');
      }

      return newStats;
    });
  }, []);

  const clearStats = useCallback(() => {
    const defaultStats = getDefaultStats();
    setStats(defaultStats);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      console.error('Failed to clear stats from localStorage');
    }
  }, []);

  return {
    stats,
    saveGameRecord,
    clearStats,
  };
};
