import Image from 'next/image';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ProfilePhoto } from '@/components/ui/profile-photo';
import { trendingTopics, suggestions } from '@/lib/data';
import { Plus } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';

export default function DiscoverPage() {
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
            <Input
              placeholder="Search for anything..."
              className="h-12 text-lg"
            />
          </div>

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
