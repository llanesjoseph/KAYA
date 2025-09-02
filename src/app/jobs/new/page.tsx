"use client";
import { AppShell } from '@/components/app-shell';
import { AuthGuard } from '@/components/auth-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { createJob, listCompanies } from '@/lib/db';

export default function NewJobPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [companies, setCompanies] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  useEffect(() => { (async () => setCompanies(await listCompanies(200)))(); }, []);
  return (
    <AuthGuard>
      <AppShell>
        <Card>
          <CardHeader><CardTitle>New Job</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
            <select className="w-full border rounded h-10 px-3" value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
              <option value="">Select company</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <Button disabled={saving} onClick={async () => {
              if (!title.trim() || !companyId) return;
              setSaving(true);
              await createJob(companyId, title.trim(), description.trim(), location.trim());
              setSaving(false);
            }}>{saving ? 'Saving...' : 'Create'}</Button>
          </CardContent>
        </Card>
      </AppShell>
    </AuthGuard>
  );
}

