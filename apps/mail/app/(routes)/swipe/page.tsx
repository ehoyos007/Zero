import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { SwipeCardStack, type SwipeAction } from '@/components/swipe/SwipeCardStack';
import { AccountFilter } from '@/components/swipe/AccountFilter';
import { InboxZeroCelebration } from '@/components/swipe/InboxZeroCelebration';
import { MOCK_EMAILS, MOCK_ACCOUNTS } from '@/components/swipe/mock-data';
import type { SwipeEmail, SwipeAccount } from '@/components/swipe/types';
import { useOptimisticActions } from '@/hooks/use-optimistic-actions';
import { useConnections } from '@/hooks/use-connections';
import { useThread, useThreads } from '@/hooks/use-threads';
import { useSession } from '@/lib/auth-client';
import { Mail, Loader2 } from 'lucide-react';
import { Link } from 'react-router';

// Color palette for connection account badges
const CONNECTION_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);
}

function mockToSwipeEmail(mock: (typeof MOCK_EMAILS)[number]): SwipeEmail {
  return {
    id: mock.id,
    threadId: mock.threadId,
    sender: { name: mock.sender.name, email: mock.sender.email },
    subject: mock.subject,
    bodyPreview: mock.bodyPreview,
    receivedAt: mock.receivedAt,
    unread: mock.unread,
    starred: mock.starred,
    connectionId: mock.accountId,
    connectionEmail: mock.accountEmail,
    connectionColor: mock.accountColor,
    labels: mock.labels,
  };
}

export default function SwipePage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const isAuthenticated = !!session?.user;

  // Real data hooks — these gracefully no-op when unauthenticated
  const [threadsQuery, threads] = useThreads();
  const connectionsQuery = useConnections();
  const {
    optimisticMoveThreadsTo,
    optimisticDeleteThreads,
    optimisticToggleStar,
  } = useOptimisticActions();

  // Fetch full data for top 3 visible threads (hooks-safe: always 3 calls)
  // IDs shift as threads are swiped — React Query cache serves pre-fetched data instantly
  const filteredThreadIds = useMemo(() => threads.map((t) => t.id), [threads]);

  const thread0 = useThread(filteredThreadIds[0] ?? null);
  const thread1 = useThread(filteredThreadIds[1] ?? null);
  const thread2 = useThread(filteredThreadIds[2] ?? null);

  // Local state
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const startTime = useRef(Date.now());
  const prevHadEmails = useRef(false);

  // Demo mode state (when not authenticated)
  const [demoSwipedIds, setDemoSwipedIds] = useState<Set<string>>(new Set());

  // Build accounts list from connections or mock data
  const accounts: SwipeAccount[] = useMemo(() => {
    if (!isAuthenticated) {
      return MOCK_ACCOUNTS.map((a) => ({
        id: a.id,
        email: a.email,
        label: a.label,
        color: a.color,
      }));
    }
    const connections = connectionsQuery.data?.connections ?? [];
    return connections.map((conn: { id: string; email: string; name: string | null }, i: number) => ({
      id: conn.id,
      email: conn.email,
      label: conn.name ?? conn.email.split('@')[0] ?? 'Account',
      color: CONNECTION_COLORS[i % CONNECTION_COLORS.length]!,
    }));
  }, [isAuthenticated, connectionsQuery.data]);

  // Connection color lookup for mapping thread data
  const connectionColorMap = useMemo(() => {
    const map = new Map<string, { email: string; color: string }>();
    for (const account of accounts) {
      map.set(account.id, { email: account.email, color: account.color });
    }
    return map;
  }, [accounts]);

  // Map loaded thread data → SwipeEmail[]
  const realEmails: SwipeEmail[] = useMemo(() => {
    const queries = [thread0, thread1, thread2];
    return queries
      .filter((q) => q.data?.latest)
      .map((q) => {
        const msg = q.data!.latest!;
        const conn = connectionColorMap.get(msg.connectionId ?? '') ?? {
          email: '',
          color: '#6b7280',
        };
        const isStarred = q.data!.labels?.some((l) => l.name === 'STARRED') ?? false;
        return {
          id: msg.threadId ?? msg.id,
          threadId: msg.threadId ?? msg.id,
          sender: {
            name: msg.sender.name ?? msg.sender.email,
            email: msg.sender.email,
          },
          subject: msg.subject,
          bodyPreview: stripHtml(msg.body || msg.decodedBody || ''),
          receivedAt: new Date(msg.receivedOn),
          unread: msg.unread,
          starred: isStarred,
          connectionId: msg.connectionId ?? '',
          connectionEmail: conn.email,
          connectionColor: conn.color,
          labels: (msg.tags ?? []).map((t) => t.name),
        };
      });
  }, [thread0.data, thread1.data, thread2.data, connectionColorMap]);

  // Demo mode emails (filtered by account + swiped)
  const demoEmails: SwipeEmail[] = useMemo(() => {
    return MOCK_EMAILS.filter((e) => !demoSwipedIds.has(e.id))
      .filter((e) => !selectedAccount || e.accountId === selectedAccount)
      .map(mockToSwipeEmail);
  }, [demoSwipedIds, selectedAccount]);

  // Pick the right email list
  const emails = isAuthenticated ? realEmails : demoEmails;
  const totalRemaining = isAuthenticated ? threads.length : emails.length;
  const isLoading =
    isAuthenticated &&
    (threadsQuery.isLoading || (threads.length > 0 && !thread0.data && !thread0.isError));

  // Detect inbox zero transition
  useEffect(() => {
    if (prevHadEmails.current && emails.length === 0 && !isLoading) {
      setTimeout(() => setShowCelebration(true), 400);
    }
    prevHadEmails.current = emails.length > 0;
  }, [emails.length, isLoading]);

  // Swipe handler — fires optimistic actions for real data, tracks IDs for demo
  const handleSwipe = useCallback(
    (email: SwipeEmail, action: SwipeAction) => {
      setProcessedCount((c) => c + 1);

      if (!isAuthenticated) {
        setDemoSwipedIds((prev) => new Set(prev).add(email.id));
        return;
      }

      const threadId = email.threadId;
      switch (action) {
        case 'archive':
          optimisticMoveThreadsTo([threadId], 'inbox', 'archive');
          break;
        case 'delete':
          optimisticDeleteThreads([threadId], 'inbox');
          break;
        case 'star':
          // Star the thread — it stays in inbox but useOptimisticActions
          // adds an optimistic state. The card advances because the background
          // queue filters it from the threads list for archive/delete,
          // and for star we rely on the thread list naturally progressing.
          optimisticToggleStar([threadId], true);
          // Also archive so it leaves the inbox swipe queue
          optimisticMoveThreadsTo([threadId], 'inbox', 'archive');
          break;
      }
    },
    [
      isAuthenticated,
      optimisticMoveThreadsTo,
      optimisticDeleteThreads,
      optimisticToggleStar,
    ],
  );

  const handleTap = useCallback((_email: SwipeEmail) => {
    // TODO: Phase 1C — expand card to show full email
  }, []);

  const handleLongPress = useCallback((_email: SwipeEmail) => {
    // TODO: Phase 1C — context menu with more actions
  }, []);

  // Session loading state
  if (sessionLoading) {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative flex h-[100dvh] w-full flex-col bg-background">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-4 pb-2 pt-4">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">SwipeInbox</h1>
          {!isAuthenticated && (
            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-500">
              Demo
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {isLoading ? '...' : `${totalRemaining} remaining`}
          </span>
          {!isAuthenticated && (
            <Link
              to="/login"
              className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      {/* Account filter — show in demo mode or when multiple connections exist */}
      {accounts.length > 1 && (
        <div className="shrink-0 px-3 pb-3">
          <AccountFilter
            accounts={accounts}
            selectedAccountId={selectedAccount}
            onSelect={setSelectedAccount}
          />
        </div>
      )}

      {/* Card stack area */}
      <div className="flex flex-1 items-center justify-center px-4 pb-20">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading emails...</p>
          </div>
        ) : emails.length > 0 ? (
          <SwipeCardStack
            emails={emails}
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
            <p className="text-sm text-muted-foreground">
              {isAuthenticated
                ? 'No emails to process right now.'
                : 'Sign in to start swiping real emails.'}
            </p>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="mt-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
              >
                Connect Gmail
              </Link>
            )}
          </div>
        ) : null}
      </div>

      {/* Inbox Zero celebration */}
      <InboxZeroCelebration
        visible={showCelebration}
        emailsProcessed={processedCount}
        startTime={startTime.current}
        onDismiss={() => setShowCelebration(false)}
      />
    </div>
  );
}
