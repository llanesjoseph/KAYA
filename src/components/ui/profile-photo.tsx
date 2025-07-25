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
  borderWidth = 2,
}: ProfilePhotoProps) {
  const id = useId();
  const clipPathId = `hex-clip-${id}`;
  const imagePatternId = `hex-image-${id}`;

  const hexPath =
    'M 43 6 L 57 6 L 62 14 L 70 14 L 75 22 L 70 30 L 75 38 L 70 46 L 62 46 L 57 54 L 43 54 L 38 46 L 30 46 L 25 38 L 30 30 L 25 22 L 30 14 L 38 14 Z';

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
        <pattern
          id={imagePatternId}
          patternUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <image
            href={imageUrl}
            x="0"
            y="0"
            width="1"
            height="1"
            preserveAspectRatio="xMidYMid slice"
          />
        </pattern>
      </defs>
      
      {/* 3D Effect Drop Shadow */}
      <path 
        d={hexPath} 
        fill="hsl(var(--primary))"
        transform="translate(2, 2)"
        style={{ opacity: 0.5 }}
      />
      
      <rect
        width="80"
        height="60"
        fill={`url(#${imagePatternId})`}
        clipPath={`url(#${clipPathId})`}
      />
      <path
        d={hexPath}
        fill="none"
        className="stroke-primary"
        strokeWidth={borderWidth * 2}
      />
    </svg>
  );
}
