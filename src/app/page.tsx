'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHydration, useHasCompletedOnboarding } from '@/stores';

export default function HomePage() {
  const router = useRouter();
  const isHydrated = useHydration();
  const hasCompletedOnboarding = useHasCompletedOnboarding();
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isHydrated && mounted) {
      if (hasCompletedOnboarding) {
        router.replace('/today');
      } else {
        router.replace('/onboarding');
      }
      setIsLoading(false);
    }
  }, [isHydrated, hasCompletedOnboarding, router, mounted]);

  // Loading state while hydrating
  // Use a consistent render for both server and initial client pass
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--background)]">
        <div className="text-5xl animate-bounce">🌱</div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Lebensplaner</h1>
        <p className="text-[var(--foreground-secondary)]">Wird geladen...</p>
      </div>
    );
  }

  return null;
}
