'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode } from 'react';
import {
  Clapperboard,
  Compass,
  Home,
  MessageCircle,
  Newspaper,
  Briefcase,
  Search,
  Settings,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { KayaHubLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ProfilePhoto } from '@/components/ui/profile-photo';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Bell } from 'lucide-react';
import { listNotifications, markAllNotificationsRead, subscribeNotifications, subscribeUnreadCount, markNotificationRead, deleteNotification, listNotificationsPaged } from '@/lib/db';
import { useEffect, useState } from 'react';


const navItems = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/discover', icon: Compass, label: 'Discover' },
  { href: '/articles', icon: Newspaper, label: 'Articles' },
  { href: '/messages', icon: MessageCircle, label: 'Messages' },
  { href: '/live', icon: Clapperboard, label: 'Live' },
  { href: '/jobs', icon: Briefcase, label: 'Jobs' },
];

const bottomNavItems = [
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);
  const [notifCursor, setNotifCursor] = useState<any>(undefined);
  const [loadingMoreNotifs, setLoadingMoreNotifs] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
      router.push('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    let unsub: (() => void) | undefined;
    let unsubUnread: (() => void) | undefined;
    (async () => {
      if (!user) return;
      try {
        unsub = subscribeNotifications(user.uid, (items) => setNotifications(items), 10);
        unsubUnread = subscribeUnreadCount(user.uid, (count) => setUnread(count));
      } catch {}
    })();
    return () => { if (unsub) unsub(); if (unsubUnread) unsubUnread(); };
  }, [user]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2"
              >
                <KayaHubLogo className="h-8 w-auto" />
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Navigation</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {navItems.map(item => (
                <Link href={item.href} key={item.href}>
                  <DropdownMenuItem>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                </Link>
              ))}
              <DropdownMenuSeparator />
              <Link href="/companies/new"><DropdownMenuItem>Create Company</DropdownMenuItem></Link>
              <Link href="/events/new"><DropdownMenuItem>Create Event</DropdownMenuItem></Link>
              <Link href="/jobs/new"><DropdownMenuItem>Create Job</DropdownMenuItem></Link>
               <DropdownMenuSeparator />
                 {bottomNavItems.map(item => (
                <Link href={item.href} key={item.href}>
                  <DropdownMenuItem>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                </Link>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-card pl-8 md:w-[200px] lg:w-[320px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 relative">
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] px-1.5 py-0.5">
                    {unread > 99 ? '99+' : unread}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 && (
                <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
              )}
              {notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="flex items-center justify-between gap-2">
                  <Link href={n.type === 'like' || n.type === 'comment' ? `/posts/${n.refId}` : n.type === 'follow' ? `/u/${n.actorId || ''}` : n.type === 'message' ? `/messages` : '#'} className="flex-1 truncate">
                    <span className={`${n.read ? 'text-muted-foreground' : 'font-semibold'}`}>{n.type}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{new Date(n.createdAt?.toDate?.() || Date.now()).toLocaleString()}</span>
                  </Link>
                  {!n.read && (
                    <Button size="sm" variant="ghost" onClick={async (e) => { e.preventDefault(); try { await markNotificationRead(n.id); } catch {} }}>Read</Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={async (e) => { e.preventDefault(); try { await deleteNotification(n.id); } catch {} }}>Dismiss</Button>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={async () => {
                if (!user) return;
                await markAllNotificationsRead(user.uid);
                const n = await listNotifications(user.uid, 10);
                setNotifications(n);
              }}>Mark all read</DropdownMenuItem>
              <DropdownMenuItem onClick={async () => {
                if (!user || loadingMoreNotifs) return;
                setLoadingMoreNotifs(true);
                try {
                  const { items, nextCursor } = await listNotificationsPaged(user.uid, 20, notifCursor);
                  setNotifications(prev => [...prev, ...items]);
                  setNotifCursor(nextCursor);
                } finally {
                  setLoadingMoreNotifs(false);
                }
              }}>{loadingMoreNotifs ? 'Loading...' : 'Load more'}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="overflow-hidden rounded-full"
                disabled={loading || !user}
              >
                <ProfilePhoto
                  imageUrl={user?.photoURL || "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
                  alt={user?.displayName || "User"}
                  size={32}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.displayName || 'My Account'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/profile">
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <Link href="/settings">
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 overflow-auto p-4">
          <div className="container mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
