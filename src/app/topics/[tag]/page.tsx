"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { AuthGuard } from '@/components/auth-guard';
import { listArticlesByTag, listPostsByTag } from '@/lib/db';
import { PostCard } from '@/components/social/post-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TopicPage() {
  const params = useParams<{ tag: string }>();
  const tag = decodeURIComponent(params.tag);
  const [posts, setPosts] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      setPosts(await listPostsByTag(tag, 20));
      setArticles(await listArticlesByTag(tag, 20));
    })();
  }, [tag]);
  return (
    <AuthGuard>
      <AppShell>
        <h1 className="font-headline text-2xl font-bold mb-4">#{tag}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {posts.map(p => (
              <PostCard key={p.id} post={{ id: p.id, authorId: p.authorId, author: { name: p.authorName || 'User', avatarUrl: p.authorPhotoURL || '' }, content: p.content, imageUrl: p.imageUrl, likes: p.likeCount, commentsCount: p.commentCount, timestamp: new Date().toISOString() }} />
            ))}
          </div>
          <div className="space-y-4">
            {articles.map(a => (
              <Card key={a.id}>
                <CardHeader><CardTitle>{a.title}</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground line-clamp-3">{a.content}</p></CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AppShell>
    </AuthGuard>
  );
}

