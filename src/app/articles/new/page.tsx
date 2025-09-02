"use client";
import { AppShell } from '@/components/app-shell';
import { AuthGuard } from '@/components/auth-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useActionState, useEffect, useState } from 'react';
import { createArticleAction } from '@/app/actions';
import { useAuth } from '@/context/auth-context';
import { createArticle, uploadMediaAndGetUrl } from '@/lib/db';

export default function NewArticlePage() {
  const [state, dispatch] = useActionState(createArticleAction, { message: null, errors: {}, success: false } as any);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      if (state.success && user) {
        setSaving(true);
        let coverUrl: string | undefined;
        if (file) coverUrl = await uploadMediaAndGetUrl(file, 'articles');
        await createArticle(user.uid, title, content, coverUrl);
        setSaving(false);
      }
    })();
  }, [state, user]);

  return (
    <AuthGuard>
      <AppShell>
        <Card>
          <CardHeader>
            <CardTitle>New Article</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={dispatch} className="space-y-4">
              <Input name="title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Textarea name="content" rows={10} placeholder="Write your article..." value={content} onChange={(e) => setContent(e.target.value)} />
              <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              {state.errors?.title && <p className="text-sm text-destructive">{state.errors.title[0]}</p>}
              {state.errors?.content && <p className="text-sm text-destructive">{state.errors.content[0]}</p>}
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Publish'}</Button>
            </form>
          </CardContent>
        </Card>
      </AppShell>
    </AuthGuard>
  );
}

