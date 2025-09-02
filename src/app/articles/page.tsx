"use client";
import { AppShell } from '@/components/app-shell';
import { AuthGuard } from '@/components/auth-guard';
import { useEffect, useState } from 'react';
import { listArticles } from '@/lib/db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  useEffect(() => {
    (async () => setArticles(await listArticles(20)))();
  }, []);
  return (
    <AuthGuard>
      <AppShell>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-headline text-2xl font-bold">Articles</h1>
          <Link href="/articles/new"><Button>New Article</Button></Link>
        </div>
        <div className="grid gap-4">
          {articles.map(a => (
            <Card key={a.id}>
              <CardHeader>
                <CardTitle>{a.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">{a.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </AppShell>
    </AuthGuard>
  );
}

