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
      className={cn('hex-flower relative bg-primary', className)}
      style={{
        width: size,
        height: size,
        borderWidth: borderWidth ? `${borderWidth}px` : undefined,
        borderColor: borderWidth ? 'hsl(var(--primary))' : undefined,
      }}
    >
      <div
        className="hex-flower absolute inset-0 bg-background"
        style={{
          width: size,
          height: size,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="hex-flower object-cover"
          data-ai-hint="user avatar"
        />
      </div>
    </div>
  );
}
