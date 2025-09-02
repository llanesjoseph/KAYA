"use client";
import Image from 'next/image';
import { AppShell } from '@/components/app-shell';
import { PostCard } from '@/components/social/post-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProfilePhoto } from '@/components/ui/profile-photo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthGuard } from '@/components/auth-guard';
import { useAuth } from '@/context/auth-context';
import { useEffect, useState } from 'react';
import { getUserProfile } from '@/lib/db';
import type { PostDocument, UserProfile } from '@/lib/types';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<(PostDocument & { id: string })[]>([]);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const p = await getUserProfile(user.uid);
      setProfile(p);
      const q = query(collection(db, 'posts'), where('authorId', '==', user.uid), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setUserPosts(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as any);
    })();
  }, [user]);

  return (
    <AuthGuard>
      <AppShell>
        <div className="w-full">
          <Card className="m-4 rounded-b-none border-x-0 border-t-0">
            <CardContent className="p-0">
              <div className="relative h-48 w-full">
                <Image
                  src={profile?.bannerUrl || 'https://placehold.co/1200x400.png'}
                  alt="Cover image"
                  style={{ objectFit: 'cover' }}
                  fill
                  data-ai-hint="header background"
                />
              </div>
              <div className="p-6">
                <div className="relative flex items-end gap-6 -mt-20">
                  <ProfilePhoto
                    imageUrl={profile?.photoURL || 'https://i.pravatar.cc/150'}
                    alt={profile?.displayName || 'User'}
                    size={128}
                    className="-mb-4"
                    borderWidth={4}
                  />
                  <div className="flex-1 pb-2">
                    <h1 className="font-headline text-3xl font-bold">{profile?.displayName || 'User'}</h1>
                    <p className="text-muted-foreground">{profile?.email || ''}</p>
                  </div>
                  <Link href="/settings">
                    <Button className="border-primary text-primary hover:bg-primary/10">
                      Edit Profile
                    </Button>
                  </Link>
                </div>
                <p className="mt-4 text-muted-foreground">
                  {profile?.bio || 'No bio yet.'}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {profile?.roles?.map(r => (
                    <span key={r} className="px-2 py-1 rounded bg-muted">{r}</span>
                  ))}
                  {profile?.expertiseTags?.map(t => (
                    <span key={t} className="px-2 py-1 rounded border text-muted-foreground">{t}</span>
                  ))}
                </div>
                <div className="mt-2 space-x-3 text-sm">
                  {profile?.links?.map(l => (
                    <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">{l.label}</a>
                  ))}
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
                {userPosts.map(p => (
                  <PostCard
                    key={p.id}
                    post={{
                      id: p.id,
                      author: { name: p.authorName || 'User', avatarUrl: p.authorPhotoURL || '' },
                      content: p.content,
                      imageUrl: p.imageUrl,
                      likes: p.likeCount,
                      commentsCount: p.commentCount,
                      timestamp: new Date().toISOString(),
                    }}
                  />
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
    </AuthGuard>
  );
}
