'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { PostCard } from '@/components/social/post-card';
import type { PostDocument } from '@/lib/types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface PostPageProps {
  params: { id: string };
}

export default function PostPage({ params }: PostPageProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState<(PostDocument & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const postDoc = await getDoc(doc(db, 'posts', params.id));
        
        if (!postDoc.exists()) {
          setError('Post not found');
          return;
        }

        const postData = postDoc.data() as PostDocument;
        if (postData.hidden) {
          setError('This post is not available');
          return;
        }

        setPost({ id: postDoc.id, ...postData });
        setError(null);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  if (authLoading || loading) {
    return (
      <AppShell>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Oops!</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.push('/home')}>
              Go to Feed
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!post) {
    return (
      <AppShell>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Post not found</h2>
            <Button onClick={() => router.push('/home')}>
              Go to Feed
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">Post Details</h1>
        </div>

        <div className="space-y-4">
          <PostCard
            post={post}
            currentUserId={user?.uid}
            onPostUpdate={(updatedPost) => {
              setPost(prevPost => prevPost ? { ...prevPost, ...updatedPost } : null);
            }}
          />
        </div>
      </div>
    </AppShell>
  );
}