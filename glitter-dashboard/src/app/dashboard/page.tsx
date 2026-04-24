'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProtectedRoute } from '@/features/auth/components/protected-route';
import { useLogout } from '@/features/auth/use-auth';
import { useAuthStore } from '@/stores/auth-store';

function DashboardContent() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  async function handleLogout() {
    await logout.mutateAsync();
    router.replace('/login');
  }

  return (
    <div className="min-h-screen bg-muted/30 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Glitter Shop Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.fullName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Email:</span> {user?.email}
              </p>
              <p>
                <span className="font-medium">Role:</span>{' '}
                <span className="rounded bg-primary/10 px-2 py-0.5 text-primary">
                  {user?.role}
                </span>
              </p>
              <p>
                <span className="font-medium">User ID:</span> {user?.id}
              </p>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Auth is working! In Chunk 3, we&apos;ll build the full dashboard
              layout with sidebar and navigation.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}