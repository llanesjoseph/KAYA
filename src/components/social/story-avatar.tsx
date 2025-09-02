import type { Story } from '@/lib/data';
import { ProfilePhoto } from '@/components/ui/profile-photo';

interface StoryAvatarProps {
  story: Story;
}

export function StoryAvatar({ story }: StoryAvatarProps) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <ProfilePhoto 
        imageUrl={story.user.avatarUrl}
        alt={story.user.name}
        size={100}
        borderWidth={4}
      />
      <p className="text-xs font-medium">{story.user.name}</p>
    </div>
  );
}
