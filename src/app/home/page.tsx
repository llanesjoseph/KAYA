import { AppShell } from '@/components/app-shell';
import { CreatePostForm } from '@/components/social/create-post-form';
import { PostCard } from '@/components/social/post-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfilePhoto } from '@/components/ui/profile-photo';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { posts, stories, suggestions } from '@/lib/data';
import { AuthGuard } from '@/components/auth-guard';

export default function HomePage() {
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
              <div className="mt-4 space-y-6">
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
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
