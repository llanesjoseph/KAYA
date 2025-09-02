"use client";
import { AppShell } from '@/components/app-shell';
import { AuthGuard } from '@/components/auth-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { createCompany, uploadMediaAndGetUrl } from '@/lib/db';
import { useAuth } from '@/context/auth-context';

export default function NewCompanyPage() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  return (
    <AuthGuard>
      <AppShell>
        <Card>
          <CardHeader><CardTitle>New Company</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Company name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
            <Input placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
            <Input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] || null)} />
            <Button disabled={saving} onClick={async () => {
              if (!user || !name.trim()) return;
              setSaving(true);
              let logoUrl: string | undefined;
              if (logo) logoUrl = await uploadMediaAndGetUrl(logo, 'company-logos');
              await createCompany(user.uid, name.trim(), logoUrl, bio.trim(), website.trim());
              setSaving(false);
            }}>{saving ? 'Saving...' : 'Create'}</Button>
          </CardContent>
        </Card>
      </AppShell>
    </AuthGuard>
  );
}

