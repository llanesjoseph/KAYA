import {
  addDoc,
  deleteDoc,
  arrayUnion,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
  writeBatch,
  runTransaction,
  CollectionReference,
  DocumentData,
  Query,
  Timestamp,
  Unsubscribe,
  FieldValue,
} from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { extractHashtags } from './utils';
import type {
  CommentDocument,
  FollowDocument,
  LikeDocument,
  MessageDocument,
  NotificationDocument,
  PostDocument,
  ThreadDocument,
  UserProfile,
  ArticleDocument,
  CompanyDocument,
  EventDocument,
  JobDocument,
  TopicDocument,
} from './types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type Collections = {
  usersCol: CollectionReference<DocumentData>;
  postsCol: CollectionReference<DocumentData>;
  commentsCol: CollectionReference<DocumentData>;
  likesCol: CollectionReference<DocumentData>;
  followsCol: CollectionReference<DocumentData>;
  companyFollowsCol: CollectionReference<DocumentData>;
  threadsCol: CollectionReference<DocumentData>;
  messagesCol: CollectionReference<DocumentData>;
  notificationsCol: CollectionReference<DocumentData>;
  reportsCol: CollectionReference<DocumentData>;
  articlesCol: CollectionReference<DocumentData>;
  companiesCol: CollectionReference<DocumentData>;
  eventsCol: CollectionReference<DocumentData>;
  jobsCol: CollectionReference<DocumentData>;
  topicsCol: CollectionReference<DocumentData>;
};

type PaginatedResult<T> = {
  items: T[];
  nextCursor?: Timestamp;
};

type AuthorInfo = {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
};

type UserAuthInfo = AuthorInfo & {
  email: string | null;
};

type ReportData = {
  type: 'post' | 'comment' | 'user';
  refId: string;
  reason: string;
  reporterId?: string;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all Firestore collections. Throws if Firebase is not initialized.
 */
const getCollections = (): Collections => {
  if (!db) {
    throw new Error('Firebase not initialized');
  }
  return {
    usersCol: collection(db, 'users'),
    postsCol: collection(db, 'posts'),
    commentsCol: collection(db, 'comments'),
    likesCol: collection(db, 'likes'),
    followsCol: collection(db, 'follows'),
    companyFollowsCol: collection(db, 'companyFollows'),
    threadsCol: collection(db, 'threads'),
    messagesCol: collection(db, 'messages'),
    notificationsCol: collection(db, 'notifications'),
    reportsCol: collection(db, 'reports'),
    articlesCol: collection(db, 'articles'),
    companiesCol: collection(db, 'companies'),
    eventsCol: collection(db, 'events'),
    jobsCol: collection(db, 'jobs'),
    topicsCol: collection(db, 'topics'),
  };
};

/**
 * Validate that a string ID is not empty
 */
const validateId = (id: string, fieldName: string): void => {
  if (!id || id.trim().length === 0) {
    throw new Error(`${fieldName} is required and cannot be empty`);
  }
};

/**
 * Validate that content is not empty
 */
const validateContent = (content: string, fieldName = 'Content'): void => {
  if (!content || content.trim().length === 0) {
    throw new Error(`${fieldName} is required and cannot be empty`);
  }
};

// ============================================================================
// USER PROFILE FUNCTIONS
// ============================================================================

/**
 * Get a user profile by ID
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!db) {
    console.warn('Firebase not initialized, returning null user profile');
    return null;
  }

  validateId(userId, 'userId');

  try {
    const { usersCol } = getCollections();
    const userRef = doc(usersCol, userId);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      return null;
    }

    const data = snap.data();
    return {
      uid: userId,
      displayName: data.displayName ?? null,
      email: data.email ?? null,
      photoURL: data.photoURL ?? null,
      bannerUrl: data.bannerUrl ?? null,
      bio: data.bio ?? '',
      createdAt: data.createdAt,
      dob: data.dob,
      roles: data.roles ?? [],
      expertiseTags: data.expertiseTags ?? [],
      links: data.links ?? [],
    } as UserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

/**
 * Create a user profile if it doesn't exist
 */
export async function ensureUserProfile(user: UserAuthInfo): Promise<void> {
  if (!db) {
    console.warn('Firebase not initialized, skipping user profile creation');
    return;
  }

  validateId(user.uid, 'user.uid');

  try {
    const { usersCol } = getCollections();
    const userRef = doc(usersCol, user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        bio: '',
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    throw error;
  }
}

// ============================================================================
// POST FUNCTIONS
// ============================================================================

/**
 * Create a new post
 */
export async function createPost(
  author: AuthorInfo,
  content: string,
  imageUrl?: string,
  videoUrl?: string,
  thumbnailUrl?: string
): Promise<string> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(author.uid, 'author.uid');
  validateContent(content);

  const { postsCol } = getCollections();
  const tags = extractHashtags(content);

  const post: Omit<PostDocument, 'id'> = {
    authorId: author.uid,
    authorName: author.displayName,
    authorPhotoURL: author.photoURL,
    content,
    imageUrl,
    videoUrl,
    thumbnailUrl,
    mediaType: videoUrl ? 'video' : imageUrl ? 'image' : undefined,
    createdAt: serverTimestamp() as Timestamp,
    likeCount: 0,
    commentCount: 0,
    tags,
  };

  try {
    const ref = await addDoc(postsCol, post);

    // Update topic counts (fire-and-forget)
    if (tags.length > 0) {
      incrementTopicsCounts(tags, 'post').catch((err) =>
        console.warn('Failed to update topic counts:', err)
      );
    }

    return ref.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

/**
 * Fetch global feed (all posts)
 */
export async function fetchGlobalFeed(
  pageSize = 20,
  cursor?: Timestamp
): Promise<PaginatedResult<PostDocument & { id: string }>> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  const { postsCol } = getCollections();

  try {
    const constraints = [
      orderBy('createdAt', 'desc'),
      limit(pageSize),
      ...(cursor ? [startAfter(cursor)] : []),
    ];

    const q = query(postsCol, ...constraints);
    const snap = await getDocs(q);

    const items = snap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          authorId: data.authorId,
          authorName: data.authorName ?? null,
          authorPhotoURL: data.authorPhotoURL ?? null,
          content: data.content,
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
          thumbnailUrl: data.thumbnailUrl,
          mediaType: data.mediaType,
          createdAt: data.createdAt,
          likeCount: data.likeCount ?? 0,
          commentCount: data.commentCount ?? 0,
          tags: data.tags ?? [],
          hidden: data.hidden ?? false,
        } as PostDocument & { id: string };
      })
      .filter((p) => !p.hidden);

    const nextCursor =
      snap.docs.length > 0 ? snap.docs[snap.docs.length - 1].data().createdAt : undefined;

    return { items, nextCursor };
  } catch (error) {
    console.error('Error fetching global feed:', error);
    throw error;
  }
}

/**
 * Fetch personalized feed for a user (posts from people they follow)
 */
export async function fetchFeedForUser(
  userId: string,
  pageSize = 20,
  cursor?: Timestamp
): Promise<PaginatedResult<PostDocument & { id: string }>> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(userId, 'userId');

  const { followsCol, postsCol } = getCollections();

  try {
    // Fetch who the user follows
    const followsQ = query(followsCol, where('followerId', '==', userId));
    const followsSnap = await getDocs(followsQ);
    const followingIds = followsSnap.docs.map((d) => {
      const data = d.data();
      return data.followingId as string;
    });

    // If not following anyone, return global feed
    if (followingIds.length === 0) {
      return fetchGlobalFeed(pageSize, cursor);
    }

    // Firestore 'in' operator supports max 10 items
    const limitedFollowingIds = followingIds.slice(0, 10);

    const constraints = [
      where('authorId', 'in', limitedFollowingIds),
      orderBy('createdAt', 'desc'),
      limit(pageSize),
      ...(cursor ? [startAfter(cursor)] : []),
    ];

    const q = query(postsCol, ...constraints);
    const snap = await getDocs(q);

    const items = snap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          authorId: data.authorId,
          authorName: data.authorName ?? null,
          authorPhotoURL: data.authorPhotoURL ?? null,
          content: data.content,
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
          thumbnailUrl: data.thumbnailUrl,
          mediaType: data.mediaType,
          createdAt: data.createdAt,
          likeCount: data.likeCount ?? 0,
          commentCount: data.commentCount ?? 0,
          tags: data.tags ?? [],
          hidden: data.hidden ?? false,
        } as PostDocument & { id: string };
      })
      .filter((p) => !p.hidden);

    const nextCursor =
      snap.docs.length > 0 ? snap.docs[snap.docs.length - 1].data().createdAt : undefined;

    return { items, nextCursor };
  } catch (error) {
    console.error('Error fetching user feed:', error);
    throw error;
  }
}

/**
 * List posts by a specific author
 */
export async function listPostsByAuthor(
  authorId: string,
  pageSize = 20,
  cursor?: Timestamp
): Promise<PaginatedResult<PostDocument & { id: string }>> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(authorId, 'authorId');

  const { postsCol } = getCollections();

  try {
    const constraints = [
      where('authorId', '==', authorId),
      orderBy('createdAt', 'desc'),
      limit(pageSize),
      ...(cursor ? [startAfter(cursor)] : []),
    ];

    const q = query(postsCol, ...constraints);
    const snap = await getDocs(q);

    const items = snap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          authorId: data.authorId,
          authorName: data.authorName ?? null,
          authorPhotoURL: data.authorPhotoURL ?? null,
          content: data.content,
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
          thumbnailUrl: data.thumbnailUrl,
          mediaType: data.mediaType,
          createdAt: data.createdAt,
          likeCount: data.likeCount ?? 0,
          commentCount: data.commentCount ?? 0,
          tags: data.tags ?? [],
          hidden: data.hidden ?? false,
        } as PostDocument & { id: string };
      })
      .filter((p) => !p.hidden);

    const nextCursor =
      snap.docs.length > 0 ? snap.docs[snap.docs.length - 1].data().createdAt : undefined;

    return { items, nextCursor };
  } catch (error) {
    console.error('Error listing posts by author:', error);
    throw error;
  }
}

/**
 * List posts by tag
 */
export async function listPostsByTag(
  tag: string,
  pageSize = 20,
  cursor?: Timestamp
): Promise<PaginatedResult<PostDocument & { id: string }>> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateContent(tag, 'tag');

  const { postsCol } = getCollections();

  try {
    const constraints = [
      where('tags', 'array-contains', tag),
      orderBy('createdAt', 'desc'),
      limit(pageSize),
      ...(cursor ? [startAfter(cursor)] : []),
    ];

    const q = query(postsCol, ...constraints);
    const snap = await getDocs(q);

    const items = snap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          authorId: data.authorId,
          authorName: data.authorName ?? null,
          authorPhotoURL: data.authorPhotoURL ?? null,
          content: data.content,
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
          thumbnailUrl: data.thumbnailUrl,
          mediaType: data.mediaType,
          createdAt: data.createdAt,
          likeCount: data.likeCount ?? 0,
          commentCount: data.commentCount ?? 0,
          tags: data.tags ?? [],
          hidden: data.hidden ?? false,
        } as PostDocument & { id: string };
      })
      .filter((p) => !p.hidden);

    const nextCursor =
      snap.docs.length > 0 ? snap.docs[snap.docs.length - 1].data().createdAt : undefined;

    return { items, nextCursor };
  } catch (error) {
    console.error('Error listing posts by tag:', error);
    throw error;
  }
}

/**
 * Hide or unhide a post (moderation)
 */
export async function hidePost(postId: string, hidden: boolean): Promise<void> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(postId, 'postId');

  try {
    const { postsCol } = getCollections();
    await updateDoc(doc(postsCol, postId), { hidden });
  } catch (error) {
    console.error('Error hiding/unhiding post:', error);
    throw error;
  }
}

// ============================================================================
// LIKE FUNCTIONS
// ============================================================================

/**
 * Toggle like on a post
 */
export async function toggleLike(postId: string, userId: string): Promise<void> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(postId, 'postId');
  validateId(userId, 'userId');

  const { likesCol, postsCol } = getCollections();
  const likeDocId = `${postId}_${userId}`;
  const likeRef = doc(likesCol, likeDocId);
  const postRef = doc(postsCol, postId);

  try {
    let created = false;

    await runTransaction(db, async (transaction) => {
      const likeSnap = await transaction.get(likeRef);

      if (likeSnap.exists()) {
        // Unlike
        transaction.delete(likeRef);
        transaction.update(postRef, { likeCount: increment(-1) });
      } else {
        // Like
        transaction.set(likeRef, {
          postId,
          userId,
          createdAt: serverTimestamp(),
        } as LikeDocument);
        transaction.update(postRef, { likeCount: increment(1) });
        created = true;
      }
    });

    // Create notification (fire-and-forget)
    if (created) {
      getDoc(postRef)
        .then((postSnap) => {
          if (postSnap.exists()) {
            const postData = postSnap.data();
            const authorId = postData.authorId;
            if (authorId && authorId !== userId) {
              return createNotification({
                userId: authorId,
                type: 'like',
                refId: postId,
                actorId: userId,
              });
            }
          }
        })
        .catch((err) => console.warn('Failed to create like notification:', err));
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
}

/**
 * Check if a post is liked by a user
 */
export async function isPostLikedByUser(postId: string, userId: string): Promise<boolean> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(postId, 'postId');
  validateId(userId, 'userId');

  try {
    const { likesCol } = getCollections();
    const likeDocId = `${postId}_${userId}`;
    const likeRef = doc(likesCol, likeDocId);
    const snap = await getDoc(likeRef);
    return snap.exists();
  } catch (error) {
    console.error('Error checking if post is liked:', error);
    throw error;
  }
}

// ============================================================================
// COMMENT FUNCTIONS
// ============================================================================

/**
 * Add a comment to a post
 */
export async function addComment(
  postId: string,
  author: AuthorInfo,
  content: string
): Promise<string> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(postId, 'postId');
  validateId(author.uid, 'author.uid');
  validateContent(content);

  const { commentsCol, postsCol } = getCollections();

  try {
    const comment: Omit<CommentDocument, 'id'> = {
      postId,
      authorId: author.uid,
      authorName: author.displayName,
      authorPhotoURL: author.photoURL,
      content,
      createdAt: serverTimestamp() as Timestamp,
    };

    const ref = await addDoc(commentsCol, comment);
    const postRef = doc(postsCol, postId);
    await updateDoc(postRef, { commentCount: increment(1) });

    // Create notification (fire-and-forget)
    getDoc(postRef)
      .then((postSnap) => {
        if (postSnap.exists()) {
          const postData = postSnap.data();
          const authorId = postData.authorId;
          if (authorId && authorId !== author.uid) {
            return createNotification({
              userId: authorId,
              type: 'comment',
              refId: postId,
              actorId: author.uid,
            });
          }
        }
      })
      .catch((err) => console.warn('Failed to create comment notification:', err));

    return ref.id;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}

/**
 * List comments for a post
 */
export async function listComments(
  postId: string,
  pageSize = 50,
  cursor?: Timestamp
): Promise<PaginatedResult<CommentDocument & { id: string }>> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(postId, 'postId');

  const { commentsCol } = getCollections();

  try {
    const constraints = [
      where('postId', '==', postId),
      orderBy('createdAt', 'asc'),
      limit(pageSize),
      ...(cursor ? [startAfter(cursor)] : []),
    ];

    const q = query(commentsCol, ...constraints);
    const snap = await getDocs(q);

    const items = snap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          postId: data.postId,
          authorId: data.authorId,
          authorName: data.authorName ?? null,
          authorPhotoURL: data.authorPhotoURL ?? null,
          content: data.content,
          createdAt: data.createdAt,
          hidden: data.hidden ?? false,
        } as CommentDocument & { id: string };
      })
      .filter((c) => !c.hidden);

    const nextCursor =
      snap.docs.length > 0 ? snap.docs[snap.docs.length - 1].data().createdAt : undefined;

    return { items, nextCursor };
  } catch (error) {
    console.error('Error listing comments:', error);
    throw error;
  }
}

/**
 * Hide or unhide a comment (moderation)
 */
export async function hideComment(commentId: string, hidden: boolean): Promise<void> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(commentId, 'commentId');

  try {
    const { commentsCol } = getCollections();
    await updateDoc(doc(commentsCol, commentId), { hidden });
  } catch (error) {
    console.error('Error hiding/unhiding comment:', error);
    throw error;
  }
}

// ============================================================================
// FOLLOW FUNCTIONS
// ============================================================================

/**
 * Follow a user
 */
export async function followUser(followerId: string, followingId: string): Promise<void> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(followerId, 'followerId');
  validateId(followingId, 'followingId');

  if (followerId === followingId) {
    throw new Error('Cannot follow yourself');
  }

  const { followsCol } = getCollections();

  try {
    const q = query(
      followsCol,
      where('followerId', '==', followerId),
      where('followingId', '==', followingId)
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      await addDoc(followsCol, {
        followerId,
        followingId,
        createdAt: serverTimestamp(),
      } as FollowDocument);

      // Create notification (fire-and-forget)
      createNotification({
        userId: followingId,
        type: 'follow',
        refId: followerId,
        actorId: followerId,
      }).catch((err) => console.warn('Failed to create follow notification:', err));
    }
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
}

/**
 * Unfollow a user
 */
export async function unfollowUser(followerId: string, followingId: string): Promise<void> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(followerId, 'followerId');
  validateId(followingId, 'followingId');

  const { followsCol } = getCollections();

  try {
    const q = query(
      followsCol,
      where('followerId', '==', followerId),
      where('followingId', '==', followingId)
    );
    const snap = await getDocs(q);

    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
}

/**
 * Check if a user is following another user
 */
export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(followerId, 'followerId');
  validateId(followingId, 'followingId');

  try {
    const { followsCol } = getCollections();
    const q = query(
      followsCol,
      where('followerId', '==', followerId),
      where('followingId', '==', followingId)
    );
    const snap = await getDocs(q);
    return !snap.empty;
  } catch (error) {
    console.error('Error checking if following:', error);
    throw error;
  }
}

/**
 * Toggle follow status
 */
export async function toggleFollow(followerId: string, followingId: string): Promise<boolean> {
  const currentlyFollowing = await isFollowing(followerId, followingId);

  if (currentlyFollowing) {
    await unfollowUser(followerId, followingId);
    return false;
  } else {
    await followUser(followerId, followingId);
    return true;
  }
}

/**
 * Get follower and following counts for a user
 */
export async function getFollowCounts(
  userId: string
): Promise<{ followers: number; following: number }> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(userId, 'userId');

  const { followsCol } = getCollections();

  try {
    const followersQ = query(followsCol, where('followingId', '==', userId));
    const followingQ = query(followsCol, where('followerId', '==', userId));

    const [followersSnap, followingSnap] = await Promise.all([
      getDocs(followersQ),
      getDocs(followingQ),
    ]);

    return {
      followers: followersSnap.size,
      following: followingSnap.size,
    };
  } catch (error) {
    console.error('Error getting follow counts:', error);
    throw error;
  }
}

// ============================================================================
// COMPANY FOLLOW FUNCTIONS
// ============================================================================

/**
 * Check if a user is following a company
 */
export async function isFollowingCompany(userId: string, companyId: string): Promise<boolean> {
  if (!db) {
    console.warn('Firebase not initialized, returning false for isFollowingCompany');
    return false;
  }

  validateId(userId, 'userId');
  validateId(companyId, 'companyId');

  try {
    const { companyFollowsCol } = getCollections();
    const q = query(
      companyFollowsCol,
      where('userId', '==', userId),
      where('companyId', '==', companyId)
    );
    const snap = await getDocs(q);
    return !snap.empty;
  } catch (error) {
    console.error('Error checking if following company:', error);
    return false;
  }
}

/**
 * Toggle company follow status
 */
export async function toggleFollowCompany(userId: string, companyId: string): Promise<boolean> {
  if (!db) {
    console.warn('Firebase not initialized, returning false for toggleFollowCompany');
    return false;
  }

  validateId(userId, 'userId');
  validateId(companyId, 'companyId');

  try {
    const { companyFollowsCol } = getCollections();
    const q = query(
      companyFollowsCol,
      where('userId', '==', userId),
      where('companyId', '==', companyId)
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      await addDoc(companyFollowsCol, {
        userId,
        companyId,
        createdAt: serverTimestamp(),
      });
      return true;
    } else {
      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
      return false;
    }
  } catch (error) {
    console.error('Error toggling company follow:', error);
    return false;
  }
}

// ============================================================================
// MESSAGING FUNCTIONS
// ============================================================================

/**
 * Create or get existing thread for participants
 */
export async function upsertThread(participantIds: string[]): Promise<string> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  if (participantIds.length === 0) {
    throw new Error('participantIds cannot be empty');
  }

  participantIds.forEach((id) => validateId(id, 'participantId'));

  const { threadsCol } = getCollections();

  try {
    // Search for existing thread with same participants
    const q = query(threadsCol, where('participantIds', 'array-contains', participantIds[0]));
    const snap = await getDocs(q);

    const found = snap.docs.find((d) => {
      const data = d.data();
      const ids = data.participantIds as string[];
      return (
        ids.length === participantIds.length && ids.every((id) => participantIds.includes(id))
      );
    });

    if (found) {
      return found.id;
    }

    // Create new thread
    const ref = await addDoc(threadsCol, {
      participantIds,
      lastMessageAt: serverTimestamp(),
    } as ThreadDocument);

    return ref.id;
  } catch (error) {
    console.error('Error upserting thread:', error);
    throw error;
  }
}

/**
 * Send a message in a thread
 */
export async function sendMessage(
  threadId: string,
  senderId: string,
  content: string
): Promise<string> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(threadId, 'threadId');
  validateId(senderId, 'senderId');
  validateContent(content);

  const { messagesCol, threadsCol } = getCollections();

  try {
    const message: Omit<MessageDocument, 'id'> = {
      threadId,
      senderId,
      content,
      createdAt: serverTimestamp() as Timestamp,
    };

    const ref = await addDoc(messagesCol, message);
    const threadRef = doc(threadsCol, threadId);
    await updateDoc(threadRef, {
      lastMessageAt: serverTimestamp(),
      lastMessageText: content,
    });

    return ref.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

/**
 * List threads for a user
 */
export async function listThreads(userId: string): Promise<(ThreadDocument & { id: string })[]> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(userId, 'userId');

  const { threadsCol } = getCollections();

  try {
    const q = query(
      threadsCol,
      where('participantIds', 'array-contains', userId),
      orderBy('lastMessageAt', 'desc')
    );
    const snap = await getDocs(q);

    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        participantIds: data.participantIds ?? [],
        lastMessageAt: data.lastMessageAt,
        lastMessageText: data.lastMessageText,
      } as ThreadDocument & { id: string };
    });
  } catch (error) {
    console.error('Error listing threads:', error);
    throw error;
  }
}

/**
 * List messages in a thread
 */
export async function listMessages(
  threadId: string,
  pageSize = 50,
  cursor?: Timestamp
): Promise<PaginatedResult<MessageDocument & { id: string }>> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(threadId, 'threadId');

  const { messagesCol } = getCollections();

  try {
    const constraints = [
      where('threadId', '==', threadId),
      orderBy('createdAt', 'asc'),
      limit(pageSize),
      ...(cursor ? [startAfter(cursor)] : []),
    ];

    const q = query(messagesCol, ...constraints);
    const snap = await getDocs(q);

    const items = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        threadId: data.threadId,
        senderId: data.senderId,
        content: data.content,
        createdAt: data.createdAt,
      } as MessageDocument & { id: string };
    });

    const nextCursor =
      snap.docs.length > 0 ? snap.docs[snap.docs.length - 1].data().createdAt : undefined;

    return { items, nextCursor };
  } catch (error) {
    console.error('Error listing messages:', error);
    throw error;
  }
}

/**
 * Subscribe to messages in a thread (real-time)
 */
export function subscribeMessages(
  threadId: string,
  onUpdate: (messages: (MessageDocument & { id: string })[]) => void
): Unsubscribe {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(threadId, 'threadId');

  const { messagesCol } = getCollections();

  try {
    const q = query(
      messagesCol,
      where('threadId', '==', threadId),
      orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          threadId: data.threadId,
          senderId: data.senderId,
          content: data.content,
          createdAt: data.createdAt,
        } as MessageDocument & { id: string };
      });
      onUpdate(items);
    });
  } catch (error) {
    console.error('Error subscribing to messages:', error);
    throw error;
  }
}

// ============================================================================
// NOTIFICATION FUNCTIONS
// ============================================================================

/**
 * Create a notification
 */
export async function createNotification(
  n: Omit<NotificationDocument, 'createdAt' | 'read' | 'id'>
): Promise<void> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(n.userId, 'notification.userId');

  const { notificationsCol } = getCollections();

  try {
    await addDoc(notificationsCol, {
      ...n,
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

/**
 * List notifications for a user (paginated)
 */
export async function listNotificationsPaged(
  userId: string,
  pageSize = 20,
  cursor?: Timestamp
): Promise<PaginatedResult<NotificationDocument & { id: string }>> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(userId, 'userId');

  const { notificationsCol } = getCollections();

  try {
    const constraints = [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(pageSize),
      ...(cursor ? [startAfter(cursor)] : []),
    ];

    const q = query(notificationsCol, ...constraints);
    const snap = await getDocs(q);

    const items = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        userId: data.userId,
        type: data.type,
        refId: data.refId,
        createdAt: data.createdAt,
        read: data.read ?? false,
        actorId: data.actorId,
        meta: data.meta,
      } as NotificationDocument & { id: string };
    });

    const nextCursor =
      snap.docs.length > 0 ? snap.docs[snap.docs.length - 1].data().createdAt : undefined;

    return { items, nextCursor };
  } catch (error) {
    console.error('Error listing notifications:', error);
    throw error;
  }
}

/**
 * List notifications for a user (non-paginated, for backwards compatibility)
 */
export async function listNotifications(
  userId: string,
  pageSize = 20
): Promise<(NotificationDocument & { id: string })[]> {
  const result = await listNotificationsPaged(userId, pageSize);
  return result.items;
}

/**
 * Subscribe to notifications (real-time)
 */
export function subscribeNotifications(
  userId: string,
  onUpdate: (items: (NotificationDocument & { id: string })[]) => void,
  pageSize = 20
): Unsubscribe {
  if (!db) {
    console.warn('Firebase not initialized');
    onUpdate([]);
    return () => {};
  }

  validateId(userId, 'userId');

  try {
    const { notificationsCol } = getCollections();
    const q = query(
      notificationsCol,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    return onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          userId: data.userId,
          type: data.type,
          refId: data.refId,
          createdAt: data.createdAt,
          read: data.read ?? false,
          actorId: data.actorId,
          meta: data.meta,
        } as NotificationDocument & { id: string };
      });
      onUpdate(items);
    });
  } catch (error) {
    console.warn('Notifications subscription failed (indexes may not be deployed):', error);
    onUpdate([]);
    return () => {};
  }
}

/**
 * Subscribe to unread notification count (real-time)
 */
export function subscribeUnreadCount(
  userId: string,
  onUpdate: (count: number) => void,
  cap = 200
): Unsubscribe {
  if (!db) {
    console.warn('Firebase not initialized');
    onUpdate(0);
    return () => {};
  }

  validateId(userId, 'userId');

  try {
    const { notificationsCol } = getCollections();
    const q = query(
      notificationsCol,
      where('userId', '==', userId),
      where('read', '==', false),
      limit(cap)
    );

    return onSnapshot(q, (snap) => {
      onUpdate(snap.size);
    });
  } catch (error) {
    console.warn('Unread count subscription failed (indexes may not be deployed):', error);
    onUpdate(0);
    return () => {};
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationRead(notificationId: string): Promise<void> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(notificationId, 'notificationId');

  try {
    const { notificationsCol } = getCollections();
    await updateDoc(doc(notificationsCol, notificationId), { read: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsRead(userId: string): Promise<void> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(userId, 'userId');

  const { notificationsCol } = getCollections();

  try {
    const q = query(notificationsCol, where('userId', '==', userId), where('read', '==', false));
    const snap = await getDocs(q);

    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.update(d.ref, { read: true }));
    await batch.commit();
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string): Promise<void> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(notificationId, 'notificationId');

  try {
    const { notificationsCol } = getCollections();
    await deleteDoc(doc(notificationsCol, notificationId));
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
}

// ============================================================================
// SEARCH FUNCTIONS
// ============================================================================

/**
 * Search users by name prefix
 */
export async function searchUsersByNamePrefix(
  prefix: string,
  pageSize = 20
): Promise<(UserProfile & { id: string })[]> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateContent(prefix, 'prefix');

  const { usersCol } = getCollections();

  try {
    const end = prefix + '\uf8ff';
    const q = query(
      usersCol,
      orderBy('displayName'),
      where('displayName', '>=', prefix),
      where('displayName', '<=', end),
      limit(pageSize)
    );
    const snap = await getDocs(q);

    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        uid: d.id,
        displayName: data.displayName ?? null,
        email: data.email ?? null,
        photoURL: data.photoURL ?? null,
        bannerUrl: data.bannerUrl ?? null,
        bio: data.bio ?? '',
        createdAt: data.createdAt,
        dob: data.dob,
        roles: data.roles ?? [],
        expertiseTags: data.expertiseTags ?? [],
        links: data.links ?? [],
      } as UserProfile & { id: string };
    });
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
}

/**
 * Search posts by content prefix
 */
export async function searchPostsByContentPrefix(
  prefix: string,
  pageSize = 20
): Promise<(PostDocument & { id: string })[]> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateContent(prefix, 'prefix');

  const { postsCol } = getCollections();

  try {
    const end = prefix + '\uf8ff';
    const q = query(
      postsCol,
      orderBy('content'),
      where('content', '>=', prefix),
      where('content', '<=', end),
      limit(pageSize)
    );
    const snap = await getDocs(q);

    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        authorId: data.authorId,
        authorName: data.authorName ?? null,
        authorPhotoURL: data.authorPhotoURL ?? null,
        content: data.content,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl,
        mediaType: data.mediaType,
        createdAt: data.createdAt,
        likeCount: data.likeCount ?? 0,
        commentCount: data.commentCount ?? 0,
        tags: data.tags ?? [],
        hidden: data.hidden ?? false,
      } as PostDocument & { id: string };
    });
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
}

/**
 * Suggest users to follow (basic)
 */
export async function suggestUsersToFollow(userId: string, pageSize = 5): Promise<UserProfile[]> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(userId, 'userId');

  const { followsCol, usersCol } = getCollections();

  try {
    // Get users already following
    const followsQ = query(followsCol, where('followerId', '==', userId));
    const followsSnap = await getDocs(followsQ);
    const followingIds = new Set<string>(
      followsSnap.docs.map((d) => d.data().followingId as string)
    );
    followingIds.add(userId);

    // Get recent users
    const usersQ = query(usersCol, orderBy('createdAt', 'desc'), limit(50));
    const usersSnap = await getDocs(usersQ);

    const candidates = usersSnap.docs
      .map((d) => {
        const data = d.data();
        return {
          uid: d.id,
          displayName: data.displayName ?? null,
          email: data.email ?? null,
          photoURL: data.photoURL ?? null,
          bannerUrl: data.bannerUrl ?? null,
          bio: data.bio ?? '',
          createdAt: data.createdAt,
          dob: data.dob,
          roles: data.roles ?? [],
          expertiseTags: data.expertiseTags ?? [],
          links: data.links ?? [],
        } as UserProfile;
      })
      .filter((u) => !followingIds.has(u.uid));

    return candidates.slice(0, pageSize);
  } catch (error) {
    console.error('Error suggesting users to follow:', error);
    throw error;
  }
}

/**
 * Suggest users to follow (smart - based on mutual follows and expertise)
 */
export async function suggestUsersSmart(userId: string, pageSize = 5): Promise<UserProfile[]> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(userId, 'userId');

  const { followsCol, usersCol } = getCollections();

  try {
    // Get current user's profile
    const myProfile = await getUserProfile(userId);
    const myTags = new Set<string>(
      (myProfile?.expertiseTags || []).map((t) => t.toLowerCase())
    );

    // Get who user is following
    const fSnap = await getDocs(query(followsCol, where('followerId', '==', userId)));
    const followingIds = fSnap.docs.map((d) => d.data().followingId as string);
    const exclude = new Set<string>([userId, ...followingIds]);

    // Get friends-of-friends
    let fofIds: string[] = [];
    if (followingIds.length > 0) {
      const limitedFollowingIds = followingIds.slice(0, 10); // Firestore 'in' limit
      const fofSnap = await getDocs(
        query(followsCol, where('followerId', 'in', limitedFollowingIds))
      );
      fofIds = fofSnap.docs.map((d) => d.data().followingId as string);
    }

    const uniqueCandidateIds = Array.from(new Set<string>(fofIds)).filter(
      (id) => !exclude.has(id)
    );

    // Get candidate users
    const usersQ = query(usersCol, orderBy('createdAt', 'desc'), limit(100));
    const usersSnap = await getDocs(usersQ);

    const candidates = usersSnap.docs
      .map((d) => {
        const data = d.data();
        return {
          uid: d.id,
          displayName: data.displayName ?? null,
          email: data.email ?? null,
          photoURL: data.photoURL ?? null,
          bannerUrl: data.bannerUrl ?? null,
          bio: data.bio ?? '',
          createdAt: data.createdAt,
          dob: data.dob,
          roles: data.roles ?? [],
          expertiseTags: data.expertiseTags ?? [],
          links: data.links ?? [],
        } as UserProfile;
      })
      .filter((u) => !exclude.has(u.uid));

    // Score candidates
    const scored = candidates.map((u) => {
      const tags = (u.expertiseTags || []).map((t) => t.toLowerCase());
      const overlap = tags.filter((t) => myTags.has(t)).length;
      const fofBoost = uniqueCandidateIds.includes(u.uid) ? 1 : 0;
      const score = overlap * 2 + fofBoost;
      return { u, score };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, pageSize).map((s) => s.u);
  } catch (error) {
    console.error('Error suggesting smart users:', error);
    throw error;
  }
}

// ============================================================================
// ARTICLE FUNCTIONS
// ============================================================================

/**
 * Create an article
 */
export async function createArticle(
  authorId: string,
  title: string,
  content: string,
  coverUrl?: string,
  tags: string[] = []
): Promise<string> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(authorId, 'authorId');
  validateContent(title, 'title');
  validateContent(content, 'content');

  const { articlesCol } = getCollections();
  const normalizedTags = tags.length > 0 ? tags : extractHashtags(content);

  try {
    const docRef = await addDoc(articlesCol, {
      authorId,
      title,
      content,
      coverUrl,
      tags: normalizedTags,
      createdAt: serverTimestamp(),
      likeCount: 0,
      commentCount: 0,
    } as Omit<ArticleDocument, 'id'>);

    // Update topic counts (fire-and-forget)
    if (normalizedTags.length > 0) {
      incrementTopicsCounts(normalizedTags, 'article').catch((err) =>
        console.warn('Failed to update topic counts:', err)
      );
    }

    return docRef.id;
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}

/**
 * List articles
 */
export async function listArticles(pageSize = 20): Promise<(ArticleDocument & { id: string })[]> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  const { articlesCol } = getCollections();

  try {
    const q = query(articlesCol, orderBy('createdAt', 'desc'), limit(pageSize));
    const snap = await getDocs(q);

    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        authorId: data.authorId,
        title: data.title,
        content: data.content,
        coverUrl: data.coverUrl,
        createdAt: data.createdAt,
        likeCount: data.likeCount ?? 0,
        commentCount: data.commentCount ?? 0,
        tags: data.tags ?? [],
        hidden: data.hidden ?? false,
      } as ArticleDocument & { id: string };
    });
  } catch (error) {
    console.error('Error listing articles:', error);
    throw error;
  }
}

/**
 * List articles by tag
 */
export async function listArticlesByTag(
  tag: string,
  pageSize = 20,
  cursor?: Timestamp
): Promise<PaginatedResult<ArticleDocument & { id: string }>> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateContent(tag, 'tag');

  const { articlesCol } = getCollections();

  try {
    const constraints = [
      where('tags', 'array-contains', tag),
      orderBy('createdAt', 'desc'),
      limit(pageSize),
      ...(cursor ? [startAfter(cursor)] : []),
    ];

    const q = query(articlesCol, ...constraints);
    const snap = await getDocs(q);

    const items = snap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          authorId: data.authorId,
          title: data.title,
          content: data.content,
          coverUrl: data.coverUrl,
          createdAt: data.createdAt,
          likeCount: data.likeCount ?? 0,
          commentCount: data.commentCount ?? 0,
          tags: data.tags ?? [],
          hidden: data.hidden ?? false,
        } as ArticleDocument & { id: string };
      })
      .filter((a) => !a.hidden);

    const nextCursor =
      snap.docs.length > 0 ? snap.docs[snap.docs.length - 1].data().createdAt : undefined;

    return { items, nextCursor };
  } catch (error) {
    console.error('Error listing articles by tag:', error);
    throw error;
  }
}

// ============================================================================
// COMPANY FUNCTIONS
// ============================================================================

/**
 * Create a company
 */
export async function createCompany(
  ownerId: string,
  name: string,
  logoUrl?: string,
  bio?: string,
  website?: string
): Promise<string> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(ownerId, 'ownerId');
  validateContent(name, 'name');

  const { companiesCol } = getCollections();

  try {
    const ref = await addDoc(companiesCol, {
      ownerId,
      name,
      logoUrl,
      bio,
      website,
      followerCount: 0,
      createdAt: serverTimestamp(),
    } as Omit<CompanyDocument, 'id'>);

    return ref.id;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
}

/**
 * List companies
 */
export async function listCompanies(pageSize = 20): Promise<(CompanyDocument & { id: string })[]> {
  if (!db) {
    console.warn('Firebase not initialized, returning empty companies list');
    return [];
  }

  const { companiesCol } = getCollections();

  try {
    const q = query(companiesCol, orderBy('createdAt', 'desc'), limit(pageSize));
    const snap = await getDocs(q);

    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ownerId: data.ownerId,
        name: data.name,
        logoUrl: data.logoUrl,
        bio: data.bio,
        website: data.website,
        createdAt: data.createdAt,
        followerCount: data.followerCount ?? 0,
      } as CompanyDocument & { id: string };
    });
  } catch (error) {
    console.error('Error listing companies:', error);
    return [];
  }
}

/**
 * Get a company by ID
 */
export async function getCompany(companyId: string): Promise<(CompanyDocument & { id: string }) | null> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(companyId, 'companyId');

  try {
    const { companiesCol } = getCollections();
    const s = await getDoc(doc(companiesCol, companyId));

    if (!s.exists()) {
      return null;
    }

    const data = s.data();
    return {
      id: s.id,
      ownerId: data.ownerId,
      name: data.name,
      logoUrl: data.logoUrl,
      bio: data.bio,
      website: data.website,
      createdAt: data.createdAt,
      followerCount: data.followerCount ?? 0,
    } as CompanyDocument & { id: string };
  } catch (error) {
    console.error('Error getting company:', error);
    throw error;
  }
}

// ============================================================================
// EVENT FUNCTIONS
// ============================================================================

/**
 * Create an event
 */
export async function createEvent(
  organizerId: string,
  data: Omit<EventDocument, 'id' | 'createdAt' | 'organizerId'>
): Promise<string> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(organizerId, 'organizerId');
  validateContent(data.title, 'title');

  const { eventsCol } = getCollections();

  try {
    const ref = await addDoc(eventsCol, {
      ...data,
      organizerId,
      createdAt: serverTimestamp(),
    });

    return ref.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

/**
 * List events
 */
export async function listEvents(pageSize = 20): Promise<(EventDocument & { id: string })[]> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  const { eventsCol } = getCollections();

  try {
    const q = query(eventsCol, orderBy('startAt', 'asc'), limit(pageSize));
    const snap = await getDocs(q);

    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        organizerId: data.organizerId,
        title: data.title,
        description: data.description,
        startAt: data.startAt,
        endAt: data.endAt,
        location: data.location,
        coverUrl: data.coverUrl,
        createdAt: data.createdAt,
      } as EventDocument & { id: string };
    });
  } catch (error) {
    console.error('Error listing events:', error);
    throw error;
  }
}

/**
 * List events by company
 */
export async function listCompanyEvents(companyId: string): Promise<(EventDocument & { id: string })[]> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(companyId, 'companyId');

  const { eventsCol } = getCollections();

  try {
    const q = query(eventsCol, where('organizerId', '==', companyId), orderBy('startAt', 'desc'));
    const snap = await getDocs(q);

    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        organizerId: data.organizerId,
        title: data.title,
        description: data.description,
        startAt: data.startAt,
        endAt: data.endAt,
        location: data.location,
        coverUrl: data.coverUrl,
        createdAt: data.createdAt,
      } as EventDocument & { id: string };
    });
  } catch (error) {
    console.error('Error listing company events:', error);
    throw error;
  }
}

// ============================================================================
// JOB FUNCTIONS
// ============================================================================

/**
 * Create a job posting
 */
export async function createJob(
  companyId: string,
  title: string,
  description: string,
  location?: string
): Promise<string> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(companyId, 'companyId');
  validateContent(title, 'title');
  validateContent(description, 'description');

  const { jobsCol } = getCollections();

  try {
    const ref = await addDoc(jobsCol, {
      companyId,
      title,
      description,
      location,
      createdAt: serverTimestamp(),
    } as Omit<JobDocument, 'id'>);

    return ref.id;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
}

/**
 * List jobs
 */
export async function listJobs(pageSize = 20): Promise<(JobDocument & { id: string })[]> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  const { jobsCol } = getCollections();

  try {
    const q = query(jobsCol, orderBy('createdAt', 'desc'), limit(pageSize));
    const snap = await getDocs(q);

    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        companyId: data.companyId,
        title: data.title,
        description: data.description,
        location: data.location,
        createdAt: data.createdAt,
      } as JobDocument & { id: string };
    });
  } catch (error) {
    console.error('Error listing jobs:', error);
    throw error;
  }
}

/**
 * List jobs by company
 */
export async function listCompanyJobs(companyId: string): Promise<(JobDocument & { id: string })[]> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(companyId, 'companyId');

  const { jobsCol } = getCollections();

  try {
    const q = query(jobsCol, where('companyId', '==', companyId), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);

    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        companyId: data.companyId,
        title: data.title,
        description: data.description,
        location: data.location,
        createdAt: data.createdAt,
      } as JobDocument & { id: string };
    });
  } catch (error) {
    console.error('Error listing company jobs:', error);
    throw error;
  }
}

// ============================================================================
// TOPIC FUNCTIONS
// ============================================================================

/**
 * Increment topic counts for hashtags
 */
export async function incrementTopicsCounts(
  tags: string[],
  type: 'post' | 'article'
): Promise<void> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  if (tags.length === 0) {
    return;
  }

  const { topicsCol } = getCollections();

  try {
    const batch = writeBatch(db);

    for (const tag of tags) {
      const id = tag.toLowerCase();
      const ref = doc(topicsCol, id);
      batch.set(
        ref,
        {
          name: tag,
          postCount: type === 'post' ? increment(1) : increment(0),
          articleCount: type === 'article' ? increment(1) : increment(0),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    }

    await batch.commit();
  } catch (error) {
    console.error('Error incrementing topic counts:', error);
    throw error;
  }
}

// ============================================================================
// REPORT/MODERATION FUNCTIONS
// ============================================================================

/**
 * Add a report
 */
export async function addReport(data: ReportData): Promise<void> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateContent(data.reason, 'reason');
  validateId(data.refId, 'refId');

  const { reportsCol } = getCollections();

  try {
    await addDoc(reportsCol, {
      ...data,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding report:', error);
    throw error;
  }
}

/**
 * List reports
 */
export async function listReports(pageSize = 50): Promise<(ReportData & { id: string; createdAt: Timestamp })[]> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  const { reportsCol } = getCollections();

  try {
    const q = query(reportsCol, orderBy('createdAt', 'desc'), limit(pageSize));
    const snap = await getDocs(q);

    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        type: data.type,
        refId: data.refId,
        reason: data.reason,
        reporterId: data.reporterId,
        createdAt: data.createdAt,
      } as ReportData & { id: string; createdAt: Timestamp };
    });
  } catch (error) {
    console.error('Error listing reports:', error);
    throw error;
  }
}

/**
 * Resolve a report
 */
export async function resolveReport(reportId: string): Promise<void> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  validateId(reportId, 'reportId');

  try {
    const { reportsCol } = getCollections();
    await updateDoc(doc(reportsCol, reportId), { resolved: true });
  } catch (error) {
    console.error('Error resolving report:', error);
    throw error;
  }
}

// ============================================================================
// MEDIA UPLOAD FUNCTION
// ============================================================================

/**
 * Upload media file and get download URL
 */
export async function uploadMediaAndGetUrl(
  file: File,
  pathPrefix = 'uploads'
): Promise<string> {
  if (!storage) {
    throw new Error('Firebase storage not initialized');
  }

  try {
    const path = `${pathPrefix}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
}

// ============================================================================
// REAL-TIME SUBSCRIPTION FUNCTIONS
// ============================================================================

/**
 * Subscribe to new posts (real-time)
 */
export function subscribeNewPosts(
  since: Timestamp,
  onAdd: (posts: (PostDocument & { id: string })[]) => void
): Unsubscribe {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  const { postsCol } = getCollections();

  try {
    const q = query(
      postsCol,
      where('createdAt', '>', since),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    return onSnapshot(q, (snap) => {
      const items = snap
        .docChanges()
        .filter((c) => c.type === 'added')
        .map((c) => {
          const data = c.doc.data();
          return {
            id: c.doc.id,
            authorId: data.authorId,
            authorName: data.authorName ?? null,
            authorPhotoURL: data.authorPhotoURL ?? null,
            content: data.content,
            imageUrl: data.imageUrl,
            videoUrl: data.videoUrl,
            thumbnailUrl: data.thumbnailUrl,
            mediaType: data.mediaType,
            createdAt: data.createdAt,
            likeCount: data.likeCount ?? 0,
            commentCount: data.commentCount ?? 0,
            tags: data.tags ?? [],
            hidden: data.hidden ?? false,
          } as PostDocument & { id: string };
        });

      if (items.length > 0) {
        onAdd(items);
      }
    });
  } catch (error) {
    console.error('Error subscribing to new posts:', error);
    throw error;
  }
}
