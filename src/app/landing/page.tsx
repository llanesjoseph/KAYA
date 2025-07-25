import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { KayaLogo } from '@/components/icons';
import { MessageCircle, Users, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-body text-foreground">
      <header className="sticky top-0 z-50 flex h-20 items-center justify-between bg-background/80 px-4 backdrop-blur-sm md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <KayaLogo className="h-10 w-auto" />
          <span className="font-headline text-2xl font-bold">Kaya</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              Sign Up
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex h-[70vh] min-h-[500px] w-full flex-col items-center justify-center overflow-hidden bg-gray-900 text-center text-white">
          <Image
            src="https://placehold.co/1920x1080.png"
            alt="Enchanted forest background"
            layout="fill"
            objectFit="cover"
            className="absolute z-0 opacity-30"
            data-ai-hint="enchanted forest"
          />
          <div className="relative z-10 flex flex-col items-center p-4">
            <h1 className="font-headline text-5xl font-extrabold tracking-tight md:text-7xl">
              Your Digital Sacred Grove
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-300 md:text-xl">
              Reconnect with what matters. Share your journey, find your tribe,
              and grow together in a space built for authentic connection.
            </p>
            <Link href="/signup" className="mt-8">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transition-transform hover:scale-105"
              >
                Join the Grove
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="mb-12 text-center font-headline text-4xl font-bold">
              A New Kind of Social Media
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card className="transform text-center transition-transform hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <MessageCircle className="h-8 w-8" />
                  </div>
                  <h3 className="font-headline text-2xl font-semibold">
                    Connect & Share
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Share your stories, posts, and live moments in a vibrant and
                    supportive feed.
                  </p>
                </CardContent>
              </Card>
              <Card className="transform text-center transition-transform hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Users className="h-8 w-8" />
                  </div>
                  <h3 className="font-headline text-2xl font-semibold">
                    Discover Your Tribe
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Find trending topics and connect with people who share your
                    passions and interests.
                  </p>
                </CardContent>
              </Card>
              <Card className="transform text-center transition-transform hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <h3 className="font-headline text-2xl font-semibold">
                    AI-Powered Moderation
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Our intelligent systems ensure a safe and positive
                    environment for everyone.
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
            &copy; {new Date().getFullYear()} Kaya. All rights reserved.
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
