'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createPostAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProfilePhoto } from '@/components/ui/profile-photo';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { createPost } from '@/lib/db';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="sm"
      className="bg-accent text-accent-foreground hover:bg-accent/90"
      disabled={pending}
    >
      <Send className="mr-2 h-4 w-4" />
      {pending ? 'Posting...' : 'Post'}
    </Button>
  );
}

export function CreatePostForm() {
  const initialState = { message: null as string | null, errors: {} as any, success: false };
  const [state, dispatch] = useActionState(createPostAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success!' : 'Oops!',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
    if (state.success && user && content && !posting) {
      (async () => {
        try {
          setPosting(true);
          await createPost({ uid: user.uid, displayName: user.displayName, photoURL: user.photoURL }, content);
          setContent('');
          formRef.current?.reset();
          toast({ title: 'Posted!', description: 'Your post has been published.' });
        } catch (err) {
          console.error('Failed to create post:', err);
          toast({ title: 'Error', description: 'Failed to publish post.', variant: 'destructive' });
        } finally {
          setPosting(false);
        }
      })();
    }
  }, [state, toast, user, content, posting]);

  return (
    <Card>
      <CardContent className="p-4">
        <form action={dispatch} ref={formRef} className="space-y-4">
          <div className="flex items-start space-x-4">
            <ProfilePhoto
              imageUrl="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              alt="User"
              size={40}
            />
            <div className="flex-1">
              <Textarea
                name="content"
                placeholder="What's happening?"
                className="w-full border-0 bg-transparent p-0 focus-visible:ring-0"
                rows={3}
                aria-describedby="content-error"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              {state.errors?.content && (
                <p id="content-error" className="text-sm text-destructive">
                  {state.errors.content[0]}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
