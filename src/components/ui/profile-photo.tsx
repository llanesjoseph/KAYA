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
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
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
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        }}
      >
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
          data-ai-hint="user avatar"
        />
      </div>
    </div>
  );
}
