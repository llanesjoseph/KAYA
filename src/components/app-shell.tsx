'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import {
  Clapperboard,
  Compass,
  Home,
  MessageCircle,
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
import { SidebarTrigger } from '@/components/ui/sidebar';

const navItems = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/discover', icon: Compass, label: 'Discover' },
  { href: '/messages', icon: MessageCircle, label: 'Messages' },
  { href: '/live', icon: Clapperboard, label: 'Live' },
];

const bottomNavItems = [
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

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
                 {bottomNavItems.map(item => (
                <Link href={item.href} key={item.href}>
                  <DropdownMenuItem>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                </Link>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
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
              <Button
                variant="ghost"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <ProfilePhoto
                  imageUrl="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  alt="User"
                  size={32}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
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
