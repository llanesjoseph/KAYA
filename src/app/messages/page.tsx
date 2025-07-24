import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { SendHorizonal, Smile } from 'lucide-react';

import { AppShell } from '@/components/app-shell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { messages } from '@/lib/data';

export default function MessagesPage() {
  const activeChatUser = messages[0].user;
  
  return (
    <AppShell>
      <div className="grid h-[calc(100vh-3.5rem)] grid-cols-1 md:grid-cols-[300px_1fr]">
        {/* Conversation List */}
        <div className="flex flex-col border-r bg-card">
          <div className="p-4 border-b">
            <h2 className="font-headline text-2xl font-bold">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 ${
                  msg.id === '1' ? 'bg-muted' : ''
                }`}
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={msg.user.avatarUrl} alt={msg.user.name} data-ai-hint="user avatar" />
                  <AvatarFallback>{msg.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold truncate">{msg.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-muted-foreground truncate">{msg.lastMessage}</p>
                    {msg.unread > 0 && (
                       <Badge className="bg-[#8A2BE2] text-white">{msg.unread}</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat Window */}
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-4 p-4 border-b">
            <Avatar>
              <AvatarImage src={activeChatUser.avatarUrl} alt={activeChatUser.name} data-ai-hint="user avatar" />
              <AvatarFallback>{activeChatUser.name[0]}</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">{activeChatUser.name}</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/20">
              <div className="flex items-end gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activeChatUser.avatarUrl} alt={activeChatUser.name} data-ai-hint="user avatar" />
                  </Avatar>
                  <div className="max-w-xs rounded-lg bg-card p-3 shadow-sm">
                      <p>Hey, are you free this weekend?</p>
                  </div>
              </div>
               <div className="flex items-end gap-3 justify-end">
                  <div className="max-w-xs rounded-lg bg-primary text-primary-foreground p-3 shadow-sm">
                      <p>I think so! What do you have in mind?</p>
                  </div>
                   <Avatar className="h-8 w-8">
                     <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Current User" data-ai-hint="user avatar"/>
                   </Avatar>
              </div>
          </div>
          <div className="p-4 border-t bg-card">
              <div className="relative">
                  <Input placeholder="Type a message..." className="pr-24 h-12" />
                  <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-1">
                      <Button variant="ghost" size="icon"><Smile className="h-5 w-5"/></Button>
                      <Button size="icon" className="bg-[#8A2BE2] text-white hover:bg-[#7f26d1]">
                        <SendHorizonal className="h-5 w-5"/>
                      </Button>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
