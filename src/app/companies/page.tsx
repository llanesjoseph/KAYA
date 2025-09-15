"use client";

export const dynamic = 'force-dynamic';
import { AppShell } from '@/components/app-shell';
import { AuthGuard } from '@/components/auth-guard';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { listCompanies, toggleFollowCompany, isFollowingCompany } from '@/lib/db';
import { useAuth } from '@/context/auth-context';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const { user } = useAuth();
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  useEffect(() => {
    (async () => {
      const list = await listCompanies(50);
      setCompanies(list);
      if (user) {
        const map: Record<string, boolean> = {};
        for (const c of list) {
          map[c.id] = await isFollowingCompany(user.uid, c.id);
        }
        setFollowingMap(map);
      }
    })();
  }, [user]);
  return (
    <AuthGuard>
      <AppShell>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-headline text-2xl font-bold">Companies</h1>
        </div>
        <div className="grid gap-4">
          {companies.map(c => (
            <Card key={c.id}>
              <CardHeader><CardTitle>{c.name}</CardTitle></CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-muted-foreground">{c.bio}</p>
                {user && (
                  <Button onClick={async () => {
                    const now = await toggleFollowCompany(user.uid, c.id);
                    setFollowingMap(prev => ({ ...prev, [c.id]: now }));
                  }}>{followingMap[c.id] ? 'Following' : 'Follow'}</Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </AppShell>
    </AuthGuard>
  );
}

