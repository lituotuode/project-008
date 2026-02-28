import { GameHistory as GameHistoryType } from '@/hooks/useGameLogic';

interface GameHistoryProps {
  history: GameHistoryType[];
}

export default function GameHistory({ history }: GameHistoryProps) {
  return (
    <div className="card-glow p-4 sm:p-6 md:p-8">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">猜测历史</h2>
      
      <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
        {[...history].reverse().map((record, index) => (
          <div
            key={history.length - index - 1}
            className="flex items-center justify-between p-2 sm:p-3 rounded border border-border hover:border-accent transition-colors text-sm sm:text-base"
          >
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm text-text-secondary w-6 sm:w-8">
                #{history.length - index}
              </span>
              <span className="font-mono text-base sm:text-lg font-bold text-glow">
                {record.guess}
              </span>
            </div>
            
            <div className="flex gap-2 sm:gap-4">
              <div className="text-center">
                <div className="text-xs text-text-secondary">A</div>
                <div className="text-sm sm:text-lg font-bold text-neon-green">
                  {record.result.bulls}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-text-secondary">B</div>
                <div className="text-sm sm:text-lg font-bold text-neon-purple">
                  {record.result.cows}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
