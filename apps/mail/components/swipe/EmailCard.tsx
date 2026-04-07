import { type MockEmail, getRelativeTime } from './mock-data';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-violet-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-cyan-500',
    'bg-pink-500',
    'bg-indigo-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length]!;
}

interface EmailCardProps {
  email: MockEmail;
  className?: string;
}

export function EmailCard({ email, className = '' }: EmailCardProps) {
  return (
    <div
      className={`flex h-full w-full flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-lg ${className}`}
    >
      {/* Header: avatar + sender + account badge */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${getAvatarColor(email.sender.name)}`}
          >
            {getInitials(email.sender.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-card-foreground">
              {email.sender.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">{email.sender.email}</p>
          </div>
        </div>
        <div
          className="mt-1 h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: email.accountColor }}
          title={email.accountEmail}
        />
      </div>

      {/* Body: subject + preview */}
      <div className="mt-4 flex-1">
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-card-foreground">
          {email.subject}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {email.bodyPreview}
        </p>
      </div>

      {/* Footer: timestamp + unread indicator */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{getRelativeTime(email.receivedAt)}</span>
        <div className="flex items-center gap-2">
          {email.starred && (
            <svg
              className="h-4 w-4 fill-amber-400 text-amber-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
          {email.unread && <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />}
        </div>
      </div>
    </div>
  );
}
