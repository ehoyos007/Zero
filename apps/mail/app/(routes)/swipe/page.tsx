import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { SwipeCardStack, type SwipeAction } from '@/components/swipe/SwipeCardStack';
import { AccountFilter } from '@/components/swipe/AccountFilter';
import { InboxZeroCelebration } from '@/components/swipe/InboxZeroCelebration';
import { MOCK_EMAILS, MOCK_ACCOUNTS, type MockEmail } from '@/components/swipe/mock-data';
import { Mail, Undo2 } from 'lucide-react';

interface SwipedEmail {
  email: MockEmail;
  action: SwipeAction;
}

const ACTION_LABELS: Record<SwipeAction, string> = {
  archive: 'Archived',
  delete: 'Deleted',
  star: 'Starred',
};

export default function SwipePage() {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [swipedIds, setSwipedIds] = useState<Set<string>>(new Set());
  // lastSwiped doubles as toast visibility — non-null = toast shown
  const [lastSwiped, setLastSwiped] = useState<SwipedEmail | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const startTime = useRef(Date.now());
  const prevCount = useRef(-1);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const filteredEmails = useMemo(() => {
    return MOCK_EMAILS.filter((email) => {
      if (swipedIds.has(email.id)) return false;
      if (selectedAccount && email.accountId !== selectedAccount) return false;
      return true;
    });
  }, [selectedAccount, swipedIds]);

  // Detect when queue empties
  useEffect(() => {
    if (prevCount.current > 0 && filteredEmails.length === 0) {
      setLastSwiped(null);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      setTimeout(() => setShowCelebration(true), 400);
    }
    prevCount.current = filteredEmails.length;
  }, [filteredEmails.length]);

  const handleSwipe = useCallback((email: MockEmail, action: SwipeAction) => {
    setSwipedIds((prev) => new Set(prev).add(email.id));
    setLastSwiped({ email, action });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setLastSwiped(null), 5000);
  }, []);

  const handleUndo = useCallback(() => {
    setLastSwiped((current) => {
      if (!current) return null;
      setSwipedIds((prev) => {
        const next = new Set(prev);
        next.delete(current.email.id);
        return next;
      });
      return null;
    });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setShowCelebration(false);
  }, []);

  const handleTap = useCallback((_email: MockEmail) => {
    // TODO: expand card view
  }, []);

  const handleLongPress = useCallback((_email: MockEmail) => {
    // TODO: action menu
  }, []);

  const totalProcessed = swipedIds.size;

  return (
    <div className="relative flex h-[100dvh] w-full flex-col bg-background">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-4 pb-2 pt-4">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">SwipeInbox</h1>
        </div>
        <span className="text-sm text-muted-foreground">
          {filteredEmails.length} remaining
        </span>
      </div>

      {/* Account filter */}
      <div className="shrink-0 px-3 pb-3">
        <AccountFilter
          accounts={MOCK_ACCOUNTS}
          selectedAccountId={selectedAccount}
          onSelect={setSelectedAccount}
        />
      </div>

      {/* Card stack area */}
      <div className="flex flex-1 items-center justify-center px-4 pb-20">
        {filteredEmails.length > 0 ? (
          <SwipeCardStack
            emails={filteredEmails}
            onSwipe={handleSwipe}
            onTap={handleTap}
            onLongPress={handleLongPress}
          />
        ) : !showCelebration ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Mail className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-card-foreground">All caught up!</p>
            <p className="text-sm text-muted-foreground">No emails to process right now.</p>
          </div>
        ) : null}
      </div>

      {/* Undo toast */}
      {lastSwiped && (
        <div className="absolute inset-x-0 bottom-6 z-50 flex justify-center">
          <button
            type="button"
            onClick={handleUndo}
            className="flex items-center gap-3 rounded-full border border-border bg-card px-5 py-3 shadow-xl transition-all hover:bg-accent"
          >
            <span className="text-sm text-card-foreground">
              {ACTION_LABELS[lastSwiped.action]}{' '}
              <span className="font-medium">{lastSwiped.email.sender.name}</span>
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-primary">
              <Undo2 className="h-3.5 w-3.5" />
              Undo
            </span>
          </button>
        </div>
      )}

      {/* Inbox Zero celebration */}
      <InboxZeroCelebration
        visible={showCelebration}
        emailsProcessed={totalProcessed}
        startTime={startTime.current}
        onDismiss={() => setShowCelebration(false)}
      />
    </div>
  );
}
