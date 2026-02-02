'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHydration, useHasCompletedOnboarding } from '@/stores';

export default function HomePage() {
  const router = useRouter();
  const isHydrated = useHydration();
  const hasCompletedOnboarding = useHasCompletedOnboarding();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isHydrated) {
      if (hasCompletedOnboarding) {
        router.replace('/dashboard');
      } else {
        router.replace('/onboarding');
      }
      setIsLoading(false);
    }
  }, [isHydrated, hasCompletedOnboarding, router]);

  // Loading state while hydrating
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--background)]">
        <div className="text-5xl animate-bounce">🌱</div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Life OS</h1>
        <p className="text-[var(--foreground-secondary)]">Wird geladen...</p>
      </div>
    );
  }

  return null;
}
