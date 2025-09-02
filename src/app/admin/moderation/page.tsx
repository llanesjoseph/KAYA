"use client";
import { AppShell } from '@/components/app-shell';
import { AuthGuard } from '@/components/auth-guard';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { hidePost, listReports, resolveReport } from '@/lib/db';

export default function ModerationPage() {
  const [reports, setReports] = useState<any[]>([]);
  useEffect(() => { (async () => setReports(await listReports(100)))(); }, []);
  const refresh = async () => setReports(await listReports(100));
  return (
    <AuthGuard>
      <AppShell>
        <h1 className="font-headline text-2xl font-bold mb-6">Moderation</h1>
        <div className="grid gap-4">
          {reports.map(r => (
            <Card key={r.id}>
              <CardHeader><CardTitle>{r.type} • {r.refId}</CardTitle></CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-muted-foreground">{r.reason}</p>
                <div className="flex gap-2">
                  {r.type === 'post' && (
                    <Button variant="outline" onClick={async () => { await hidePost(r.refId, true); await resolveReport(r.id); await refresh(); }}>Hide Post</Button>
                  )}
                  <Button onClick={async () => { await resolveReport(r.id); await refresh(); }}>Resolve</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </AppShell>
    </AuthGuard>
  );
}

