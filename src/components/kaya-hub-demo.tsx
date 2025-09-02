"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Section, 
  Heading, 
  Text, 
  Container, 
  Nav, 
  NavItem, 
  FormGroup, 
  Label, 
  Divider, 
  Grid, 
  Spacer 
} from "@/components/ui/kaya-hub"

export function KayaHubDemo() {
  return (
    <Container variant="seasonal-overlay" className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <Section variant="winter" className="text-center">
          <Heading variant="primary" as="h1" className="mb-4">
            Kaya Hub Design System
          </Heading>
          <Text variant="body" className="text-text-winter-secondary">
            A winter-to-spring transition aesthetic representing the cultivation journey
          </Text>
        </Section>

        {/* Navigation Demo */}
        <Section variant="transition">
          <Heading variant="secondary" as="h2" className="mb-4">
            Navigation System
          </Heading>
          <Nav>
            <NavItem href="#" active>Home</NavItem>
            <NavItem href="#">Discover</NavItem>
            <NavItem href="#">Articles</NavItem>
            <NavItem href="#">Events</NavItem>
            <NavItem href="#">Profile</NavItem>
          </Nav>
        </Section>

        {/* Button System Demo */}
        <Section variant="spring">
          <Heading variant="secondary" as="h2" className="mb-4">
            Button System
          </Heading>
          <div className="flex flex-wrap gap-4">
            <Button variant="winter">Winter Button</Button>
            <Button variant="transition">Transition Button</Button>
            <Button variant="spring">Spring Button</Button>
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
          </div>
          <Spacer size="md" />
          <div className="flex flex-wrap gap-4">
            <Button variant="winter" size="sm">Small Winter</Button>
            <Button variant="spring" size="lg">Large Spring</Button>
          </div>
        </Section>

        {/* Card System Demo */}
        <Grid cols={3} gap="lg">
          <Card variant="winter" className="hover-lift">
            <CardHeader>
              <CardTitle>Winter Card</CardTitle>
              <CardDescription>
                Dormant strength and patient waiting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Text variant="body">
                This card represents the winter phase with deep, earthy tones and a sense of quiet preparation.
              </Text>
            </CardContent>
          </Card>

          <Card variant="transition" className="hover-lift">
            <CardHeader>
              <CardTitle>Transition Card</CardTitle>
              <CardDescription>
                The thaw phase between seasons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Text variant="body">
                This card shows the gradual shift from winter dormancy to spring emergence.
              </Text>
            </CardContent>
          </Card>

          <Card variant="spring" className="hover-lift">
            <CardHeader>
              <CardTitle>Spring Card</CardTitle>
              <CardDescription>
                Fresh growth and new possibilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Text variant="body">
                This card embodies the vibrant energy of spring with fresh greens and hopeful tones.
              </Text>
            </CardContent>
          </Card>
        </Grid>

        {/* Badge System Demo */}
        <Section variant="winter">
          <Heading variant="secondary" as="h2" className="mb-4">
            Badge System
          </Heading>
          <div className="flex flex-wrap gap-2">
            <Badge variant="winter">Winter Badge</Badge>
            <Badge variant="transition">Transition Badge</Badge>
            <Badge variant="spring">Spring Badge</Badge>
            <Badge variant="default">Default Badge</Badge>
          </div>
        </Section>

        {/* Form System Demo */}
        <Section variant="spring">
          <Heading variant="secondary" as="h2" className="mb-4">
            Form System
          </Heading>
          <Grid cols={2} gap="lg">
            <FormGroup>
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="Enter your name"
                className="form-control"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="Enter your email"
                className="form-control"
              />
            </FormGroup>
          </Grid>
          <Spacer size="md" />
          <FormGroup>
            <Label htmlFor="message">Message</Label>
            <Input 
              id="message" 
              placeholder="Tell us about your cultivation journey..."
              className="form-control"
            />
          </FormGroup>
        </Section>

        {/* Typography Demo */}
        <Section variant="transition">
          <Heading variant="secondary" as="h2" className="mb-4">
            Typography System
          </Heading>
          <div className="space-y-4">
            <Heading variant="winter" as="h3">Winter Headline</Heading>
            <Heading variant="spring" as="h3">Spring Headline</Heading>
            <Text variant="body">
              This is body text using the JetBrains Mono font family. It represents structure and precision in the design system.
            </Text>
            <Text variant="small">
              This is small text for captions and metadata.
            </Text>
            <Text variant="label">
              This is label text using the Crimson Text serif font.
            </Text>
          </div>
        </Section>

        {/* Atmospheric Effects Demo */}
        <Container variant="spring-glow" className="p-8 rounded-kaya-lg">
          <Heading variant="spring" as="h2" className="mb-4">
            Atmospheric Effects
          </Heading>
          <Text variant="body">
            This container demonstrates the spring glow effect with subtle animations that create a sense of life and growth.
          </Text>
        </Container>

        {/* Divider Demo */}
        <Section variant="winter">
          <Text variant="body">Content above the divider</Text>
          <Divider variant="winter" />
          <Text variant="body">Content below the winter divider</Text>
          <Divider variant="spring" />
          <Text variant="body">Content below the spring divider</Text>
          <Divider variant="transition" />
          <Text variant="body">Content below the transition divider</Text>
        </Section>

        {/* Footer */}
        <Section variant="winter" className="text-center">
          <Text variant="small" className="text-text-muted">
            Kaya Hub Design System - Winter to Spring Transition Aesthetic
          </Text>
        </Section>

      </div>
    </Container>
  )
}