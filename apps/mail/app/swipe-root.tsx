import { authProxy } from '@/lib/auth-proxy';
import type { Route } from './+types/page';
import { redirect } from 'react-router';

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const session = await authProxy.api.getSession({ headers: request.headers });
  if (session?.user.id) throw redirect('/swipe');
  throw redirect('/login');
}

export default function SwipeRoot() {
  return null;
}
