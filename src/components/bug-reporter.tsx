'use client';

import { useState } from 'react';
import { Bug, X, Send, Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { consoleLogger } from '@/lib/console-logger';

export function BugReporter() {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      // Get console logs
      const logs = consoleLogger.getLogsAsText();

      // Get browser info
      const browserInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      };

      // Send bug report
      const response = await fetch('/api/bug-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          email: email || user?.email || 'anonymous',
          userName: user?.displayName || 'Anonymous User',
          userId: user?.uid || 'anonymous',
          consoleLogs: logs,
          browserInfo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send bug report');
      }

      toast({
        title: 'Bug Report Sent!',
        description: 'Thank you for helping us improve KAYA. We\'ll look into this right away.',
      });

      // Reset form
      setDescription('');
      setEmail('');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to send bug report:', error);
      toast({
        title: 'Failed to Send',
        description: 'Please try again or email us directly at llanes.joseph.m@gmail.com',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const copyLogsToClipboard = () => {
    const logs = consoleLogger.getLogsAsText();
    navigator.clipboard.writeText(logs);
    toast({
      title: 'Copied!',
      description: 'Console logs copied to clipboard',
    });
  };

  return (
    <>
      {/* Floating Bug Report Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
        size="icon"
        title="Report a Bug"
      >
        <Bug className="h-6 w-6" />
      </Button>

      {/* Bug Report Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-red-500" />
              Report a Bug
            </DialogTitle>
            <DialogDescription>
              Help us improve KAYA by reporting bugs. Your console logs will be automatically included.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">What went wrong?</Label>
              <Textarea
                id="description"
                placeholder="Describe the bug in detail. What were you trying to do? What happened instead?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                className="resize-none"
              />
            </div>

            {!user && (
              <div className="space-y-2">
                <Label htmlFor="email">Your Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  We'll only use this to follow up about the bug
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Console Logs (automatically included)</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={copyLogsToClipboard}
                  >
                    <Clipboard className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLogs(!showLogs)}
                  >
                    {showLogs ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </div>
              {showLogs && (
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <pre className="text-xs font-mono whitespace-pre-wrap">
                    {consoleLogger.getLogsAsText() || 'No logs captured yet'}
                  </pre>
                </div>
              )}
            </div>

            <div className="bg-muted/50 p-3 rounded-md text-xs space-y-1">
              <p className="font-medium">The following information will be included:</p>
              <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                <li>Browser and device information</li>
                <li>Current page URL</li>
                <li>Console logs (last 100 entries)</li>
                <li>Your user ID (if logged in)</li>
              </ul>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={sending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={sending || !description.trim()}>
                {sending ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Bug Report
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
