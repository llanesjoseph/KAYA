"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { AuthGuard } from '@/components/auth-guard';
import { getCompany, listCompanyEvents, listCompanyJobs } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CompanyPublicPage() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      setCompany(await getCompany(id));
      setJobs(await listCompanyJobs(id));
      setEvents(await listCompanyEvents(id));
    })();
  }, [id]);
  return (
    <AuthGuard>
      <AppShell>
        <h1 className="font-headline text-2xl font-bold mb-4">{company?.name || 'Company'}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Jobs</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {jobs.map(j => (<div key={j.id}><p className="font-medium">{j.title}</p><p className="text-sm text-muted-foreground">{j.location}</p></div>))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Events</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {events.map(e => (<div key={e.id}><p className="font-medium">{e.title}</p><p className="text-sm text-muted-foreground">{e.startAt?.toDate?.().toLocaleString?.()}</p></div>))}
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </AuthGuard>
  );
}

