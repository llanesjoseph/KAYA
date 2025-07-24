import Image from 'next/image';
import type { Story } from '@/lib/data';

interface StoryAvatarProps {
  story: Story;
}

export function StoryAvatar({ story }: StoryAvatarProps) {
  const organicShapeClipPath = 'path("M48.2,1.8C68.5,5.8,78.6,24.3,80,45.4s-11.4,41-31.8,42.8S6.6,83.1,2.2,62.2,12.5,12.3,27.9,4.2,39.3,-0.1,48.2,1.8Z")';

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className="relative w-[82px] h-[90px] flex items-center justify-center"
      >
        <div
            className="absolute inset-0 bg-primary"
            style={{ clipPath: organicShapeClipPath }}
        ></div>
        <div
            className="relative w-[76px] h-[84px] bg-background"
            style={{ clipPath: organicShapeClipPath }}
        >
          <Image
            src={story.user.avatarUrl}
            alt={story.user.name}
            fill
            className="object-cover"
            style={{ clipPath: organicShapeClipPath }}
            data-ai-hint="user avatar"
          />
        </div>
      </div>
      <p className="text-xs font-medium">{story.user.name}</p>
    </div>
  );
}
