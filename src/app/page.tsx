import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { KayaHubLogo } from '@/components/icons';
import { Users, BookOpen, MessageCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-body text-foreground">
      <header className="sticky top-0 z-50 flex h-20 items-center justify-between bg-background/80 px-4 backdrop-blur-sm md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <KayaHubLogo className="h-10 w-auto" />
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              Sign Up
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex h-[70vh] min-h-[500px] w-full flex-col items-center justify-center overflow-hidden bg-black text-center text-card-foreground">
          <Image
            src="https://placehold.co/1920x1080.png"
            alt="KAYAHUB background"
            layout="fill"
            objectFit="contain"
            className="absolute z-0"
            data-ai-hint="kayahub logo"
          />
          <div className="relative z-10 flex flex-col items-center p-4">
            <h1 className="font-headline text-5xl font-extrabold tracking-tight text-white md:text-7xl">
              Everything Cannabis, Everywhere.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/80 md:text-xl">
              Your central hub to discover, connect, and grow within the
              global cannabis community.
            </p>
            <Link href="/signup" className="mt-8">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground shadow-lg transition-transform hover:scale-105"
              >
                Join KAYAHUB Today
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="mb-12 text-center font-headline text-4xl font-bold">
              The Ultimate Cannabis Platform
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card className="transform text-center transition-transform hover:-translate-y-2 bg-card border-border">
                <CardContent className="p-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent text-accent">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <h3 className="font-headline text-2xl font-semibold">
                    Discover & Learn
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Explore a vast database of strains, products, and educational
                    content from experts.
                  </p>
                </CardContent>
              </Card>
              <Card className="transform text-center transition-transform hover:-translate-y-2 bg-card border-border">
                <CardContent className="p-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent text-accent">
                    <Users className="h-8 w-8" />
                  </div>
                  <h3 className="font-headline text-2xl font-semibold">
                    Connect with Community
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Join discussions, share experiences, and connect with fellow
                    enthusiasts and businesses.
                  </p>
                </CardContent>
              </Card>
              <Card className="transform text-center transition-transform hover:-translate-y-2 bg-card border-border">
                <CardContent className="p-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent text-accent">
                    <MessageCircle className="h-8 w-8" />
                  </div>
                  <h3 className="font-headline text-2xl font-semibold">
                    Stay Informed
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Get the latest news, legal updates, and trends from the
                    cannabis industry.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card">
        <div className="container mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} KAYAHUB. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-sm hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
