import { cn } from '@/lib/utils';
import { useId } from 'react';

interface ProfilePhotoProps {
  imageUrl: string;
  alt?: string;
  size: number;
  className?: string;
  borderWidth?: number;
}

export function ProfilePhoto({
  imageUrl,
  alt = 'Profile photo',
  size,
  className,
  borderWidth = 1.75,
}: ProfilePhotoProps) {
  const id = useId();
  const clipPathId = `hex-clip-${id}`;
  const imagePatternId = `hex-image-${id}`;
  const borderGradientId = `border-gradient-${id}`;

  const hexPath = "M 43 6 L 57 6 L 62 14 L 70 14 L 75 22 L 70 30 L 75 38 L 70 46 L 62 46 L 57 54 L 43 54 L 38 46 L 30 46 L 25 38 L 30 30 L 25 22 L 30 14 L 38 14 Z";
  const shadowPath = "M 45 8 L 59 8 L 64 16 L 72 16 L 77 24 L 72 32 L 77 40 L 72 48 L 64 48 L 59 56 L 45 56 L 40 48 L 32 48 L 27 40 L 32 32 L 27 24 L 32 16 L 40 16 Z"
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 60"
      width={size}
      height={size}
      className={cn(className)}
      data-ai-hint="user avatar"
    >
      <defs>
        <clipPath id={clipPathId}>
          <path d={hexPath} />
        </clipPath>
        
        <pattern id={imagePatternId} patternUnits="objectBoundingBox" width="1" height="1">
          <image href={imageUrl} x="0" y="0" width="1" height="1" preserveAspectRatio="xMidYMid slice"/>
        </pattern>
        
        <linearGradient id={borderGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))' }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))' }} />
        </linearGradient>
      </defs>
      
      <path
        d={shadowPath}
        fill="none"
        stroke="rgba(0, 0, 0, 0.25)"
        strokeWidth={borderWidth * 2.5}
      />
      
      <rect width="80" height="60" fill={`url(#${imagePatternId})`} clipPath={`url(#${clipPathId})`}/>
      
      <path
        d={hexPath}
        fill="none"
        stroke={`url(#${borderGradientId})`}
        strokeWidth={borderWidth}
      />
    </svg>
  );
}
