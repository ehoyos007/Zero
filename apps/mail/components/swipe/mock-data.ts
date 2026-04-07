export interface MockEmail {
  id: string;
  threadId: string;
  sender: {
    name: string;
    email: string;
    avatar?: string;
  };
  subject: string;
  bodyPreview: string;
  receivedAt: Date;
  unread: boolean;
  starred: boolean;
  accountId: string;
  accountEmail: string;
  accountColor: string;
  labels: string[];
}

const now = Date.now();
const hours = (h: number) => new Date(now - h * 3600_000);
const days = (d: number) => new Date(now - d * 86_400_000);

export const MOCK_ACCOUNTS = [
  { id: 'acc-1', email: 'enzo@pureprofit.com', label: 'Work', color: '#3b82f6' },
  { id: 'acc-2', email: 'enzo.hoyos@gmail.com', label: 'Personal', color: '#10b981' },
  { id: 'acc-3', email: 'enzo@sidehustle.io', label: 'Side Project', color: '#f59e0b' },
];

export const MOCK_EMAILS: MockEmail[] = [
  {
    id: 'e-1',
    threadId: 't-1',
    sender: { name: 'Sarah Chen', email: 'sarah@stripe.com' },
    subject: 'Your invoice for March is ready',
    bodyPreview:
      'Hi Enzo, your Stripe invoice for March 2026 has been generated. The total amount due is $847.00. Payment will be automatically processed on April 10th.',
    receivedAt: hours(0.5),
    unread: true,
    starred: false,
    accountId: 'acc-1',
    accountEmail: 'enzo@pureprofit.com',
    accountColor: '#3b82f6',
    labels: ['finance'],
  },
  {
    id: 'e-2',
    threadId: 't-2',
    sender: { name: 'GitHub', email: 'notifications@github.com' },
    subject: '[Mail-0/Zero] PR #1284: Fix thread sync race condition',
    bodyPreview:
      'dependabot[bot] opened a new pull request in Mail-0/Zero. This PR fixes a race condition in the thread sync durable object that could cause duplicate messages.',
    receivedAt: hours(1),
    unread: true,
    starred: false,
    accountId: 'acc-1',
    accountEmail: 'enzo@pureprofit.com',
    accountColor: '#3b82f6',
    labels: ['github'],
  },
  {
    id: 'e-3',
    threadId: 't-3',
    sender: { name: 'Mom', email: 'maria.hoyos@gmail.com' },
    subject: 'Easter brunch this Sunday?',
    bodyPreview:
      'Mijo, are you coming for brunch this Sunday? Abuela is making tamales and your cousin Diego is bringing his new girlfriend. Let me know so I can set the table.',
    receivedAt: hours(2),
    unread: true,
    starred: true,
    accountId: 'acc-2',
    accountEmail: 'enzo.hoyos@gmail.com',
    accountColor: '#10b981',
    labels: ['family'],
  },
  {
    id: 'e-4',
    threadId: 't-4',
    sender: { name: 'Linear', email: 'notifications@linear.app' },
    subject: 'FHE-342 moved to In Progress',
    bodyPreview:
      'Jorge moved FHE-342 "Add compliance score to agent dashboard" to In Progress. Due date: April 9, 2026. Priority: High.',
    receivedAt: hours(3),
    unread: true,
    starred: false,
    accountId: 'acc-1',
    accountEmail: 'enzo@pureprofit.com',
    accountColor: '#3b82f6',
    labels: ['project-management'],
  },
  {
    id: 'e-5',
    threadId: 't-5',
    sender: { name: 'Vercel', email: 'ship@vercel.com' },
    subject: 'Deployment failed: streamnex-app',
    bodyPreview:
      'Your deployment for streamnex-app failed. Build error: Module not found — cannot resolve @/components/dashboard/AgentMetrics. Check your imports and try again.',
    receivedAt: hours(4),
    unread: true,
    starred: false,
    accountId: 'acc-1',
    accountEmail: 'enzo@pureprofit.com',
    accountColor: '#3b82f6',
    labels: ['deployments'],
  },
  {
    id: 'e-6',
    threadId: 't-6',
    sender: { name: 'Netflix', email: 'info@mailer.netflix.com' },
    subject: 'New arrivals: Top picks for you',
    bodyPreview:
      'Based on your viewing history, we think you will love these new titles: The Three-Body Problem Season 2, Black Mirror Season 7, and more trending now.',
    receivedAt: hours(5),
    unread: false,
    starred: false,
    accountId: 'acc-2',
    accountEmail: 'enzo.hoyos@gmail.com',
    accountColor: '#10b981',
    labels: ['promotions'],
  },
  {
    id: 'e-7',
    threadId: 't-7',
    sender: { name: 'Alex Rivera', email: 'alex@pureprofit.com' },
    subject: 'Re: Q2 OKRs — final draft',
    bodyPreview:
      'Looks good to me. I added a note about the StreamNex migration timeline. Can you review the updated KRs for the AI pipeline team before EOD?',
    receivedAt: hours(6),
    unread: true,
    starred: false,
    accountId: 'acc-1',
    accountEmail: 'enzo@pureprofit.com',
    accountColor: '#3b82f6',
    labels: [],
  },
  {
    id: 'e-8',
    threadId: 't-8',
    sender: { name: 'Figma', email: 'noreply@figma.com' },
    subject: "You've been invited to SwipeInbox Designs",
    bodyPreview:
      'Mike Santoro invited you to the file "SwipeInbox Designs" in the PureProfit team workspace. Click here to open the file and start collaborating.',
    receivedAt: hours(8),
    unread: true,
    starred: false,
    accountId: 'acc-1',
    accountEmail: 'enzo@pureprofit.com',
    accountColor: '#3b82f6',
    labels: ['design'],
  },
  {
    id: 'e-9',
    threadId: 't-9',
    sender: { name: 'Product Hunt', email: 'hello@producthunt.com' },
    subject: 'Daily Digest: Top products for April 6',
    bodyPreview:
      'Today on Product Hunt: 1. Cursor 2.0 — AI-first code editor reborn. 2. MagicPatterns — Design system generator. 3. BoltAI — ChatGPT in your Mac menubar.',
    receivedAt: hours(10),
    unread: false,
    starred: false,
    accountId: 'acc-3',
    accountEmail: 'enzo@sidehustle.io',
    accountColor: '#f59e0b',
    labels: ['newsletters'],
  },
  {
    id: 'e-10',
    threadId: 't-10',
    sender: { name: 'AWS', email: 'no-reply@aws.amazon.com' },
    subject: 'Your AWS bill for March 2026',
    bodyPreview:
      'Your AWS account ending in 7291 has a new bill of $23.47 for the billing period of March 1–31, 2026. View your bill and make a payment.',
    receivedAt: hours(12),
    unread: false,
    starred: false,
    accountId: 'acc-3',
    accountEmail: 'enzo@sidehustle.io',
    accountColor: '#f59e0b',
    labels: ['finance'],
  },
  {
    id: 'e-11',
    threadId: 't-11',
    sender: { name: 'Diego Hoyos', email: 'diego.h@outlook.com' },
    subject: 'Bro check this out',
    bodyPreview:
      'Found this sick apartment in Brickell. 2BR/2BA, rooftop pool, $3,200/mo. Want to go look at it this weekend? Link: zillow.com/homedetails/...',
    receivedAt: days(1),
    unread: true,
    starred: false,
    accountId: 'acc-2',
    accountEmail: 'enzo.hoyos@gmail.com',
    accountColor: '#10b981',
    labels: [],
  },
  {
    id: 'e-12',
    threadId: 't-12',
    sender: { name: 'Anthropic', email: 'billing@anthropic.com' },
    subject: 'API usage approaching limit',
    bodyPreview:
      'Your Anthropic API usage has reached 80% of your current tier limit. Current spend: $384.20. Consider upgrading your plan or setting usage alerts.',
    receivedAt: days(1),
    unread: true,
    starred: true,
    accountId: 'acc-1',
    accountEmail: 'enzo@pureprofit.com',
    accountColor: '#3b82f6',
    labels: ['finance'],
  },
  {
    id: 'e-13',
    threadId: 't-13',
    sender: { name: 'Notion', email: 'team@makenotion.com' },
    subject: 'Your weekly workspace digest',
    bodyPreview:
      'Here is what happened in your PureProfit workspace this week: 12 pages updated, 3 new databases created, 47 comments added across 8 pages.',
    receivedAt: days(1.5),
    unread: false,
    starred: false,
    accountId: 'acc-1',
    accountEmail: 'enzo@pureprofit.com',
    accountColor: '#3b82f6',
    labels: ['newsletters'],
  },
  {
    id: 'e-14',
    threadId: 't-14',
    sender: { name: 'TurboTax', email: 'noreply@intuit.com' },
    subject: 'Your 2025 tax return is ready to file',
    bodyPreview:
      'Great news! Your federal and state returns are complete. Federal refund: $2,143. State (FL): No state income tax. Review and e-file by April 15.',
    receivedAt: days(2),
    unread: true,
    starred: true,
    accountId: 'acc-2',
    accountEmail: 'enzo.hoyos@gmail.com',
    accountColor: '#10b981',
    labels: ['finance'],
  },
  {
    id: 'e-15',
    threadId: 't-15',
    sender: { name: 'Shopify', email: 'updates@news.shopify.com' },
    subject: 'Shopify Editions Summer 2026 — What is new',
    bodyPreview:
      'Introducing 100+ product updates to help you sell more. Sidekick AI assistant, one-page checkout redesign, Markets Pro expansion, and headless improvements.',
    receivedAt: days(2),
    unread: false,
    starred: false,
    accountId: 'acc-3',
    accountEmail: 'enzo@sidehustle.io',
    accountColor: '#f59e0b',
    labels: ['newsletters'],
  },
  {
    id: 'e-16',
    threadId: 't-16',
    sender: { name: 'Jorge Mendez', email: 'jorge@pureprofit.com' },
    subject: 'SCA v2 compliance scoring — need your input',
    bodyPreview:
      'Hey Enzo, the compliance scoring model is ready for review. I tweaked the weighting for TCPA violations. Can you pull up the Grafana dashboard and sanity check the numbers?',
    receivedAt: days(2.5),
    unread: true,
    starred: false,
    accountId: 'acc-1',
    accountEmail: 'enzo@pureprofit.com',
    accountColor: '#3b82f6',
    labels: [],
  },
  {
    id: 'e-17',
    threadId: 't-17',
    sender: { name: 'Spotify', email: 'no-reply@spotify.com' },
    subject: 'Your Discover Weekly is ready',
    bodyPreview:
      'We made a fresh playlist just for you. 30 songs based on your recent listening. This week features: Bad Bunny, Peso Pluma, Feid, and more.',
    receivedAt: days(3),
    unread: false,
    starred: false,
    accountId: 'acc-2',
    accountEmail: 'enzo.hoyos@gmail.com',
    accountColor: '#10b981',
    labels: ['promotions'],
  },
  {
    id: 'e-18',
    threadId: 't-18',
    sender: { name: 'Supabase', email: 'notify@supabase.io' },
    subject: 'Database approaching storage limit',
    bodyPreview:
      'Your project openbrain-prod is at 89% of the 8GB storage limit on the Pro plan. Consider running VACUUM or upgrading to the Team plan for 100GB.',
    receivedAt: days(3),
    unread: true,
    starred: false,
    accountId: 'acc-1',
    accountEmail: 'enzo@pureprofit.com',
    accountColor: '#3b82f6',
    labels: ['alerts'],
  },
];

export function getRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const h = Math.floor(minutes / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'yesterday';
  if (d < 7) return `${d}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
