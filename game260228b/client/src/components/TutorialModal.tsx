import { useEffect } from 'react';

interface TutorialModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TutorialModal({ open, onClose }: TutorialModalProps) {
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
        className="relative card-glow max-w-md mx-4 p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-glow">
          游戏规则
        </h2>

        <div className="space-y-4">
          {/* 规则 1 */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg">🎯 游戏目标</h3>
            <p className="text-sm text-text-secondary">
              系统随机生成 4 个不重复的数字（0-9）。你需要通过逐次猜测，找出正确的数字和位置。
            </p>
          </div>

          {/* 规则 2 */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg">📊 反馈说明</h3>
            <div className="space-y-2 text-sm text-text-secondary">
              <div className="flex gap-2">
                <span className="font-bold text-neon-green min-w-fit">A (Bulls)</span>
                <span>数字正确且位置正确</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-neon-purple min-w-fit">B (Cows)</span>
                <span>数字正确但位置错误</span>
              </div>
            </div>
          </div>

          {/* 规则 3 */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg">📝 示例</h3>
            <div className="bg-card/50 rounded p-3 text-sm space-y-2">
              <p>
                <span className="font-mono font-bold text-glow">答案：1234</span>
              </p>
              <p>
                <span className="font-mono font-bold">你的猜测：1356</span>
              </p>
              <p className="text-text-secondary">
                结果：<span className="text-neon-green font-bold">1A</span>
                <span className="text-neon-purple font-bold">1B</span>
              </p>
              <p className="text-xs text-text-secondary">
                ✓ 1 在第 1 位正确（1A）<br />
                ✓ 3 在答案中但位置错误（1B）
              </p>
            </div>
          </div>

          {/* 规则 4 */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg">⚠️ 注意事项</h3>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>✓ 每次猜测必须是 4 位数字</li>
              <li>✓ 4 位数字不能有重复</li>
              <li>✓ 数字范围是 0-9</li>
              <li>✓ 猜中所有 4 个数字和位置即为胜利（4A）</li>
            </ul>
          </div>
        </div>

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="w-full btn-glow"
        >
          开始游戏
        </button>
      </div>
    </div>
  );
}
