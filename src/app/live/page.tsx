import { AppShell } from '@/components/app-shell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SendHorizonal, Heart } from 'lucide-react';

export default function LivePage() {
  return (
    <AppShell>
      <div className="grid h-[calc(100vh-3.5rem)] grid-cols-1 lg:grid-cols-[1fr_350px]">
        {/* Main video content */}
        <main className="flex flex-col bg-black">
          <div className="flex-1 flex items-center justify-center text-white">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                 <Heart className="w-12 h-12 text-white" />
              </div>
              <h1 className="font-headline text-3xl font-bold">Live Stream Offline</h1>
              <p className="text-muted-foreground mt-2">The creator isn't live right now. Check back later!</p>
            </div>
          </div>
          <div className="p-4 bg-gray-900/50 text-white">
            <div className='flex items-center gap-4'>
                <Avatar className="h-16 w-16 border-4 border-pink-500">
                    <AvatarImage src="https://placehold.co/128x128" data-ai-hint="user avatar" />
                    <AvatarFallback>LS</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="font-headline text-xl font-bold">Live with Next.js</h2>
                    <p className="text-sm">with @livestreamer</p>
                </div>
                <Button className="ml-auto bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    Subscribe
                </Button>
            </div>
          </div>
        </main>
        
        {/* Chat sidebar */}
        <aside className="flex flex-col border-l bg-card">
          <CardHeader>
            <CardTitle className="font-headline">Live Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-4">
             <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/128x128" data-ai-hint="user avatar" />
                </Avatar>
                <div>
                    <span className="font-semibold text-sm">viewer1</span>
                    <p className="text-sm text-muted-foreground">This is awesome!</p>
                </div>
             </div>
             <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/128x128" data-ai-hint="user avatar" />
                </Avatar>
                <div>
                    <span className="font-semibold text-sm text-blue-500">viewer2</span>
                    <p className="text-sm text-muted-foreground">Love this stream! 🔥</p>
                </div>
             </div>
          </CardContent>
          <div className="p-4 border-t">
            <div className="relative">
              <Input placeholder="Send a message" />
              <Button variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2">
                <SendHorizonal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
