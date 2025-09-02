# Kaya Hub Design System

## Overview

The Kaya Hub Design System captures the intersection between winter dormancy and spring emergence - representing the cultivation journey from patient preparation to vibrant growth. The visual language progresses from deep, earthy winter tones to fresh, hopeful spring greens, creating a sense of natural seasonal transition throughout the interface.

## Quick Start

### Using Kaya Hub Components

```tsx
import { 
  Section, 
  Heading, 
  Text, 
  Container, 
  Button, 
  Card, 
  Badge 
} from '@/components/ui/kaya-hub'

// Basic usage
<Section variant="winter">
  <Heading variant="primary">Winter Section</Heading>
  <Text variant="body">Content goes here</Text>
</Section>

// Spring variant
<Section variant="spring">
  <Heading variant="spring">Spring Section</Heading>
  <Text variant="body">Fresh growth content</Text>
</Section>
```

### Using Enhanced UI Components

```tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Kaya Hub button variants
<Button variant="winter">Winter Button</Button>
<Button variant="spring">Spring Button</Button>
<Button variant="transition">Transition Button</Button>

// Kaya Hub card variants
<Card variant="winter">Winter Card</Card>
<Card variant="spring">Spring Card</Card>
<Card variant="transition">Transition Card</Card>

// Kaya Hub badge variants
<Badge variant="winter">Winter Badge</Badge>
<Badge variant="spring">Spring Badge</Badge>
<Badge variant="transition">Transition Badge</Badge>
```

## Color Palette

### Winter Colors (Dormancy Phase)
- `winter-bark`: #4c4134 - Primary dark color for backgrounds, headers
- `frozen-earth`: #3e3529 - Deep background color
- `dead-leaves`: #5a4d3c - Accent color for borders and highlights
- `winter-stone`: #434a3a - Supporting neutral color

### Spring Colors (Emergence Phase)
- `new-shoots`: #6a8c5a - Primary green for active elements
- `spring-moss`: #7a9973 - Secondary green for interactive elements
- `fresh-growth`: #8ab083 - Accent green for success states
- `morning-dew`: #9bc49b - Light green for subtle highlights

### Transition Colors (Thaw Phase)
- `thaw-brown`: #57664a - Bridge color between winter and spring
- `wet-earth`: #574d3f - Warmer brown for transitional backgrounds
- `early-growth`: #6b7a5f - Muted green-brown for emerging elements

### Text Colors
- `text-winter`: #a8a089 - Main body text in winter sections
- `text-spring`: rgba(152, 184, 156, 0.9) - Main body text in spring sections
- `text-winter-headline`: #a89573 - Headers in winter sections
- `text-spring-headline`: #98b89c - Headers in spring sections

## Typography

### Font Families
- **Serif**: Crimson Text (for headlines and elegant elements)
- **Monospace**: JetBrains Mono (for body text and technical elements)

### Typography Classes
```tsx
<Heading variant="primary">Main Headlines</Heading>
<Heading variant="secondary">Secondary Headlines</Heading>
<Heading variant="winter">Winter Headlines</Heading>
<Heading variant="spring">Spring Headlines</Heading>

<Text variant="body">Body text</Text>
<Text variant="small">Small text</Text>
<Text variant="label">Label text</Text>
```

## Component System

### Sections
```tsx
<Section variant="winter">Winter-themed section</Section>
<Section variant="spring">Spring-themed section</Section>
<Section variant="transition">Transition-themed section</Section>
```

### Buttons
```tsx
<Button variant="winter" size="sm">Small Winter</Button>
<Button variant="spring" size="lg">Large Spring</Button>
<Button variant="transition">Transition Button</Button>
```

### Cards
```tsx
<Card variant="winter" className="hover-lift">
  <CardHeader>
    <CardTitle>Winter Card</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Badges
```tsx
<Badge variant="winter">Winter Badge</Badge>
<Badge variant="spring">Spring Badge</Badge>
<Badge variant="transition">Transition Badge</Badge>
```

### Forms
```tsx
<FormGroup>
  <Label htmlFor="name">Name</Label>
  <Input id="name" placeholder="Enter name" />
</FormGroup>
```

## Layout Components

### Container with Atmospheric Effects
```tsx
<Container variant="seasonal-overlay">
  <Container variant="spring-glow">
    Content with atmospheric effects
  </Container>
</Container>
```

### Grid System
```tsx
<Grid cols={3} gap="lg">
  <Card variant="winter">Card 1</Card>
  <Card variant="transition">Card 2</Card>
  <Card variant="spring">Card 3</Card>
</Grid>
```

### Navigation
```tsx
<Nav>
  <NavItem href="/" active>Home</NavItem>
  <NavItem href="/about">About</NavItem>
  <NavItem href="/contact">Contact</NavItem>
</Nav>
```

## Spacing System

Use the Kaya Hub spacing scale:
- `kaya-xs`: 4px
- `kaya-sm`: 8px
- `kaya-md`: 12px
- `kaya-lg`: 20px
- `kaya-xl`: 30px
- `kaya-xxl`: 50px

```tsx
<Spacer size="lg" />
<div className="p-kaya-md m-kaya-lg">
  Content with Kaya Hub spacing
</div>
```

## Border Radius

- `kaya-sm`: 2px (buttons, badges, form inputs)
- `kaya-md`: 3px (cards, sections)
- `kaya-lg`: 6px (major containers, headers)

## Animations

### Available Animations
- `spring-awakening`: 25s seasonal transition effect
- `spring-glow`: 8s subtle glow effect
- `seasonal-progress`: 12s progress bar animation
- `shimmer`: 0.6s shimmer effect on hover

### Usage
```tsx
<div className="animate-spring-awakening">
  Seasonal content
</div>

<Button className="shimmer">
  Button with shimmer effect
</Button>
```

## Utility Classes

### Hover Effects
```tsx
<div className="hover-lift">
  Lifts on hover
</div>

<div className="shimmer">
  Shimmer effect on hover
</div>
```

### Atmospheric Effects
```tsx
<div className="seasonal-overlay">
  Seasonal atmospheric overlay
</div>

<div className="spring-glow">
  Spring glow effect
</div>
```

## Best Practices

### 1. Seasonal Progression
Use the seasonal variants to create a sense of progression:
- Start with `winter` for foundational content
- Use `transition` for intermediate states
- End with `spring` for active/success states

### 2. Consistent Typography
- Use `Heading` components for all headings
- Use `Text` components for body content
- Match seasonal variants with content context

### 3. Atmospheric Layering
- Use `Container` with atmospheric effects sparingly
- Layer effects for depth (seasonal-overlay + spring-glow)
- Maintain readability with proper contrast

### 4. Animation Guidelines
- Use animations to enhance, not distract
- Respect reduced motion preferences
- Keep animations subtle and purposeful

## Migration Guide

### From Existing Components
1. Replace standard buttons with Kaya Hub variants:
   ```tsx
   // Before
   <Button variant="default">Click me</Button>
   
   // After
   <Button variant="spring">Click me</Button>
   ```

2. Update cards with seasonal variants:
   ```tsx
   // Before
   <Card>Content</Card>
   
   // After
   <Card variant="winter">Content</Card>
   ```

3. Use Kaya Hub typography:
   ```tsx
   // Before
   <h1 className="text-2xl font-bold">Title</h1>
   
   // After
   <Heading variant="primary">Title</Heading>
   ```

## Design System Demo

Visit `/design-system` to see all components in action with live examples and code snippets.

## Contributing

When adding new components or features:

1. Follow the seasonal progression theme
2. Use the established color palette
3. Maintain typography consistency
4. Add appropriate hover states and animations
5. Include seasonal variants where applicable
6. Update this documentation

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- CSS Custom Properties support
- Reduced motion media query support
- Backdrop filter support (optional enhancement)