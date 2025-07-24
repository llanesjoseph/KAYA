import Image from 'next/image';
import type { Story } from '@/lib/data';

interface StoryAvatarProps {
  story: Story;
}

export function StoryAvatar({ story }: StoryAvatarProps) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className="relative w-[72px] h-[80px] flex items-center justify-center"
        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
      >
        <div className="absolute inset-0 bg-primary"
             style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
        ></div>
        <div className="relative w-[68px] h-[76px] bg-background"
             style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
        >
          <Image
            src={story.user.avatarUrl}
            alt={story.user.name}
            width={64}
            height={64}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover w-[64px] h-[64px]"
            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
            data-ai-hint="user avatar"
          />
        </div>
      </div>
      <p className="text-xs font-medium">{story.user.name}</p>
    </div>
  );
}
