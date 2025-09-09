"use client";
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageSquare, MoreHorizontal, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProfilePhoto } from '@/components/ui/profile-photo';
import type { Post } from '@/lib/data';
import { useAuth } from '@/context/auth-context';
import { isPostLikedByUser, toggleLike, isFollowing, toggleFollow } from '@/lib/db';
import { CommentsSection } from './comments-section';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { addComment } from '@/lib/db';
import { addReport } from '@/lib/db';

interface PostCardProps {
  post: Post & { authorId?: string };
}

export function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [following, setFollowing] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (user) {
        try {
          const liked = await isPostLikedByUser(post.id, user.uid);
          if (mounted) setLiked(liked);
        } catch (e) {
          // noop
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user, post.id]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (user && post.authorId && user.uid !== post.authorId) {
        try {
          const f = await isFollowing(user.uid, post.authorId);
          if (mounted) setFollowing(f);
        } catch (e) {}
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user, post.authorId]);

  const onToggleLike = async () => {
    if (!user) return;
    setLiked(prev => !prev);
    setLikeCount(prev => (liked ? prev - 1 : prev + 1));
    try {
      await toggleLike(post.id, user.uid);
    } catch (e) {
      // rollback on error
      setLiked(prev => !prev);
      setLikeCount(prev => (liked ? prev + 1 : prev - 1));
    }
  };

  const onToggleFollow = async () => {
    if (!user || !post.authorId || user.uid === post.authorId) return;
    try {
      const nowFollowing = await toggleFollow(user.uid, post.authorId);
      setFollowing(nowFollowing);
    } catch (e) {}
  };

  const onSubmitComment = async () => {
    if (!user || !commentText.trim()) return;
    try {
      await addComment(post.id, { uid: user.uid, displayName: user.displayName, photoURL: user.photoURL }, commentText.trim());
      setCommentText('');
      setIsCommentOpen(false);
    } catch (e) {
      // noop for now
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <ProfilePhoto
          imageUrl={post.author.avatarUrl}
          alt={post.author.name}
          size={40}
        />
        <div className="flex-1">
          <p className="font-semibold">{post.author.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(post.timestamp), {
              addSuffix: true,
            })}
          </p>
        </div>
        {user && post.authorId && user.uid !== post.authorId && (
          <Button variant="outline" size="sm" className="mr-2" onClick={onToggleFollow}>
            {following ? 'Following' : 'Follow'}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>View Post</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setReportOpen(true)}>Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent 
        className="px-4 pb-2 cursor-pointer hover:bg-muted/50 transition-colors rounded-md" 
        onClick={() => router.push(`/posts/${post.id}`)}
      >
        <p className="whitespace-pre-wrap">
          {post.content.split(/(#[\p{L}0-9_]+)/gu).map((part, i) => {
            if (part.startsWith('#')) {
              const tag = part.slice(1);
              return (
                <a 
                  key={i} 
                  href={`/topics/${encodeURIComponent(tag)}`} 
                  className="text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {part}
                </a>
              );
            }
            return <span key={i}>{part}</span>;
          })}
        </p>
        {post.imageUrl && (
          <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-lg border">
            <Image
              src={post.imageUrl}
              alt="Post image"
              fill
              style={{ objectFit: 'cover' }}
              data-ai-hint="social media post"
            />
          </div>
        )}
        {(!post.imageUrl && (post as any).videoUrl) && (
          <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-lg border">
            <video controls poster={(post as any).thumbnailUrl} className="w-full h-full object-cover">
              <source src={(post as any).videoUrl} />
            </video>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between p-2">
        <Button variant="ghost" className={`flex items-center gap-2 ${liked ? 'text-red-500' : ''}`} onClick={onToggleLike}>
          <Heart className="h-5 w-5" />
          <span>{likeCount}</span>
        </Button>
        <Dialog open={isCommentOpen} onOpenChange={setIsCommentOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span>{post.commentsCount}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Comments</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col flex-1 min-h-0">
              {/* Existing Comments */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                <CommentsSection postId={post.id!} />
              </div>
              
              {/* Add Comment Form */}
              <div className="border-t pt-3 space-y-3">
                <Textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} rows={3} placeholder="Write your comment..." />
                <div className="flex justify-end">
                  <Button onClick={onSubmitComment} disabled={!commentText.trim()}>Comment</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Button variant="ghost" className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          <span>Share</span>
        </Button>
      </CardFooter>
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report content</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Textarea rows={4} placeholder="Reason for reporting" value={reportReason} onChange={(e) => setReportReason(e.target.value)} />
            <div className="flex justify-end">
              <Button onClick={async () => {
                if (!reportReason.trim()) return;
                await addReport({ type: 'post', refId: post.id, reason: reportReason.trim(), reporterId: user?.uid });
                setReportReason('');
                setReportOpen(false);
              }}>Submit</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
