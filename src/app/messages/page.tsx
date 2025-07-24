import { formatDistanceToNow } from 'date-fns';
import { SendHorizonal, Smile } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProfilePhoto } from '@/components/ui/profile-photo';
import { messages } from '@/lib/data';

export default function MessagesPage() {
  const activeChatUser = messages[0].user;

  return (
    <AppShell>
      <div className="grid h-full grid-cols-1 md:grid-cols-[300px_1fr]">
        {/* Conversation List */}
        <div className="flex flex-col border-r bg-card">
          <div className="p-4 border-b">
            <h2 className="font-headline text-2xl font-bold">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 ${
                  msg.id === '1' ? 'bg-muted' : ''
                }`}
              >
                <ProfilePhoto
                  imageUrl={msg.user.avatarUrl}
                  alt={msg.user.name}
                  size={48}
                />
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold truncate">{msg.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(msg.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-muted-foreground truncate">
                      {msg.lastMessage}
                    </p>
                    {msg.unread > 0 && (
                      <Badge className="bg-accent text-accent-foreground">
                        {msg.unread}
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
            <div className="flex items-end gap-3">
              <ProfilePhoto
                imageUrl={activeChatUser.avatarUrl}
                alt={activeChatUser.name}
                size={32}
              />
              <div className="max-w-xs rounded-lg bg-card p-3 shadow-sm">
                <p>Hey, are you free this weekend?</p>
              </div>
            </div>
            <div className="flex items-end gap-3 justify-end">
              <div className="max-w-xs rounded-lg bg-primary text-primary-foreground p-3 shadow-sm">
                <p>I think so! What do you have in mind?</p>
              </div>
              <ProfilePhoto
                imageUrl="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                alt="Current User"
                size={32}
              />
            </div>
          </div>
          <div className="p-4 border-t bg-card">
            <div className="relative">
              <Input placeholder="Type a message..." className="pr-24 h-12" />
              <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-1">
                <Button variant="ghost" size="icon">
                  <Smile className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <SendHorizonal className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
