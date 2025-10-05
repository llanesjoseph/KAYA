'use client';
import dynamic from 'next/dynamic';

// Social components - heavy with state management
export const PostCard = dynamic(() => import('@/components/social/post-card').then(mod => ({ default: mod.PostCard })), {
  loading: () => <div className="h-48 animate-pulse bg-gray-200 rounded-lg" />,
});

export const CreatePostForm = dynamic(() => import('@/components/social/create-post-form').then(mod => ({ default: mod.CreatePostForm })), {
  loading: () => <div className="h-32 animate-pulse bg-gray-200 rounded-lg" />,
});

export const CommentsSection = dynamic(() => import('@/components/social/comments-section').then(mod => ({ default: mod.CommentsSection })), {
  loading: () => <div className="space-y-2"><div className="h-16 animate-pulse bg-gray-200 rounded" /></div>,
});

// Bug reporter - only needed for interactions, client-side only
export const BugReporter = dynamic(() => import('@/components/bug-reporter'), {
  ssr: false,
  loading: () => null,
});

// Charts - recharts is heavy (146KB), only load when needed
export const ChartContainer = dynamic(() => import('@/components/ui/chart').then(mod => ({ default: mod.ChartContainer })), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-gray-200 rounded-lg" />,
});

export const ChartTooltip = dynamic(() => import('@/components/ui/chart').then(mod => ({ default: mod.ChartTooltip })), {
  ssr: false,
});

export const ChartTooltipContent = dynamic(() => import('@/components/ui/chart').then(mod => ({ default: mod.ChartTooltipContent })), {
  ssr: false,
});

// Heavy UI components that are only needed on certain pages
export const Carousel = dynamic(() => import('@/components/ui/carousel').then(mod => ({
  default: mod.Carousel,
})), {
  loading: () => <div className="h-64 animate-pulse bg-gray-200 rounded-lg" />,
});

export const CarouselContent = dynamic(() => import('@/components/ui/carousel').then(mod => ({ default: mod.CarouselContent })));
export const CarouselItem = dynamic(() => import('@/components/ui/carousel').then(mod => ({ default: mod.CarouselItem })));
export const CarouselPrevious = dynamic(() => import('@/components/ui/carousel').then(mod => ({ default: mod.CarouselPrevious })));
export const CarouselNext = dynamic(() => import('@/components/ui/carousel').then(mod => ({ default: mod.CarouselNext })));

// Date picker - heavy with date-fns
export const Calendar = dynamic(() => import('@/components/ui/calendar').then(mod => ({ default: mod.Calendar })), {
  ssr: false,
  loading: () => <div className="h-64 w-64 animate-pulse bg-gray-200 rounded-lg" />,
});

// Image cropper - only needed in specific flows
export const ImageCropper = dynamic(() => import('react-easy-crop'), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-gray-200 rounded-lg" />,
});
