import Image from 'next/image';
import { AppShell } from '@/components/app-shell';
import { PostCard } from '@/components/social/post-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProfilePhoto } from '@/components/ui/profile-photo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { posts } from '@/lib/data';

export default function ProfilePage() {
  return (
    <AppShell>
      <div className="w-full">
        <Card className="m-4 rounded-b-none border-x-0 border-t-0">
          <CardContent className="p-0">
            <div className="relative h-48 w-full">
              <Image
                src="https://placehold.co/1200x400.png"
                alt="Cover image"
                className="object-cover"
                fill
                data-ai-hint="header background"
              />
            </div>
            <div className="p-6">
              <div className="relative flex items-end gap-6 -mt-20">
                <ProfilePhoto
                  imageUrl="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  alt="User"
                  size={128}
                  className="-mb-4"
                  borderWidth={4}
                />
                <div className="flex-1 pb-2">
                  <h1 className="font-headline text-3xl font-bold">Kaya User</h1>
                  <p className="text-muted-foreground">@kayauser</p>
                </div>
                <Button className="border-primary text-primary hover:bg-primary/10">
                  Edit Profile
                </Button>
              </div>
              <p className="mt-4 text-muted-foreground">
                Lover of code, coffee, and clean UI. Building the future of
                social with Next.js.
              </p>
              <div className="mt-4 flex gap-6 text-sm">
                <p>
                  <span className="font-bold">128</span> Following
                </p>
                <p>
                  <span className="font-bold">1.2k</span> Followers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Tabs defaultValue="posts" className="p-4 pt-0">
          <TabsList className="grid w-full grid-cols-3 bg-card">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="likes">Likes</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
              {posts.map(post => (
                <PostCard key={post.id + '-clone'} post={post} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="media">
            <div className="flex justify-center items-center h-48">
              <p className="text-muted-foreground">No media yet.</p>
            </div>
          </TabsContent>
          <TabsContent value="likes">
            <div className="flex justify-center items-center h-48">
              <p className="text-muted-foreground">No liked posts yet.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
