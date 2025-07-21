import Image from 'next/image';
import { AppShell } from '@/components/app-shell';
import { CreatePostForm } from '@/components/social/create-post-form';
import { PostCard } from '@/components/social/post-card';
import { StoryAvatar } from '@/components/social/story-avatar';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { stories, posts } from '@/lib/data';

export default function Home() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          <main className="space-y-8">
            <CreatePostForm />

            <section aria-labelledby="stories-heading">
              <h2
                id="stories-heading"
                className="font-headline text-2xl font-bold"
              >
                Stories
              </h2>
              <Card className="mt-4">
                <CardContent className="p-4">
                  <ScrollArea>
                    <div className="flex space-x-4">
                      {stories.map(story => (
                        <StoryAvatar key={story.id} story={story} />
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </CardContent>
              </Card>
            </section>

            <section aria-labelledby="feed-heading">
              <h2 id="feed-heading" className="font-headline text-2xl font-bold">
                Feed
              </h2>
              <div className="mt-4 space-y-6">
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          </main>
          <aside className="hidden space-y-8 lg:block">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-headline text-lg font-semibold">
                  Suggestions
                </h3>
                <div className="mt-4 space-y-4">
                  {stories.slice(0, 3).map(user => (
                    <div key={user.id} className="flex items-center space-x-3">
                      <Image
                        src={user.user.avatarUrl}
                        alt={user.user.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                        data-ai-hint="user avatar"
                      />
                      <div>
                        <p className="font-semibold">{user.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          @{user.user.name.toLowerCase().replace(' ', '')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
