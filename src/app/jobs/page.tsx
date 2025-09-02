"use client";
import { AppShell } from '@/components/app-shell';
import { AuthGuard } from '@/components/auth-guard';
import { listJobs, listCompanies } from '@/lib/db';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [companies, setCompanies] = useState<Record<string, any>>({});
  useEffect(() => { (async () => {
    const [j, c] = await Promise.all([listJobs(50), listCompanies(200)]);
    setJobs(j);
    const map: Record<string, any> = {};
    c.forEach(co => { map[co.id] = co; });
    setCompanies(map);
  })(); }, []);
  return (
    <AuthGuard>
      <AppShell>
        <h1 className="font-headline text-2xl font-bold mb-6">Jobs</h1>
        <div className="grid gap-4">
          {jobs.map(job => (
            <Card key={job.id}>
              <CardHeader><CardTitle>{job.title}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">{job.description}</p>
                <p className="text-sm">{companies[job.companyId]?.name || 'Company'} {job.location ? `• ${job.location}` : ''}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </AppShell>
    </AuthGuard>
  );
}

