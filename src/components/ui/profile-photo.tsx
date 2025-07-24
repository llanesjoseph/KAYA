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
        'hex-flower',
        className
      )}
      style={{
        width: size,
        height: size,
      }}
    >
      <div
        className="absolute bg-background hex-flower"
        style={{
          width: `calc(100% - ${borderWidth ? borderWidth * 2 : 0}px)`,
          height: `calc(100% - ${borderWidth ? borderWidth * 2 : 0}px)`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover hex-flower"
          data-ai-hint="user avatar"
        />
      </div>
    </div>
  );
}
