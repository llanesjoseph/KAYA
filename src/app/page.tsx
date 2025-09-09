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
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-black/10 backdrop-blur-md px-6 md:px-12">
        <Link href="/" className="flex items-center">
          <Image
            src="https://res.cloudinary.com/dr0jtjwlh/image/upload/v1757445053/kayahub_logo_ICON_fx9zh2.jpg"
            alt="KayaHub Icon"
            width={40}
            height={40}
            className="h-8 w-8 rounded-full"
            priority
          />
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">Login</Button>
          </Link>
          <Link href="/signup">
            <Button variant="spring" size="sm" className="hover:scale-105 transition-all">
              Sign Up
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Dramatic Hero Section with Split Layout */}
        <section className="relative flex min-h-screen w-full overflow-hidden bg-gradient-to-br from-winter-bark via-dormant-dark to-black">
          {/* Left Content Area */}
          <div className="relative z-10 flex flex-col justify-center w-full lg:w-1/2 px-8 md:px-16 lg:px-20 py-20">
            {/* Logo Integration */}
            <div className="mb-8">
              <Image
                src="https://res.cloudinary.com/dr0jtjwlh/image/upload/v1757445060/KayaHub_260_x_100_xedbvj.png"
                alt="KayaHub Logo"
                width={260}
                height={100}
                className="w-auto h-12 md:h-16 lg:h-20 filter drop-shadow-2xl"
                priority
              />
            </div>

            <Heading variant="primary" as="h1" className="mb-6 text-left text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight tracking-tight">
              The Ultimate<br />
              <span className="bg-gradient-to-r from-new-shoots via-spring-bud to-winter-bark bg-clip-text text-transparent">
                Cannabis<br />Platform
              </span>
            </Heading>

            <Text variant="body" className="mb-10 text-left text-white/90 max-w-lg text-lg md:text-xl leading-relaxed">
              Discover, connect, and grow with the cannabis community. From winter dormancy to spring emergence, 
              <span className="text-white/70 block mt-2">cultivate your journey with us.</span>
            </Text>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/signup">
                <Button
                  variant="spring"
                  size="lg"
                  className="px-10 py-4 text-lg font-bold shadow-2xl transition-all hover:scale-105 bg-gradient-to-r from-new-shoots to-spring-bud border border-new-shoots/30"
                >
                  Join KAYAHUB Today
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="lg"
                  className="px-10 py-4 text-lg font-semibold text-white border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm transition-all hover:scale-105"
                >
                  Explore Platform
                </Button>
              </Link>
            </div>

            {/* Stats or Features Preview */}
            <div className="flex gap-8 text-white/70 text-sm">
              <div>
                <div className="text-2xl font-bold text-new-shoots">10K+</div>
                <div>Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-spring-bud">500+</div>
                <div>Strains Cataloged</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-winter-bark">24/7</div>
                <div>Community Support</div>
              </div>
            </div>
          </div>

          {/* Right Visual Area */}
          <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-new-shoots/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-spring-bud/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-thaw-brown/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>
            
            {/* Central Visual Element */}
            <div className="relative z-10 w-80 h-80 flex items-center justify-center">
              <div className="w-full h-full border-4 border-new-shoots/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="w-60 h-60 border-2 border-spring-bud/40 rounded-full flex items-center justify-center">
                  <div className="w-40 h-40 bg-gradient-to-br from-new-shoots/20 to-spring-bud/20 rounded-full flex items-center justify-center">
                    <div className="text-6xl">🌿</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Background Elements */}
          <div className="absolute inset-0 lg:hidden opacity-10">
            <div className="absolute top-1/4 right-1/4 w-60 h-60 bg-new-shoots/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 left-1/4 w-52 h-52 bg-spring-bud/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
        </section>

        {/* Full Height Features Section */}
        <section className="min-h-screen py-24 md:py-32 bg-gradient-to-b from-background via-muted/50 to-background relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.1) 0%, transparent 50%), 
                               radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)`
            }}></div>
          </div>

          <div className="container mx-auto max-w-8xl px-6 relative z-10 h-full flex flex-col justify-center">
            <div className="text-center mb-24">
              <Heading variant="primary" as="h2" className="mb-8 text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight bg-gradient-to-r from-winter-bark via-thaw-brown to-new-shoots bg-clip-text text-transparent">
                Everything you need,<br />all in one place.
              </Heading>
              <Text variant="body" className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                A comprehensive ecosystem designed for the modern cannabis community
              </Text>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-20 mb-24">
              <Card variant="winter" className="group text-center hover-lift border-2 border-border/30 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4 hover:rotate-1 bg-gradient-to-br from-background to-muted/20">
                <CardContent className="p-12 md:p-16 h-full flex flex-col justify-center">
                  <div className="mx-auto mb-8 flex h-24 w-24 md:h-32 md:w-32 items-center justify-center rounded-full bg-gradient-to-br from-winter-bark/20 to-winter-bark/10 text-winter-bark border-3 border-winter-bark/30 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <BookOpen className="h-12 w-12 md:h-16 md:w-16" />
                  </div>
                  <Heading variant="secondary" as="h3" className="text-2xl md:text-3xl lg:text-4xl font-black mb-6">
                    Discover & Learn
                  </Heading>
                  <Text variant="body" className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    Explore a vast database of strains, products, and educational content from industry experts and experienced cultivators.
                  </Text>
                </CardContent>
              </Card>

              <Card variant="transition" className="group text-center hover-lift border-2 border-border/30 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4 hover:-rotate-1 bg-gradient-to-br from-background to-muted/20">
                <CardContent className="p-12 md:p-16 h-full flex flex-col justify-center">
                  <div className="mx-auto mb-8 flex h-24 w-24 md:h-32 md:w-32 items-center justify-center rounded-full bg-gradient-to-br from-thaw-brown/20 to-thaw-brown/10 text-thaw-brown border-3 border-thaw-brown/30 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <Users className="h-12 w-12 md:h-16 md:w-16" />
                  </div>
                  <Heading variant="secondary" as="h3" className="text-2xl md:text-3xl lg:text-4xl font-black mb-6">
                    Connect with Community
                  </Heading>
                  <Text variant="body" className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    Join discussions, share experiences, and connect with fellow enthusiasts, growers, and cannabis businesses worldwide.
                  </Text>
                </CardContent>
              </Card>

              <Card variant="spring" className="group text-center hover-lift border-2 border-border/30 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4 hover:rotate-1 bg-gradient-to-br from-background to-muted/20">
                <CardContent className="p-12 md:p-16 h-full flex flex-col justify-center">
                  <div className="mx-auto mb-8 flex h-24 w-24 md:h-32 md:w-32 items-center justify-center rounded-full bg-gradient-to-br from-new-shoots/20 to-new-shoots/10 text-new-shoots border-3 border-new-shoots/30 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <MessageCircle className="h-12 w-12 md:h-16 md:w-16" />
                  </div>
                  <Heading variant="secondary" as="h3" className="text-2xl md:text-3xl lg:text-4xl font-black mb-6">
                    Stay Informed
                  </Heading>
                  <Text variant="body" className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    Get the latest news, legal updates, market trends, and breakthrough research from the rapidly evolving cannabis industry.
                  </Text>
                </CardContent>
              </Card>
            </div>

            {/* Additional CTA Section */}
            <div className="text-center">
              <Link href="/signup">
                <Button
                  variant="spring"
                  size="lg"
                  className="px-12 py-4 text-xl md:text-2xl font-bold shadow-xl transition-all hover:scale-105 hover:shadow-2xl bg-gradient-to-r from-new-shoots to-spring-bud border-2 border-white/20"
                >
                  Start Your Journey Today
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/30">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Text variant="small" className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} KAYAHUB. All rights reserved.
          </Text>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
