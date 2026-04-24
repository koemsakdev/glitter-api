'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/features/auth/components/login-form';
import { useAuthStore } from '@/stores/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isHydrated && user && user.role !== 'customer') {
      router.replace('/dashboard');
    }
  }, [isHydrated, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <LoginForm />
    </div>
  );
}