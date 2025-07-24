import Image from 'next/image';
import { CreatePostForm } from '@/components/social/create-post-form';
import { PostCard } from '@/components/social/post-card';
import { StoryAvatar } from '@/components/social/story-avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfilePhoto } from '@/components/ui/profile-photo';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { posts, stories, suggestions } from '@/lib/data';

export default function Home() {
  return (
    <>
      <main className="col-span-1 space-y-8 md:col-span-2">
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
                    <StoryAvatar key={story.id} story={story} />
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
      <aside className="hidden space-y-8 lg:block">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg font-semibold">
              Who to follow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestions.map(user => (
              <div key={user.handle} className="flex items-center space-x-3">
                <ProfilePhoto imageUrl={user.avatarUrl} alt={user.name} size={40} />
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
    </>
  );
}
