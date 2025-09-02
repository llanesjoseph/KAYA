import {
  addDoc,
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
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type {
  CommentDocument,
  FollowDocument,
  LikeDocument,
  MessageDocument,
  NotificationDocument,
  PostDocument,
  ThreadDocument,
  UserProfile,
} from './types';

// Collections
const usersCol = collection(db, 'users');
const postsCol = collection(db, 'posts');
const commentsCol = collection(db, 'comments');
const likesCol = collection(db, 'likes');
const followsCol = collection(db, 'follows');
const threadsCol = collection(db, 'threads');
const messagesCol = collection(db, 'messages');
const notificationsCol = collection(db, 'notifications');

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const ref = doc(usersCol, userId);
  const snap = await getDoc(ref);
  return snap.exists() ? ({ uid: userId, ...(snap.data() as any) } as UserProfile) : null;
}

export async function ensureUserProfile(user: { uid: string; displayName: string | null; email: string | null; photoURL: string | null; }) {
  const ref = doc(usersCol, user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      bio: '',
      createdAt: serverTimestamp(),
    });
  }
}

export async function createPost(author: { uid: string; displayName: string | null; photoURL: string | null; }, content: string, imageUrl?: string) {
  const post: PostDocument = {
    authorId: author.uid,
    authorName: author.displayName,
    authorPhotoURL: author.photoURL,
    content,
    imageUrl,
    createdAt: serverTimestamp(),
    likeCount: 0,
    commentCount: 0,
  };
  const ref = await addDoc(postsCol, post as any);
  return ref.id;
}

export async function fetchGlobalFeed(pageSize = 20, cursor?: any) {
  const q = query(postsCol, orderBy('createdAt', 'desc'), limit(pageSize), ...(cursor ? [startAfter(cursor)] : []));
  const snap = await getDocs(q);
  const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as (PostDocument & { id: string })[];
  const nextCursor = snap.docs.length ? snap.docs[snap.docs.length - 1].data().createdAt : undefined;
  return { items, nextCursor };
}

export async function fetchFeedForUser(userId: string, pageSize = 20, cursor?: any) {
  // Fetch who the user follows
  const followsQ = query(followsCol, where('followerId', '==', userId));
  const followsSnap = await getDocs(followsQ);
  const followingIds = followsSnap.docs.map(d => (d.data() as FollowDocument).followingId);
  if (followingIds.length === 0) {
    return fetchGlobalFeed(pageSize, cursor);
  }
  const q = query(
    postsCol,
    where('authorId', 'in', followingIds.slice(0, 10)), // Firestore 'in' requires <=10
    orderBy('createdAt', 'desc'),
    limit(pageSize),
    ...(cursor ? [startAfter(cursor)] : [])
  );
  const snap = await getDocs(q);
  const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as (PostDocument & { id: string })[];
  const nextCursor = snap.docs.length ? snap.docs[snap.docs.length - 1].data().createdAt : undefined;
  return { items, nextCursor };
}

export async function toggleLike(postId: string, userId: string) {
  const likeDocId = `${postId}_${userId}`;
  const likeRef = doc(likesCol, likeDocId);
  const postRef = doc(postsCol, postId);
  await runTransaction(db, async transaction => {
    const likeSnap = await transaction.get(likeRef);
    if (likeSnap.exists()) {
      transaction.delete(likeRef);
      transaction.update(postRef, { likeCount: increment(-1) });
    } else {
      transaction.set(likeRef, { postId, userId, createdAt: serverTimestamp() } as LikeDocument);
      transaction.update(postRef, { likeCount: increment(1) });
    }
  });
}

export async function addComment(postId: string, author: { uid: string; displayName: string | null; photoURL: string | null; }, content: string) {
  const comment: CommentDocument = {
    postId,
    authorId: author.uid,
    authorName: author.displayName,
    authorPhotoURL: author.photoURL,
    content,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(commentsCol, comment as any);
  const postRef = doc(postsCol, postId);
  await updateDoc(postRef, { commentCount: increment(1) });
  return ref.id;
}

export async function listComments(postId: string, pageSize = 50, cursor?: any) {
  const q = query(
    commentsCol,
    where('postId', '==', postId),
    orderBy('createdAt', 'asc'),
    limit(pageSize),
    ...(cursor ? [startAfter(cursor)] : [])
  );
  const snap = await getDocs(q);
  const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as (CommentDocument & { id: string })[];
  const nextCursor = snap.docs.length ? snap.docs[snap.docs.length - 1].data().createdAt : undefined;
  return { items, nextCursor };
}

export async function followUser(followerId: string, followingId: string) {
  if (followerId === followingId) return;
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
  }
}

export async function unfollowUser(followerId: string, followingId: string) {
  const q = query(
    followsCol,
    where('followerId', '==', followerId),
    where('followingId', '==', followingId)
  );
  const snap = await getDocs(q);
  const batch = writeBatch(db);
  snap.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
}

export async function upsertThread(participantIds: string[]) {
  // naive: search existing thread with exact same participants (2-person threads for MVP)
  const q = query(threadsCol, where('participantIds', 'array-contains', participantIds[0]));
  const snap = await getDocs(q);
  const found = snap.docs.find(d => {
    const ids = (d.data() as any).participantIds as string[];
    return ids.length === participantIds.length && ids.every(id => participantIds.includes(id));
  });
  if (found) return found.id;
  const ref = await addDoc(threadsCol, {
    participantIds,
    lastMessageAt: serverTimestamp(),
  } as ThreadDocument);
  return ref.id;
}

export async function sendMessage(threadId: string, senderId: string, content: string) {
  const message: MessageDocument = {
    threadId,
    senderId,
    content,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(messagesCol, message as any);
  const threadRef = doc(threadsCol, threadId);
  await updateDoc(threadRef, { lastMessageAt: serverTimestamp(), lastMessageText: content });
  return ref.id;
}

export async function listThreads(userId: string) {
  const q = query(threadsCol, where('participantIds', 'array-contains', userId), orderBy('lastMessageAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as (ThreadDocument & { id: string })[];
}

export async function listMessages(threadId: string, pageSize = 50, cursor?: any) {
  const q = query(
    messagesCol,
    where('threadId', '==', threadId),
    orderBy('createdAt', 'asc'),
    limit(pageSize),
    ...(cursor ? [startAfter(cursor)] : [])
  );
  const snap = await getDocs(q);
  const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as (MessageDocument & { id: string })[];
  const nextCursor = snap.docs.length ? snap.docs[snap.docs.length - 1].data().createdAt : undefined;
  return { items, nextCursor };
}

export async function createNotification(n: Omit<NotificationDocument, 'createdAt' | 'read'>) {
  await addDoc(notificationsCol, { ...n, read: false, createdAt: serverTimestamp() } as any);
}

