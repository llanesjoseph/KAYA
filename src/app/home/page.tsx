"use client";
import { AppShell } from '@/components/app-shell';
import { CreatePostForm } from '@/components/social/create-post-form';
import { PostCard } from '@/components/social/post-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfilePhoto } from '@/components/ui/profile-photo';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { stories, suggestions } from '@/lib/data';
import { AuthGuard } from '@/components/auth-guard';
import { useEffect, useState } from 'react';
import { fetchFeedForUser, fetchGlobalFeed, subscribeNewPosts } from '@/lib/db';
import type { PostDocument } from '@/lib/types';
import { useAuth } from '@/context/auth-context';

export default function HomePage() {
  const [feed, setFeed] = useState<(PostDocument & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCount, setNewCount] = useState(0);
  const [cursor, setCursor] = useState<any>(undefined);
  const [loadingMore, setLoadingMore] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const { items, nextCursor } = user ? await fetchFeedForUser(user.uid, 25) : await fetchGlobalFeed(25);
        setFeed(items);
        setCursor(nextCursor);
      } catch (e) {
        console.error('Failed to load feed', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  useEffect(() => {
    if (feed.length === 0) return;
    const since = (feed[0] as any).createdAt || new Date();
    const unsub = subscribeNewPosts(since, (items) => {
      setNewCount(prev => prev + items.length);
    });
    return () => unsub();
  }, [feed]);

  return (
    <AuthGuard>
      <AppShell>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <main className="col-span-1 lg:col-span-2 space-y-8">
            <section aria-labelledby="stories-heading">
              <h2
                id="stories-heading"
                className="font-headline text-2xl font-bold sr-only"
              >
                Stories
              </h2>
              <Card>
                <CardContent className="p-4">
                  <ScrollArea>
                    <div className="flex space-x-4">
                      {stories.map(story => (
                        <div
                          key={story.id}
                          className="flex flex-col items-center space-y-2"
                        >
                          <ProfilePhoto
                            imageUrl={story.user.avatarUrl}
                            alt={story.user.name}
                            size={100}
                            borderWidth={1}
                          />
                          <p className="text-xs font-medium">{story.user.name}</p>
                        </div>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </CardContent>
              </Card>
            </section>

            <CreatePostForm />

            <section aria-labelledby="feed-heading">
              <h2 id="feed-heading" className="sr-only">
                Feed
              </h2>
              {loading ? (
                <div className="mt-4">Loading feed…</div>
              ) : (
                <div className="mt-4 space-y-6">
                  {newCount > 0 && (
                    <div className="flex justify-center">
                      <Button variant="outline" size="sm" onClick={() => { setNewCount(0); (async () => { const { items } = user ? await fetchFeedForUser(user.uid, 25) : await fetchGlobalFeed(25); setFeed(items); })(); }}>Load {newCount} new</Button>
                    </div>
                  )}
                  {feed.map(post => (
                    <PostCard
                      key={post.id}
                      post={{
                        id: post.id,
                        author: { name: post.authorName || 'User', avatarUrl: post.authorPhotoURL || 'https://i.pravatar.cc/128' },
                        authorId: post.authorId,
                        content: post.content,
                        imageUrl: post.imageUrl,
                        likes: post.likeCount,
                        commentsCount: post.commentCount,
                        timestamp: new Date().toISOString(),
                      }}
                    />
                  ))}
                  {cursor && (
                    <div className="flex justify-center">
                      <Button variant="outline" onClick={async () => {
                        if (loadingMore) return;
                        setLoadingMore(true);
                        try {
                          const result = user ? await fetchFeedForUser(user.uid, 25, cursor) : await fetchGlobalFeed(25, cursor);
                          setFeed(prev => [...prev, ...result.items]);
                          setCursor(result.nextCursor);
                        } finally {
                          setLoadingMore(false);
                        }
                      }}>{loadingMore ? 'Loading...' : 'Load more'}</Button>
                    </div>
                  )}
                </div>
              )}
            </section>
          </main>
          <aside className="hidden lg:block space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-lg font-semibold">
                  Who to follow
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestions.map(user => (
                  <div key={user.handle} className="flex items-center space-x-3">
                    <ProfilePhoto
                      imageUrl={user.avatarUrl}
                      alt={user.name}
                      size={40}
                    />
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        @{user.handle}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto border-primary text-primary hover:bg-primary/10"
                    >
                      Follow
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </AppShell>
    </AuthGuard>
  );
}
