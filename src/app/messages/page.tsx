"use client";
import { formatDistanceToNow } from 'date-fns';
import { SendHorizonal, Smile } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProfilePhoto } from '@/components/ui/profile-photo';
import { AuthGuard } from '@/components/auth-guard';
import { useAuth } from '@/context/auth-context';
import { listMessages, listThreads, sendMessage, subscribeMessages, upsertThread } from '@/lib/db';
import { useEffect, useMemo, useState } from 'react';

export default function MessagesPage() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<any[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<any[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    (async () => {
      if (!user) return;
      const t = await listThreads(user.uid);
      setThreads(t);
      if (t.length) setActiveThreadId(t[0].id);
    })();
  }, [user]);

  useEffect(() => {
    if (!activeThreadId) return;
    const unsub = subscribeMessages(activeThreadId, setActiveMessages);
    return () => unsub();
  }, [activeThreadId]);

  const activeChatUser = useMemo(() => {
    const thread = threads.find(t => t.id === activeThreadId);
    const otherId = thread?.participantIds?.find((id: string) => id !== user?.uid);
    // For MVP, placeholder avatar and name
    return { name: otherId || 'Conversation', avatarUrl: 'https://placehold.co/128x128.png' };
  }, [threads, activeThreadId, user]);

  return (
    <AuthGuard>
      <AppShell>
        <div className="grid h-full grid-cols-1 md:grid-cols-[300px_1fr]">
          {/* Conversation List */}
          <div className="flex flex-col border-r bg-card">
            <div className="p-4 border-b">
              <h2 className="font-headline text-2xl font-bold">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {threads.map((t: any) => (
                <div
                  key={t.id}
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 ${
                    t.id === activeThreadId ? 'bg-muted' : ''
                  }`}
                  onClick={() => setActiveThreadId(t.id)}
                >
                  <ProfilePhoto
                    imageUrl={activeChatUser.avatarUrl}
                    alt={activeChatUser.name}
                    size={48}
                  />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold truncate">{activeChatUser.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(t.lastMessageAt?.toDate?.() || new Date()), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-muted-foreground truncate">{t.lastMessageText || ''}</p>
                      {0 > 0 && (
                        <Badge className="bg-accent text-accent-foreground">
                          0
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex flex-col h-full bg-background">
            <div className="flex items-center gap-4 p-4 border-b">
              <ProfilePhoto
                imageUrl={activeChatUser.avatarUrl}
                alt={activeChatUser.name}
                size={40}
              />
              <h3 className="font-semibold text-lg">{activeChatUser.name}</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeMessages.map(m => (
                <div key={m.id} className={`flex items-end gap-3 ${m.senderId === user?.uid ? 'justify-end' : ''}`}>
                  {m.senderId !== user?.uid && (
                    <ProfilePhoto imageUrl={activeChatUser.avatarUrl} alt={activeChatUser.name} size={32} />
                  )}
                  <div className={`max-w-xs rounded-lg p-3 shadow-sm ${m.senderId === user?.uid ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                    <p>{m.content}</p>
                  </div>
                  {m.senderId === user?.uid && (
                    <ProfilePhoto imageUrl={user?.photoURL || ''} alt={user?.displayName || 'You'} size={32} />
                  )}
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-card">
              <div className="relative">
                <Input placeholder="Type a message..." className="pr-24 h-12" value={text} onChange={(e) => setText(e.target.value)} />
                <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-1">
                  <Button variant="ghost" size="icon">
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button size="icon" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={async () => {
                    if (!user || !activeThreadId || !text.trim()) return;
                    await sendMessage(activeThreadId, user.uid, text.trim());
                    setText('');
                    const { items } = await listMessages(activeThreadId);
                    setActiveMessages(items);
                  }}>
                    <SendHorizonal className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    </AuthGuard>
  );
}
