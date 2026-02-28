import { useState } from 'react';

interface GameBoardProps {
  currentGuess: string;
  onGuessChange: (guess: string) => void;
  onSubmit: () => void;
  isWon: boolean;
  onShare: () => void;
}

export default function GameBoard({
  currentGuess,
  onGuessChange,
  onSubmit,
  isWon,
  onShare,
}: GameBoardProps) {
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onGuessChange(value);
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (currentGuess.length !== 4) {
      setError('请输入 4 位数字');
      return;
    }

    const digits = new Set(currentGuess.split(''));
    if (digits.size !== 4) {
      setError('数字不能重复');
      return;
    }

    onSubmit();
  };

  const handleDigitClick = (digit: string) => {
    if (currentGuess.length < 4) {
      const newGuess = currentGuess + digit;
      const digits = new Set(newGuess.split(''));
      if (digits.size === newGuess.length) {
        onGuessChange(newGuess);
      }
    }
  };

  const handleBackspace = () => {
    onGuessChange(currentGuess.slice(0, -1));
  };

  return (
    <div className="card-glow p-6 md:p-8 space-y-6">
      {/* 数字显示区 */}
      <div className="flex justify-center gap-2 md:gap-4">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center rounded border-2 border-accent bg-card/50 transition-all duration-200"
            style={{
              boxShadow: currentGuess[index]
                ? '0 0 20px rgba(0, 212, 255, 0.5), inset 0 0 10px rgba(0, 212, 255, 0.1)'
                : 'none',
              transform: currentGuess[index] ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            <span className="text-2xl sm:text-3xl md:text-5xl font-bold font-mono text-glow">
              {currentGuess[index] || '-'}
            </span>
          </div>
        ))}
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="text-center text-destructive text-sm">
          {error}
        </div>
      )}

      {/* 数字键盘 */}
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 10 }, (_, i) => i.toString()).map((digit) => (
          <button
            key={digit}
            onClick={() => handleDigitClick(digit)}
            disabled={
              currentGuess.includes(digit) ||
              currentGuess.length >= 4 ||
              isWon
            }
            className="py-2 sm:py-3 text-sm sm:text-base rounded border border-border hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 font-mono font-bold"
            style={{
              color: currentGuess.includes(digit) ? '#666' : '#00d4ff',
              boxShadow: !currentGuess.includes(digit)
                ? '0 0 10px rgba(0, 212, 255, 0.2)'
                : 'none',
            }}
          >
            {digit}
          </button>
        ))}

        {/* 退格按钮 */}
        <button
          onClick={handleBackspace}
          disabled={currentGuess.length === 0 || isWon}
          className="col-span-5 py-2 sm:py-3 text-sm sm:text-base rounded border border-border hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          ← 删除
        </button>
      </div>

      {/* 提交按钮 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleSubmit}
          disabled={currentGuess.length !== 4 || isWon}
          className="flex-1 btn-glow disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base py-2 sm:py-3"
        >
          提交猜测
        </button>

        {isWon && (
          <button
            onClick={onShare}
            className="flex-1 btn-glow text-sm sm:text-base py-2 sm:py-3"
          >
            分享成绩
          </button>
        )}
      </div>

      {/* 游戏状态提示 */}
      {isWon && (
        <div className="text-center p-4 rounded border-2 border-neon-green bg-neon-green/10 animate-pulse">
          <p className="text-neon-green font-bold text-base sm:text-lg">
            🎉 恭喜！你破解了密码！
          </p>
        </div>
      )}
    </div>
  );
}
