import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
} from 'framer-motion';
import { useCallback, useRef } from 'react';
import { EmailCard } from './EmailCard';
import type { MockEmail } from './mock-data';
import { Check, X, Star } from 'lucide-react';

export type SwipeAction = 'archive' | 'delete' | 'star';

interface SwipeCardStackProps {
  emails: MockEmail[];
  onSwipe: (email: MockEmail, action: SwipeAction) => void;
  onTap?: (email: MockEmail) => void;
  onLongPress?: (email: MockEmail) => void;
}

const SWIPE_THRESHOLD = 0.3; // 30% of card width
const EXIT_DISTANCE = 1.5; // multiplier for exit animation
const ROTATION_FACTOR = 15; // degrees of rotation at full drag

export function SwipeCardStack({
  emails,
  onSwipe,
  onTap,
  onLongPress,
}: SwipeCardStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const isDragging = useRef(false);
  const isAnimating = useRef(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const cardWidth = containerRef.current?.offsetWidth ?? 360;
  const thresholdPx = cardWidth * SWIPE_THRESHOLD;

  // Progressive tint overlays based on drag distance
  const archiveOpacity = useTransform(x, [0, thresholdPx], [0, 0.3]);
  const deleteOpacity = useTransform(x, [-thresholdPx, 0], [0.3, 0]);
  const starOpacity = useTransform(y, [-thresholdPx, 0], [0.3, 0]);

  // Card rotation proportional to horizontal drag
  const rotate = useTransform(
    x,
    [-cardWidth, 0, cardWidth],
    [-ROTATION_FACTOR, 0, ROTATION_FACTOR],
  );

  // Next card peek: scale up and fade in as current card is dragged
  const dragDistance = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => Math.sqrt(latestX * latestX + latestY * latestY),
  );
  const nextScale = useTransform(dragDistance, [0, thresholdPx], [0.95, 1]);
  const nextOpacity = useTransform(dragDistance, [0, thresholdPx], [0.8, 1]);

  // Third card peek
  const thirdScale = useTransform(dragDistance, [0, thresholdPx], [0.9, 0.95]);
  const thirdOpacity = useTransform(dragDistance, [0, thresholdPx], [0.6, 0.8]);

  // Always show emails[0] as current — parent manages the queue
  const currentEmail = emails[0];
  const nextEmail = emails[1];
  const thirdEmail = emails[2];

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      // Keep isDragging true briefly so onTap doesn't fire after drag
      setTimeout(() => { isDragging.current = false; }, 50);
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
      if (isAnimating.current || !currentEmail) return;

      const xVal = info.offset.x;
      const yVal = info.offset.y;
      const xVel = Math.abs(info.velocity.x);
      const yVel = Math.abs(info.velocity.y);

      // Determine swipe direction — check up first (y negative), then horizontal
      let action: SwipeAction | null = null;
      let exitX = 0;
      let exitY = 0;

      if (yVal < -thresholdPx || (yVel > 500 && yVal < -50)) {
        action = 'star';
        exitX = xVal * 0.5;
        exitY = -cardWidth * EXIT_DISTANCE;
      } else if (xVal > thresholdPx || (xVel > 500 && xVal > 50)) {
        action = 'archive';
        exitX = cardWidth * EXIT_DISTANCE;
        exitY = yVal * 0.3;
      } else if (xVal < -thresholdPx || (xVel > 500 && xVal < -50)) {
        action = 'delete';
        exitX = -cardWidth * EXIT_DISTANCE;
        exitY = yVal * 0.3;
      }

      if (action) {
        isAnimating.current = true;

        // Notify parent immediately (removes email from queue)
        onSwipe(currentEmail, action);

        // Animate exit then reset
        animate(x, exitX, {
          type: 'spring',
          damping: 20,
          stiffness: 300,
          onComplete: () => {
            x.set(0);
            y.set(0);
            isAnimating.current = false;
          },
        });
        animate(y, exitY, { type: 'spring', damping: 20, stiffness: 300 });
      } else {
        // Snap back
        animate(x, 0, { type: 'spring', damping: 20, stiffness: 300 });
        animate(y, 0, { type: 'spring', damping: 20, stiffness: 300 });
      }
    },
    [currentEmail, cardWidth, thresholdPx, x, y, onSwipe],
  );

  const handleDragStart = useCallback(() => {
    isDragging.current = true;
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  }, []);

  const handlePointerDown = useCallback(() => {
    if (!currentEmail) return;
    longPressTimer.current = setTimeout(() => {
      if (!isDragging.current) {
        onLongPress?.(currentEmail);
      }
    }, 500);
  }, [currentEmail, onLongPress]);

  const handlePointerUp = useCallback(() => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  }, []);

  const handleTap = useCallback(() => {
    if (isDragging.current || !currentEmail) return;
    onTap?.(currentEmail);
  }, [currentEmail, onTap]);

  if (!currentEmail) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative h-[480px] w-full max-w-[380px]">
      {/* Third card (behind) */}
      {thirdEmail && (
        <motion.div
          className="absolute inset-0"
          style={{ scale: thirdScale, opacity: thirdOpacity }}
        >
          <div className="h-full w-full rounded-2xl border border-border bg-card shadow-md" />
        </motion.div>
      )}

      {/* Next card (peek) */}
      {nextEmail && (
        <motion.div
          className="absolute inset-0"
          style={{ scale: nextScale, opacity: nextOpacity }}
        >
          <EmailCard email={nextEmail} />
        </motion.div>
      )}

      {/* Current card (draggable) */}
      <motion.div
        key={currentEmail.id}
        className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
        style={{ x, y, rotate, zIndex: 10 }}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onTap={handleTap}
      >
        <EmailCard email={currentEmail} />

        {/* Archive overlay (right swipe — green) */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-emerald-500"
          style={{ opacity: archiveOpacity }}
        >
          <div className="rounded-full bg-white/30 p-4">
            <Check className="h-12 w-12 text-white" strokeWidth={3} />
          </div>
        </motion.div>

        {/* Delete overlay (left swipe — red) */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-red-500"
          style={{ opacity: deleteOpacity }}
        >
          <div className="rounded-full bg-white/30 p-4">
            <X className="h-12 w-12 text-white" strokeWidth={3} />
          </div>
        </motion.div>

        {/* Star overlay (up swipe — gold) */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-amber-400"
          style={{ opacity: starOpacity }}
        >
          <div className="rounded-full bg-white/30 p-4">
            <Star className="h-12 w-12 fill-white text-white" strokeWidth={3} />
          </div>
        </motion.div>
      </motion.div>

      {/* Swipe hints */}
      <div className="absolute -bottom-12 left-0 right-0 flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <X className="h-3.5 w-3.5 text-red-400" /> Delete
        </span>
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 text-amber-400" /> Star
        </span>
        <span className="flex items-center gap-1">
          <Check className="h-3.5 w-3.5 text-emerald-400" /> Archive
        </span>
      </div>
    </div>
  );
}
