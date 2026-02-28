import { useState, useEffect } from 'react';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import GameBoard from '@/components/GameBoard';
import GameStats from '@/components/GameStats';
import GameHistory from '@/components/GameHistory';
import TutorialModal from '@/components/TutorialModal';
import ShareModal from '@/components/ShareModal';
import { toast } from 'sonner';

export default function Game() {
  const { gameState, makeGuess, resetGame, setCurrentGuess, getGameStats } = useGameLogic();
  const { stats, saveGameRecord } = useLocalStorage();
  const [showTutorial, setShowTutorial] = useState(() => {
    // 首次进入游戏时显示教程
    return !localStorage.getItem('bulls_and_cows_tutorial_shown');
  });
  const [showShareModal, setShowShareModal] = useState(false);
  const [gameStats, setGameStats] = useState({ elapsedTime: 0, attempts: 0, isWon: false });

  // 更新游戏统计
  useEffect(() => {
    const interval = setInterval(() => {
      setGameStats(getGameStats());
    }, 1000);

    return () => clearInterval(interval);
  }, [getGameStats]);

  // 处理游戏胜利
  useEffect(() => {
    if (gameState.isWon && gameState.history.length > 0) {
      const { elapsedTime, attempts } = getGameStats();
      saveGameRecord(attempts, elapsedTime);
      
      // 显示胜利提示
      setTimeout(() => {
        toast.success(`恭喜！你用 ${attempts} 步破解了密码！`, {
          duration: 3000,
        });
      }, 500);
    }
  }, [gameState.isWon, gameState.history.length, getGameStats, saveGameRecord]);

  const handleGuess = () => {
    if (gameState.currentGuess.length !== 4) {
      toast.error('请输入 4 位不重复的数字');
      return;
    }

    const result = makeGuess(gameState.currentGuess);
    if (result) {
      if (result.bulls === 4) {
        // 游戏胜利，稍后会自动处理
      } else {
        toast.info(`${result.bulls}A${result.cows}B`);
      }
    }
  };

  const handleTutorialClose = () => {
    setShowTutorial(false);
    localStorage.setItem('bulls_and_cows_tutorial_shown', 'true');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="container py-3 sm:py-4 flex items-center justify-between">
          <div>
            <h1 className="text-glow text-2xl sm:text-3xl md:text-4xl font-bold">
              GET OFFER 
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">offer崽的数字密码游戏</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTutorial(true)}
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm rounded border border-border hover:border-accent transition-colors"
            >
              帮助
            </button>
            <button
              onClick={resetGame}
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm rounded border border-border hover:border-accent transition-colors"
            >
              新游戏
            </button>
          </div>
        </div>
      </header>

      {/* 主游戏区域 */}
      <main className="flex-1 container py-4 sm:py-6 md:py-8 flex flex-col gap-4 sm:gap-6">
        {/* 游戏统计 */}
        <GameStats stats={gameStats} bestStats={stats} />

        {/* 游戏板 */}
        <GameBoard
          currentGuess={gameState.currentGuess}
          onGuessChange={setCurrentGuess}
          onSubmit={handleGuess}
          isWon={gameState.isWon}
          onShare={() => setShowShareModal(true)}
        />

        {/* 游戏历史 */}
        {gameState.history.length > 0 && (
          <GameHistory history={gameState.history} />
        )}
      </main>

      {/* 教程模态框 */}
      <TutorialModal open={showTutorial} onClose={handleTutorialClose} />

      {/* 分享模态框 */}
      {gameState.isWon && (
        <ShareModal
          open={showShareModal}
          onClose={() => setShowShareModal(false)}
          attempts={gameState.history.length}
          elapsedTime={gameStats.elapsedTime}
        />
      )}
    </div>
  );
}
