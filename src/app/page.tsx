'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Lock, Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-900 dark:to-purple-900 transition-colors">
      <div className="text-center text-white">
        <Lock className="w-20 h-20 mx-auto mb-4" />
        <h1 className="text-5xl font-bold mb-4">Secure Vault</h1>
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    </div>
  );
}