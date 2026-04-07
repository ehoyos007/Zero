import { cn } from '@/lib/utils';

interface Account {
  id: string;
  email: string;
  label: string;
  color: string;
}

interface AccountFilterProps {
  accounts: Account[];
  selectedAccountId: string | null; // null = "All"
  onSelect: (accountId: string | null) => void;
}

export function AccountFilter({ accounts, selectedAccountId, onSelect }: AccountFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto px-1 py-1 no-scrollbar">
      {/* All accounts pill */}
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          'shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors',
          selectedAccountId === null
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-card text-muted-foreground hover:bg-accent',
        )}
      >
        All accounts
      </button>

      {/* Individual account pills */}
      {accounts.map((account) => (
        <button
          key={account.id}
          type="button"
          onClick={() => onSelect(account.id)}
          className={cn(
            'flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors',
            selectedAccountId === account.id
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-card text-muted-foreground hover:bg-accent',
          )}
        >
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: account.color }}
          />
          {account.label}
        </button>
      ))}
    </div>
  );
}
