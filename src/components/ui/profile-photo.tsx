import Image from 'next/image';
import { cn } from '@/lib/utils';

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
  borderWidth,
}: ProfilePhotoProps) {
  return (
    <div
      className={cn(
        'relative bg-primary',
        className
      )}
      style={{
        width: size,
        height: size,
        clipPath: 'path("M 43 6 L 57 6 L 62 14 L 70 14 L 75 22 L 70 30 L 75 38 L 70 46 L 62 46 L 57 54 L 43 54 L 38 46 L 30 46 L 25 38 L 30 30 L 25 22 L 30 14 L 38 14 Z")',
      }}
    >
      <div
        className="absolute bg-background"
        style={{
          width: `calc(100% - ${borderWidth ? borderWidth * 2 : 0}px)`,
          height: `calc(100% - ${borderWidth ? borderWidth * 2 : 0}px)`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          clipPath: 'path("M 43 6 L 57 6 L 62 14 L 70 14 L 75 22 L 70 30 L 75 38 L 70 46 L 62 46 L 57 54 L 43 54 L 38 46 L 30 46 L 25 38 L 30 30 L 25 22 L 30 14 L 38 14 Z")',
        }}
      >
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover"
          style={{
            clipPath: 'path("M 43 6 L 57 6 L 62 14 L 70 14 L 75 22 L 70 30 L 75 38 L 70 46 L 62 46 L 57 54 L 43 54 L 38 46 L 30 46 L 25 38 L 30 30 L 25 22 L 30 14 L 38 14 Z")',
          }}
          data-ai-hint="user avatar"
        />
      </div>
    </div>
  );
}
