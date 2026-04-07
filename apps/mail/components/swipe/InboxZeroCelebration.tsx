import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Check } from 'lucide-react';

interface InboxZeroCelebrationProps {
  visible: boolean;
  emailsProcessed: number;
  startTime: number;
  onDismiss: () => void;
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return remaining > 0 ? `${minutes}m ${remaining}s` : `${minutes}m`;
}

export function InboxZeroCelebration({
  visible,
  emailsProcessed,
  startTime,
  onDismiss,
}: InboxZeroCelebrationProps) {
  const hasFired = useRef(false);

  const fireConfetti = useCallback(() => {
    if (hasFired.current) return;
    hasFired.current = true;

    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    // Initial burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'],
    });

    requestAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (visible) {
      fireConfetti();
    } else {
      hasFired.current = false;
    }
  }, [visible, fireConfetti]);

  const elapsed = Date.now() - startTime;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="inbox-zero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
            className="flex flex-col items-center gap-6 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Checkmark circle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.4 }}
              className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30"
            >
              <motion.div
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Check className="h-12 w-12 text-white" strokeWidth={3} />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-3xl font-bold text-card-foreground"
            >
              Inbox Zero!
            </motion.h2>

            {/* Stats */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <p className="text-lg text-muted-foreground">
                You processed{' '}
                <span className="font-semibold text-card-foreground">{emailsProcessed}</span>{' '}
                emails in{' '}
                <span className="font-semibold text-card-foreground">
                  {formatDuration(elapsed)}
                </span>
              </p>
            </motion.div>

            {/* Dismiss hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-xs text-muted-foreground"
            >
              Tap anywhere to dismiss
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
