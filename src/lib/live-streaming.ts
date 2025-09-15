// Live streaming utility functions and types
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  limit,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';

export interface LiveStream {
  id?: string;
  title: string;
  description: string;
  streamerId: string;
  streamerName: string;
  streamerPhotoURL?: string;
  isLive: boolean;
  viewerCount: number;
  startedAt?: any; // Firestore Timestamp
  endedAt?: any; // Firestore Timestamp
  createdAt: any; // Firestore Timestamp
  category: 'growing' | 'education' | 'review' | 'general' | 'cooking' | 'dispensary';
  tags?: string[];
}

export interface StreamMessage {
  id?: string;
  streamId: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  message: string;
  createdAt: any; // Firestore Timestamp
  type: 'message' | 'join' | 'leave' | 'heart';
}

export interface StreamViewer {
  id?: string;
  streamId: string;
  userId: string;
  joinedAt: any; // Firestore Timestamp
}

// Collections (initialized lazily to handle build-time scenarios)
const getCollections = () => {
  if (!db) {
    throw new Error('Firebase not initialized');
  }
  return {
    streamsCol: collection(db, 'streams'),
    streamMessagesCol: collection(db, 'streamMessages'),
    streamViewersCol: collection(db, 'streamViewers'),
  };
};

// Stream management
export async function createLiveStream(streamerData: {
  uid: string;
  displayName: string;
  photoURL?: string;
}, streamData: {
  title: string;
  description: string;
  category: LiveStream['category'];
  tags?: string[];
}) {
  const stream: Omit<LiveStream, 'id'> = {
    title: streamData.title,
    description: streamData.description,
    streamerId: streamerData.uid,
    streamerName: streamerData.displayName,
    streamerPhotoURL: streamerData.photoURL,
    isLive: false,
    viewerCount: 0,
    createdAt: serverTimestamp(),
    category: streamData.category,
    tags: streamData.tags || [],
  };

  const ref = await addDoc(streamsCol, stream as any);
  return ref.id;
}

export async function startLiveStream(streamId: string) {
  await updateDoc(doc(streamsCol, streamId), {
    isLive: true,
    startedAt: serverTimestamp(),
  });
}

export async function endLiveStream(streamId: string) {
  await updateDoc(doc(streamsCol, streamId), {
    isLive: false,
    endedAt: serverTimestamp(),
  });
}

export async function updateViewerCount(streamId: string, count: number) {
  await updateDoc(doc(streamsCol, streamId), {
    viewerCount: count,
  });
}

// Get live streams
export async function getLiveStreams(pageSize = 10) {
  // Temporarily disabled until Firestore indexes are deployed to prevent console errors
  // TODO: Re-enable after running: firebase deploy --only firestore:indexes
  return [];
  
  /*
  const q = query(
    streamsCol,
    where('isLive', '==', true),
    orderBy('startedAt', 'desc'),
    limit(pageSize)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as (LiveStream & { id: string })[];
  */
}

export async function getAllStreams(pageSize = 20) {
  if (!db) {
    console.warn('Firebase not initialized, returning empty streams list');
    return [];
  }
  const { streamsCol } = getCollections();
  const q = query(streamsCol, orderBy('createdAt', 'desc'), limit(pageSize));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as (LiveStream & { id: string })[];
}

export function subscribeToStream(streamId: string, onUpdate: (stream: LiveStream & { id: string }) => void) {
  const streamRef = doc(streamsCol, streamId);
  return onSnapshot(streamRef, (doc) => {
    if (doc.exists()) {
      onUpdate({ id: doc.id, ...doc.data() } as LiveStream & { id: string });
    }
  });
}

// Viewer management
export async function joinStream(streamId: string, userId: string) {
  // Check if already viewing
  const existing = await getDocs(
    query(streamViewersCol, where('streamId', '==', streamId), where('userId', '==', userId))
  );
  
  if (existing.empty) {
    await addDoc(streamViewersCol, {
      streamId,
      userId,
      joinedAt: serverTimestamp(),
    } as Omit<StreamViewer, 'id'>);

    // Update viewer count
    const viewersSnap = await getDocs(query(streamViewersCol, where('streamId', '==', streamId)));
    await updateViewerCount(streamId, viewersSnap.size);
  }
}

export async function leaveStream(streamId: string, userId: string) {
  const q = query(
    streamViewersCol,
    where('streamId', '==', streamId),
    where('userId', '==', userId)
  );
  const snap = await getDocs(q);
  
  const promises = snap.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(promises);

  // Update viewer count
  const viewersSnap = await getDocs(query(streamViewersCol, where('streamId', '==', streamId)));
  await updateViewerCount(streamId, viewersSnap.size);
}

// Stream chat
export async function sendStreamMessage(
  streamId: string, 
  user: { uid: string; displayName: string; photoURL?: string }, 
  message: string,
  type: StreamMessage['type'] = 'message'
) {
  const messageData: Omit<StreamMessage, 'id'> = {
    streamId,
    userId: user.uid,
    userName: user.displayName,
    userPhotoURL: user.photoURL,
    message,
    type,
    createdAt: serverTimestamp(),
  };

  return await addDoc(streamMessagesCol, messageData as any);
}

export function subscribeToStreamMessages(
  streamId: string, 
  onUpdate: (messages: (StreamMessage & { id: string })[]) => void,
  messageLimit = 50
) {
  const q = query(
    streamMessagesCol,
    where('streamId', '==', streamId),
    orderBy('createdAt', 'asc'),
    limit(messageLimit)
  );

  return onSnapshot(q, (snap) => {
    const messages = snap.docs.map(d => ({ id: d.id, ...d.data() })) as (StreamMessage & { id: string })[];
    onUpdate(messages);
  });
}

// WebRTC utilities (basic implementation)
export class SimpleWebRTC {
  private localStream: MediaStream | null = null;
  private peerConnection: RTCPeerConnection | null = null;
  private remoteVideo: HTMLVideoElement | null = null;
  private localVideo: HTMLVideoElement | null = null;

  constructor(localVideo?: HTMLVideoElement, remoteVideo?: HTMLVideoElement) {
    this.localVideo = localVideo || null;
    this.remoteVideo = remoteVideo || null;
  }

  async startLocalStream() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (this.localVideo) {
        this.localVideo.srcObject = this.localStream;
      }

      return this.localStream;
    } catch (error) {
      console.error('Error accessing camera/microphone:', error);
      throw error;
    }
  }

  stopLocalStream() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
  }

  // Screen sharing
  async startScreenShare() {
    try {
      // @ts-ignore - getDisplayMedia is supported in modern browsers
      this.localStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      if (this.localVideo) {
        this.localVideo.srcObject = this.localStream;
      }

      return this.localStream;
    } catch (error) {
      console.error('Error accessing screen share:', error);
      throw error;
    }
  }
}

// Cannabis-specific stream categories
export const STREAM_CATEGORIES = {
  growing: { label: 'Growing Tips', icon: '🌱', description: 'Cannabis cultivation and growing advice' },
  education: { label: 'Education', icon: '📚', description: 'Cannabis education and information' },
  review: { label: 'Product Reviews', icon: '⭐', description: 'Strain and product reviews' },
  cooking: { label: 'Cannabis Cooking', icon: '👨‍🍳', description: 'Edibles and cannabis cooking' },
  dispensary: { label: 'Dispensary Tour', icon: '🏪', description: 'Dispensary visits and tours' },
  general: { label: 'General', icon: '💬', description: 'General cannabis discussion' },
};