import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  attempts: number;
  elapsedTime: number;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}分${secs}秒`;
};

export default function ShareModal({
  open,
  onClose,
  attempts,
  elapsedTime,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const generateShareText = (): string => {
    const gameUrl = window.location.origin;
    return `我在offer崽的数字密码游戏，仅用了 ${attempts} 步、${formatTime(elapsedTime)}就破解了密码！你能超越我吗？\n\n${gameUrl}`;
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setCopied(true);
      toast.success('分享链接已复制到剪贴板！');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('复制失败，请手动复制');
    }
  };

  const handleShare = async () => {
    const shareText = generateShareText();
    
    if (navigator.share && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'Bulls & Cows',
          text: shareText,
          url: window.location.origin,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          toast.error('分享失败');
        }
      }
    } else {
      handleCopyToClipboard();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* 模态框内容 */}
      <div
        className="relative card-glow max-w-md mx-4 p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-glow">
            🎉 恭喜！
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">你已成功破解密码</p>
        </div>

        {/* 成绩显示 */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-card/50 rounded p-3 sm:p-4 text-center">
            <div className="text-xs text-text-secondary uppercase tracking-wider mb-2">
              用时
            </div>
            <div className="text-lg sm:text-2xl font-bold font-mono text-glow">
              {formatTime(elapsedTime)}
            </div>
          </div>
          <div className="bg-card/50 rounded p-3 sm:p-4 text-center">
            <div className="text-xs text-text-secondary uppercase tracking-wider mb-2">
              步数
            </div>
            <div className="text-lg sm:text-2xl font-bold font-mono text-glow">
              {attempts}
            </div>
          </div>
        </div>

        {/* 分享文本预覽 */}
        <div className="bg-card/50 rounded p-3 sm:p-4 space-y-2">
          <p className="text-xs text-text-secondary uppercase tracking-wider">
            分享内容
          </p>
          <p className="text-xs sm:text-sm text-foreground whitespace-pre-wrap break-words">
            {generateShareText()}
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleShare}
            className="flex-1 btn-glow text-xs sm:text-sm py-2 sm:py-3"
          >
            {navigator.share && typeof navigator.share === 'function' ? '分享' : '复制分享链接'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 sm:px-6 py-2 sm:py-3 font-mono font-bold text-xs sm:text-sm uppercase tracking-wider rounded border border-border hover:border-accent transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
