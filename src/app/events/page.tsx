"use client";
import { AppShell } from '@/components/app-shell';
import { AuthGuard } from '@/components/auth-guard';
import { listEvents } from '@/lib/db';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  useEffect(() => { (async () => setEvents(await listEvents(50)))(); }, []);
  return (
    <AuthGuard>
      <AppShell>
        <h1 className="font-headline text-2xl font-bold mb-6">Events</h1>
        <div className="grid gap-4">
          {events.map(e => (
            <Card key={e.id}>
              <CardHeader><CardTitle>{e.title}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{e.description}</p>
                <p className="text-sm">{e.startAt?.toDate?.().toLocaleString?.() || ''} {e.location ? `• ${e.location}` : ''}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </AppShell>
    </AuthGuard>
  );
}

