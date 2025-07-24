import Image from 'next/image';
import type { Story } from '@/lib/data';

interface StoryAvatarProps {
  story: Story;
}

export function StoryAvatar({ story }: StoryAvatarProps) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative rounded-full p-1 bg-[#8A2BE2]">
        <div className="rounded-full bg-background p-0.5">
          <Image
            src={story.user.avatarUrl}
            alt={story.user.name}
            width={64}
            height={64}
            className="rounded-full object-cover"
            data-ai-hint="user avatar"
          />
        </div>
      </div>
      <p className="text-xs font-medium">{story.user.name}</p>
    </div>
  );
}
