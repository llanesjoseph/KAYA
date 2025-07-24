import Image from 'next/image';
import type { Story } from '@/lib/data';

interface StoryAvatarProps {
  story: Story;
}

export function StoryAvatar({ story }: StoryAvatarProps) {
  const leafClipPath = 'path("M50 2C52.5 7.5 55 15 55 25C55 30 54 35 52 40C58 36 65 35 70 35C75 35 80 37 85 41C81 44 78 48 75 52C78 54 81 57 84 60C79 63 74 65 70 66C72 71 75 76 75 82C75 88 73 94 70 98H30C27 94 25 88 25 82C25 76 28 71 30 66C26 65 21 63 16 60C19 57 22 54 25 52C22 48 19 44 15 41C20 37 25 35 30 35C35 35 42 36 48 40C46 35 45 30 45 25C45 15 47.5 7.5 50 2Z")';

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className="relative w-[100px] h-[100px] flex items-center justify-center"
      >
        <div
            className="absolute inset-0 bg-primary"
            style={{ clipPath: leafClipPath }}
        ></div>
        <div
            className="relative w-[92px] h-[92px] bg-background"
            style={{ clipPath: leafClipPath }}
        >
          <Image
            src={story.user.avatarUrl}
            alt={story.user.name}
            fill
            className="object-cover"
            style={{ clipPath: leafClipPath }}
            data-ai-hint="user avatar"
          />
        </div>
      </div>
      <p className="text-xs font-medium">{story.user.name}</p>
    </div>
  );
}
