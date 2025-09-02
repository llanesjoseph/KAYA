"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { AuthGuard } from '@/components/auth-guard';
import { listArticlesByTag, listPostsByTag } from '@/lib/db';
import { PostCard } from '@/components/social/post-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TopicPage() {
  const params = useParams<{ tag: string }>();
  const tag = decodeURIComponent(params.tag);
  const [posts, setPosts] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [postCursor, setPostCursor] = useState<any>(undefined);
  const [articleCursor, setArticleCursor] = useState<any>(undefined);
  const [loadingMore, setLoadingMore] = useState(false);
  useEffect(() => {
    (async () => {
      const p = await listPostsByTag(tag, 20);
      setPosts(p.items);
      setPostCursor(p.nextCursor);
      const a = await listArticlesByTag(tag, 20);
      setArticles(a.items);
      setArticleCursor(a.nextCursor);
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
            {postCursor && (
              <div className="flex justify-center">
                <Button variant="outline" onClick={async () => {
                  if (loadingMore) return;
                  setLoadingMore(true);
                  try {
                    const p = await listPostsByTag(tag, 20, postCursor);
                    setPosts(prev => [...prev, ...p.items]);
                    setPostCursor(p.nextCursor);
                  } finally {
                    setLoadingMore(false);
                  }
                }}>{loadingMore ? 'Loading...' : 'Load more posts'}</Button>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {articles.map(a => (
              <Card key={a.id}>
                <CardHeader><CardTitle>{a.title}</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground line-clamp-3">{a.content}</p></CardContent>
              </Card>
            ))}
            {articleCursor && (
              <div className="flex justify-center">
                <Button variant="outline" onClick={async () => {
                  if (loadingMore) return;
                  setLoadingMore(true);
                  try {
                    const a = await listArticlesByTag(tag, 20, articleCursor);
                    setArticles(prev => [...prev, ...a.items]);
                    setArticleCursor(a.nextCursor);
                  } finally {
                    setLoadingMore(false);
                  }
                }}>{loadingMore ? 'Loading...' : 'Load more articles'}</Button>
              </div>
            )}
          </div>
        </div>
      </AppShell>
    </AuthGuard>
  );
}

