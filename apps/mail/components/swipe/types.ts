/**
 * Unified email type for the swipe card UI.
 * Both mock data and real thread data map to this shape.
 */
export interface SwipeEmail {
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
  connectionId: string;
  connectionEmail: string;
  connectionColor: string;
  labels: string[];
}

export interface SwipeAccount {
  id: string;
  email: string;
  label: string;
  color: string;
}
