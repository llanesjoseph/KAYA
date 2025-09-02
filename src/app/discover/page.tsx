"use client";
import Image from 'next/image';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ProfilePhoto } from '@/components/ui/profile-photo';
import { trendingTopics, suggestions } from '@/lib/data';
import { Plus } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';
import { useEffect, useState } from 'react';
import { searchPostsByContentPrefix, searchUsersByNamePrefix } from '@/lib/db';

export default function DiscoverPage() {
  const [queryText, setQueryText] = useState('');
  const [userResults, setUserResults] = useState<any[]>([]);
  const [postResults, setPostResults] = useState<any[]>([]);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!queryText.trim()) {
        setUserResults([]);
        setPostResults([]);
        return;
      }
      const [users, posts] = await Promise.all([
        searchUsersByNamePrefix(queryText.trim(), 5),
        searchPostsByContentPrefix(queryText.trim(), 5),
      ]);
      setUserResults(users);
      setPostResults(posts);
    }, 250);
    return () => clearTimeout(t);
  }, [queryText]);

  return (
    <AuthGuard>
      <AppShell>
        <div className="w-full p-4 sm:p-6 lg:p-8">
          <header className="mb-8">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight lg:text-5xl">
              Discover
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Find new content, topics, and people on Kaya.
            </p>
          </header>

          <div className="relative mb-8">
            <Input placeholder="Search for anything..." className="h-12 text-lg" value={queryText} onChange={(e) => setQueryText(e.target.value)} />
          </div>

          {(userResults.length > 0 || postResults.length > 0) && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Users</CardTitle>
                </CardHeader>
                <CardContent>
                  {userResults.map((u) => (
                    <div key={u.uid} className="flex items-center gap-4 py-2">
                      <ProfilePhoto imageUrl={u.photoURL || ''} alt={u.displayName || ''} size={40} />
                      <div>
                        <p className="font-semibold">{u.displayName}</p>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  {postResults.map((p) => (
                    <div key={p.id} className="py-2">
                      <p className="font-medium">{p.content}</p>
                      <p className="text-xs text-muted-foreground">by {p.authorName}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Trending Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {trendingTopics.map(topic => (
                    <li key={topic.name} className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{topic.name}</p>
                        <p className="text-sm text-muted-foreground">{topic.posts} posts</p>
                      </div>
                      <Button variant="ghost" size="sm">Explore</Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Who to Follow</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {suggestions.map(user => (
                    <li key={user.name} className="flex items-center gap-4">
                      <ProfilePhoto imageUrl={user.avatarUrl} alt={user.name} size={48} />
                      <div className="flex-1">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">@{user.handle}</p>
                      </div>
                      <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                          <Plus className="h-4 w-4 mr-2" /> Follow
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppShell>
    </AuthGuard>
  );
}
