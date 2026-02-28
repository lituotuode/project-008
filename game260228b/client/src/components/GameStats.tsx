import { GameStats as GameStatsType } from '@/hooks/useLocalStorage';

interface GameStatsProps {
  stats: {
    elapsedTime: number;
    attempts: number;
    isWon: boolean;
  };
  bestStats: GameStatsType;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function GameStats({ stats, bestStats }: GameStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
      {/* 当前用时 */}
      <div className="card-glow p-3 sm:p-4 text-center">
        <div className="text-xs text-text-secondary uppercase tracking-wider mb-2">
          当前用时
        </div>
        <div className="text-xl sm:text-2xl md:text-3xl font-bold font-mono text-glow">
          {formatTime(stats.elapsedTime)}
        </div>
      </div>

      {/* 当前步数 */}
      <div className="card-glow p-3 sm:p-4 text-center">
        <div className="text-xs text-text-secondary uppercase tracking-wider mb-2">
          当前步数
        </div>
        <div className="text-xl sm:text-2xl md:text-3xl font-bold font-mono text-glow">
          {stats.attempts}
        </div>
      </div>

      {/* 最佳步数 */}
      <div className="card-glow p-3 sm:p-4 text-center">
        <div className="text-xs text-text-secondary uppercase tracking-wider mb-2">
          最佳步数
        </div>
        <div className="text-xl sm:text-2xl md:text-3xl font-bold font-mono">
          {bestStats.bestAttempts === Infinity ? '-' : bestStats.bestAttempts}
        </div>
      </div>

      {/* 总游戏数 */}
      <div className="card-glow p-3 sm:p-4 text-center">
        <div className="text-xs text-text-secondary uppercase tracking-wider mb-2">
          总游戏数
        </div>
        <div className="text-xl sm:text-2xl md:text-3xl font-bold font-mono">
          {bestStats.totalGames}
        </div>
      </div>
    </div>
  );
}
