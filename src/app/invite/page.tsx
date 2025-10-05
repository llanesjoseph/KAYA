'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Loader2, Send, CheckCircle2, Users, Sparkles } from 'lucide-react';

export default function InvitePage() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to send invites',
        variant: 'destructive',
      });
      return;
    }

    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/send-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: email,
          inviterName: user.displayName || 'A KAYA member',
          inviteMessage: message || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invite');
      }

      setSent(true);
      setEmail('');
      setMessage('');

      toast({
        title: '🌿 Invite sent!',
        description: `Your invitation has been sent to ${email}`,
      });

      // Reset success state after 3 seconds
      setTimeout(() => setSent(false), 3000);
    } catch (error: any) {
      toast({
        title: 'Failed to send invite',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 dark:bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-200/30 dark:bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-200/20 dark:bg-lime-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 container max-w-4xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl shadow-lg">
            <Users className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 mb-4">
            Invite Friends to KAYA
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share the cannabis community experience with friends. Send them a personalized invitation to join KAYA.
          </p>
        </div>

        {/* Main card */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 dark:border-emerald-800/50 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          {/* Decorative header */}
          <div className="h-2 bg-gradient-to-r from-emerald-400 via-green-500 to-lime-400" />

          <div className="p-8 md:p-12">
            {/* Success state */}
            {sent && (
              <div className="mb-8 p-6 bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Invitation sent!</h3>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">Your friend will receive an email shortly.</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  Friend's Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="friend@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 text-lg border-2 border-emerald-200 dark:border-emerald-800 focus:border-emerald-400 dark:focus:border-emerald-600 rounded-xl transition-colors"
                />
              </div>

              {/* Message input */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  Personal Message (Optional)
                </label>
                <Textarea
                  id="message"
                  placeholder="Add a personal message to your invitation..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  maxLength={1000}
                  className="resize-none border-2 border-emerald-200 dark:border-emerald-800 focus:border-emerald-400 dark:focus:border-emerald-600 rounded-xl transition-colors"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {message.length}/1000 characters
                </p>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                disabled={loading || !email}
                className="w-full h-14 text-lg bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending Invite...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Invitation
                  </>
                )}
              </Button>
            </form>

            {/* Info section */}
            <div className="mt-8 pt-8 border-t border-emerald-100 dark:border-emerald-900">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <span className="text-2xl">🌿</span>
                What happens next?
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400 font-semibold text-xs mt-0.5">1</span>
                  <span>Your friend receives a personalized email invitation from KAYA</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400 font-semibold text-xs mt-0.5">2</span>
                  <span>They click the link to create their account (must be 21+)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400 font-semibold text-xs mt-0.5">3</span>
                  <span>They join the KAYA community and can connect with you!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg rounded-2xl p-6 text-center border border-emerald-200/30 dark:border-emerald-800/30">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">10k+</div>
            <div className="text-sm text-muted-foreground">Active Members</div>
          </div>
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg rounded-2xl p-6 text-center border border-emerald-200/30 dark:border-emerald-800/30">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">50k+</div>
            <div className="text-sm text-muted-foreground">Posts Shared</div>
          </div>
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg rounded-2xl p-6 text-center border border-emerald-200/30 dark:border-emerald-800/30">
            <div className="text-3xl font-bold text-lime-600 dark:text-lime-400 mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Cannabis Strains</div>
          </div>
        </div>
      </div>
    </div>
  );
}
