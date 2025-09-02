"use client";
import { AppShell } from '@/components/app-shell';
import { AuthGuard } from '@/components/auth-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { createEvent, uploadMediaAndGetUrl } from '@/lib/db';
import { useAuth } from '@/context/auth-context';

export default function NewEventPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [location, setLocation] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  return (
    <AuthGuard>
      <AppShell>
        <Card>
          <CardHeader><CardTitle>New Event</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
            <Input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
            <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
            <Input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] || null)} />
            <Button disabled={saving} onClick={async () => {
              if (!user || !title.trim() || !startAt) return;
              setSaving(true);
              let coverUrl: string | undefined;
              if (cover) coverUrl = await uploadMediaAndGetUrl(cover, 'event-covers');
              await createEvent(user.uid, {
                organizerId: user.uid,
                title: title.trim(),
                description: description.trim(),
                startAt: new Date(startAt) as any,
                endAt: endAt ? (new Date(endAt) as any) : undefined,
                location: location.trim(),
                coverUrl,
                createdAt: new Date() as any,
              } as any);
              setSaving(false);
            }}>{saving ? 'Saving...' : 'Create'}</Button>
          </CardContent>
        </Card>
      </AppShell>
    </AuthGuard>
  );
}

