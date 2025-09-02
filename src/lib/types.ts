// Shared application types for Firestore documents and domain models

export type UserProfile = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  bannerUrl?: string | null;
  bio: string;
  createdAt: any; // Firestore Timestamp
  dob?: any; // Firestore Timestamp (optional)
  roles?: string[]; // e.g., ['Educator','Business','Medical']
  expertiseTags?: string[]; // e.g., ['Cultivation','Compliance']
  links?: { label: string; url: string }[];
};

export type PostDocument = {
  id?: string;
  authorId: string;
  authorName: string | null;
  authorPhotoURL: string | null;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string; // for videos
  mediaType?: 'image' | 'video';
  createdAt: any; // Firestore Timestamp
  likeCount: number;
  commentCount: number;
  tags?: string[];
  hidden?: boolean;
};

export type CommentDocument = {
  id?: string;
  postId: string;
  authorId: string;
  authorName: string | null;
  authorPhotoURL: string | null;
  content: string;
  createdAt: any; // Firestore Timestamp
  hidden?: boolean;
};

export type FollowDocument = {
  followerId: string;
  followingId: string;
  createdAt: any; // Firestore Timestamp
};

export type LikeDocument = {
  postId: string;
  userId: string;
  createdAt: any; // Firestore Timestamp
};

export type ThreadDocument = {
  id?: string;
  participantIds: string[];
  lastMessageAt: any; // Firestore Timestamp
  lastMessageText?: string;
};

export type MessageDocument = {
  id?: string;
  threadId: string;
  senderId: string;
  content: string;
  createdAt: any; // Firestore Timestamp
};

export type NotificationType = 'like' | 'comment' | 'follow' | 'message';

export type NotificationDocument = {
  id?: string;
  userId: string; // who receives the notification
  type: NotificationType;
  refId: string; // postId/commentId/userId/threadId depending on type
  createdAt: any; // Firestore Timestamp
  read: boolean;
  actorId?: string; // the user who triggered the notification
  meta?: Record<string, unknown>;
};

export type ArticleDocument = {
  id?: string;
  authorId: string;
  title: string;
  content: string;
  coverUrl?: string;
  createdAt: any;
  likeCount: number;
  commentCount: number;
  tags: string[]; // hashtags/topics
  hidden?: boolean;
};

export type CompanyDocument = {
  id?: string;
  ownerId: string; // user admin
  name: string;
  logoUrl?: string;
  bio?: string;
  website?: string;
  createdAt: any;
  followerCount: number;
};

export type EventDocument = {
  id?: string;
  organizerId: string; // company or user
  title: string;
  description?: string;
  startAt: any;
  endAt?: any;
  location?: string;
  coverUrl?: string;
  createdAt: any;
};

export type JobDocument = {
  id?: string;
  companyId: string;
  title: string;
  description: string;
  location?: string;
  createdAt: any;
};

export type TopicDocument = {
  id?: string; // normalized hashtag, e.g. "cannabis-education"
  name: string; // e.g. "#CannabisEducation"
  postCount: number;
  articleCount: number;
  createdAt: any;
};

