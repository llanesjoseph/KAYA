"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { AuthGuard } from '@/components/auth-guard';
import { getUserProfile, fetchFeedForUser } from '@/lib/db';
import { PostCard } from '@/components/social/post-card';

export default function PublicUserPage() {
  const { uid } = useParams<{ uid: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      setProfile(await getUserProfile(uid));
      const { items } = await fetchFeedForUser(uid, 20);
      setPosts(items);
    })();
  }, [uid]);
  return (
    <AuthGuard>
      <AppShell>
        <h1 className="font-headline text-2xl font-bold mb-4">{profile?.displayName || 'User'}</h1>
        <div className="space-y-4">
          {posts.map(p => (
            <PostCard key={p.id} post={{ id: p.id, authorId: p.authorId, author: { name: p.authorName || 'User', avatarUrl: p.authorPhotoURL || '' }, content: p.content, imageUrl: p.imageUrl, likes: p.likeCount, commentsCount: p.commentCount, timestamp: new Date().toISOString() }} />
          ))}
        </div>
      </AppShell>
    </AuthGuard>
  );
}

