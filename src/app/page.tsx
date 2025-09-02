import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { KayaHubLogo } from '@/components/icons';
import { Users, BookOpen, MessageCircle } from 'lucide-react';
import { Container, Section, Heading, Text } from '@/components/ui/kaya-hub';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-body text-foreground">
      <header className="sticky top-0 z-50 flex h-20 items-center justify-between bg-background/80 px-4 backdrop-blur-sm md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <KayaHubLogo className="h-10 w-auto" />
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/design-system">
            <Button variant="winter" size="sm">Design System</Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/signup">
            <Button variant="spring" className="hover:scale-105 transition-transform">
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
            fill
            style={{ objectFit: 'cover' }}
            className="absolute z-0 opacity-30"
            data-ai-hint="kayahub logo"
            priority
          />
          <div className="relative z-10 flex flex-col items-center p-4">
            <Heading variant="primary" as="h2" className="mb-12 text-center heading-spring">
              The Ultimate Cannabis Platform
            </Heading>
            <Text variant="body" className="mb-8 text-center text-text-spring-secondary max-w-2xl">
              Discover, connect, and grow with the cannabis community. From winter dormancy to spring emergence, 
              cultivate your journey with Kaya Hub.
            </Text>
            <Link href="/signup" className="mt-8">
              <Button
                variant="spring"
                size="lg"
                className="shadow-lg transition-transform hover:scale-105 shimmer"
              >
                Join KAYAHUB Today
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <Container variant="seasonal-overlay" className="py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <Heading variant="primary" as="h2" className="mb-12 text-center heading-winter">
              Everything you need, all in one place.
            </Heading>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card variant="winter" className="text-center hover-lift">
                <CardContent className="p-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-winter-bark text-winter-bark">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <Heading variant="secondary" as="h3" className="heading-winter">
                    Discover & Learn
                  </Heading>
                  <Text variant="body" className="mt-2 text-text-winter-secondary">
                    Explore a vast database of strains, products, and educational
                    content from experts.
                  </Text>
                </CardContent>
              </Card>
              <Card variant="transition" className="text-center hover-lift">
                <CardContent className="p-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-thaw-brown text-thaw-brown">
                    <Users className="h-8 w-8" />
                  </div>
                  <Heading variant="secondary" as="h3" className="heading-winter">
                    Connect with Community
                  </Heading>
                  <Text variant="body" className="mt-2 text-text-winter-secondary">
                    Join discussions, share experiences, and connect with fellow
                    enthusiasts and businesses.
                  </Text>
                </CardContent>
              </Card>
              <Card variant="spring" className="text-center hover-lift">
                <CardContent className="p-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-new-shoots text-new-shoots">
                    <MessageCircle className="h-8 w-8" />
                  </div>
                  <Heading variant="secondary" as="h3" className="heading-spring">
                    Stay Informed
                  </Heading>
                  <Text variant="body" className="mt-2 text-text-spring-secondary">
                    Get the latest news, legal updates, and trends from the
                    cannabis industry.
                  </Text>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </main>

      <Section variant="winter" className="border-t">
        <div className="container mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
          <Text variant="small" className="text-text-muted">
            &copy; {new Date().getFullYear()} KAYAHUB. All rights reserved.
          </Text>
          <div className="flex gap-4">
            <Link href="#" className="text-small text-text-winter-secondary hover:text-text-winter-headline transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-small text-text-winter-secondary hover:text-text-winter-headline transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
