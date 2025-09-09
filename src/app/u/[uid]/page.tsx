"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { AuthGuard } from '@/components/auth-guard';
import { getUserProfile, listPostsByAuthor, isFollowing, toggleFollow, getFollowCounts } from '@/lib/db';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/social/post-card';

export default function PublicUserPage() {
  const { uid } = useParams<{ uid: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [following, setFollowing] = useState(false);
  const [counts, setCounts] = useState<{ followers: number; following: number } | null>(null);
  const { user } = useAuth();
  useEffect(() => {
    (async () => {
      const [p, feed, cts] = await Promise.all([
        getUserProfile(uid),
        listPostsByAuthor(uid, 20),
        getFollowCounts(uid),
      ]);
      setProfile(p);
      setPosts(feed.items);
      setCounts(cts);
      if (user && user.uid !== uid) {
        try { setFollowing(await isFollowing(user.uid, uid)); } catch {}
      }
    })();
  }, [uid, user]);
  return (
    <AuthGuard>
      <AppShell>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-headline text-2xl font-bold">{profile?.displayName || 'User'}</h1>
          {user && user.uid !== uid && (
            <Button
              variant="outline"
              onClick={async () => {
                if (!user) return;
                try {
                  const nowFollowing = await toggleFollow(user.uid, uid);
                  setFollowing(nowFollowing);
                  const c = await getFollowCounts(uid);
                  setCounts(c);
                } catch {}
              }}
            >
              {following ? 'Following' : 'Follow'}
            </Button>
          )}
        </div>
        <div className="text-sm text-muted-foreground mb-6">
          <span className="mr-4"><strong>{counts?.followers ?? 0}</strong> Followers</span>
          <span><strong>{counts?.following ?? 0}</strong> Following</span>
        </div>
        <div className="space-y-4">
          {posts.map(p => (
            <PostCard key={p.id} post={{ id: p.id, authorId: p.authorId, author: { name: p.authorName || 'User', avatarUrl: p.authorPhotoURL || '' }, content: p.content, imageUrl: p.imageUrl, likes: p.likeCount, commentsCount: p.commentCount, timestamp: new Date().toISOString() }} />
          ))}
        </div>
      </AppShell>
    </AuthGuard>
  );
}

