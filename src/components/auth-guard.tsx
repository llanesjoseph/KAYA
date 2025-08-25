'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const mockMode =
    typeof process !== 'undefined' &&
    typeof process.env !== 'undefined'
      ? process.env.NEXT_PUBLIC_MOCK_MODE !== 'false'
      : true;
  const router = useRouter();

  useEffect(() => {
    if (mockMode) return;
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router, mockMode]);

  if (!mockMode && (loading || !user)) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

  return <>{children}</>;
}
