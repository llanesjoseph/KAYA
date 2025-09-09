// Cannabis strain database functionality
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  startAfter,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from './firebase';

export type StrainType = 'indica' | 'sativa' | 'hybrid';
export type GrowingDifficulty = 'beginner' | 'intermediate' | 'expert';

export interface StrainProfile {
  id?: string;
  name: string;
  type: StrainType;
  genetics?: string; // Parent strains
  description: string;
  imageUrl?: string;
  
  // Characteristics
  thcRange: { min: number; max: number }; // Percentage
  cbdRange: { min: number; max: number }; // Percentage
  terpenes: string[]; // Primary terpenes
  flavors: string[]; // Taste profile
  aromas: string[]; // Smell profile
  effects: string[]; // Primary effects
  medicalUses: string[]; // Medical applications
  
  // Growing info
  floweringTime: number; // Days
  growingDifficulty: GrowingDifficulty;
  yieldIndoor?: string; // e.g., "400-500g/m²"
  yieldOutdoor?: string; // e.g., "600-800g per plant"
  height?: string; // Expected plant height
  environment: ('indoor' | 'outdoor' | 'greenhouse')[];
  
  // Reviews & ratings
  overallRating: number; // Average rating out of 5
  totalReviews: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  
  // Meta
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  createdBy: string; // User ID who added this strain
  verified: boolean; // Admin verified information
  tags: string[]; // Additional tags for searchability
}

export interface StrainReview {
  id?: string;
  strainId: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  
  // Review content
  rating: number; // 1-5 stars
  title?: string;
  content: string;
  
  // Detailed ratings
  potency: number; // 1-5
  flavor: number; // 1-5
  aroma: number; // 1-5
  appearance: number; // 1-5
  value: number; // 1-5
  
  // Experience
  consumptionMethod: string; // 'flower', 'vape', 'edible', 'concentrate'
  experience: string; // 'beginner', 'intermediate', 'expert'
  wouldRecommend: boolean;
  
  // Meta
  createdAt: any;
  updatedAt?: any;
  verified: boolean; // Verified purchase/experience
  helpfulCount: number; // Helpful votes
  
  // Optional photos
  imageUrls?: string[];
}

export interface UserStrainList {
  id?: string;
  userId: string;
  name: string; // e.g., "Wishlist", "Currently Growing", "Tried"
  description?: string;
  strainIds: string[];
  isPublic: boolean;
  createdAt: any;
  updatedAt: any;
}

const strainsCol = collection(db, 'strains');
const reviewsCol = collection(db, 'strainReviews');
const userListsCol = collection(db, 'userStrainLists');

// Strain management
export async function createStrain(strainData: Omit<StrainProfile, 'id' | 'createdAt' | 'updatedAt' | 'overallRating' | 'totalReviews' | 'ratingBreakdown'>, createdBy: string) {
  const strain: Omit<StrainProfile, 'id'> = {
    ...strainData,
    overallRating: 0,
    totalReviews: 0,
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy,
    verified: false,
    tags: strainData.tags || [],
  };

  const ref = await addDoc(strainsCol, strain as any);
  return ref.id;
}

export async function getStrain(strainId: string): Promise<StrainProfile | null> {
  const doc = await getDoc(doc(strainsCol, strainId));
  if (!doc.exists()) return null;
  return { id: doc.id, ...doc.data() } as StrainProfile;
}

export async function searchStrains(
  searchTerm?: string,
  filters?: {
    type?: StrainType;
    minTHC?: number;
    maxTHC?: number;
    effects?: string[];
    growingDifficulty?: GrowingDifficulty;
  },
  sortBy: 'name' | 'rating' | 'reviews' | 'newest' = 'name',
  pageSize = 20,
  cursor?: any
) {
  let q = query(strainsCol);
  
  // Apply filters
  if (filters?.type) {
    q = query(q, where('type', '==', filters.type));
  }
  
  if (filters?.effects?.length) {
    q = query(q, where('effects', 'array-contains-any', filters.effects));
  }
  
  if (filters?.growingDifficulty) {
    q = query(q, where('growingDifficulty', '==', filters.growingDifficulty));
  }
  
  // Apply sorting
  switch (sortBy) {
    case 'rating':
      q = query(q, orderBy('overallRating', 'desc'));
      break;
    case 'reviews':
      q = query(q, orderBy('totalReviews', 'desc'));
      break;
    case 'newest':
      q = query(q, orderBy('createdAt', 'desc'));
      break;
    default:
      q = query(q, orderBy('name'));
  }
  
  q = query(q, limit(pageSize));
  
  if (cursor) {
    q = query(q, startAfter(cursor));
  }
  
  const snap = await getDocs(q);
  const strains = snap.docs.map(d => ({ id: d.id, ...d.data() })) as (StrainProfile & { id: string })[];
  
  // Client-side filtering for search term (basic implementation)
  let filteredStrains = strains;
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredStrains = strains.filter(strain =>
      strain.name.toLowerCase().includes(term) ||
      strain.description.toLowerCase().includes(term) ||
      strain.genetics?.toLowerCase().includes(term) ||
      strain.effects.some(effect => effect.toLowerCase().includes(term)) ||
      strain.flavors.some(flavor => flavor.toLowerCase().includes(term))
    );
  }
  
  // Apply THC filters client-side (for more complex queries in production, use composite indexes)
  if (filters?.minTHC !== undefined) {
    filteredStrains = filteredStrains.filter(strain => strain.thcRange.max >= filters.minTHC!);
  }
  
  if (filters?.maxTHC !== undefined) {
    filteredStrains = filteredStrains.filter(strain => strain.thcRange.min <= filters.maxTHC!);
  }
  
  const nextCursor = snap.docs.length ? snap.docs[snap.docs.length - 1] : undefined;
  
  return { strains: filteredStrains, nextCursor };
}

export async function getPopularStrains(limit = 10) {
  const q = query(strainsCol, orderBy('totalReviews', 'desc'), limit(limit));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as (StrainProfile & { id: string })[];
}

export async function getTopRatedStrains(limit = 10) {
  const q = query(strainsCol, orderBy('overallRating', 'desc'), limit(limit));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as (StrainProfile & { id: string })[];
}

// Review management
export async function addStrainReview(
  strainId: string,
  reviewData: Omit<StrainReview, 'id' | 'strainId' | 'createdAt' | 'helpfulCount' | 'verified'>,
) {
  const review: Omit<StrainReview, 'id'> = {
    ...reviewData,
    strainId,
    createdAt: serverTimestamp(),
    helpfulCount: 0,
    verified: false,
  };
  
  const ref = await addDoc(reviewsCol, review as any);
  
  // Update strain rating
  await updateStrainRating(strainId);
  
  return ref.id;
}

async function updateStrainRating(strainId: string) {
  // Get all reviews for this strain
  const reviewsQuery = query(reviewsCol, where('strainId', '==', strainId));
  const reviewsSnap = await getDocs(reviewsQuery);
  
  if (reviewsSnap.empty) return;
  
  const reviews = reviewsSnap.docs.map(d => d.data() as StrainReview);
  
  // Calculate new ratings
  const totalReviews = reviews.length;
  const ratingSum = reviews.reduce((sum, review) => sum + review.rating, 0);
  const overallRating = ratingSum / totalReviews;
  
  // Calculate rating breakdown
  const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(review => {
    ratingBreakdown[review.rating as keyof typeof ratingBreakdown]++;
  });
  
  // Update strain document
  await updateDoc(doc(strainsCol, strainId), {
    overallRating,
    totalReviews,
    ratingBreakdown,
    updatedAt: serverTimestamp(),
  });
}

export async function getStrainReviews(strainId: string, pageSize = 20, cursor?: any) {
  let q = query(
    reviewsCol,
    where('strainId', '==', strainId),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  );
  
  if (cursor) {
    q = query(q, startAfter(cursor));
  }
  
  const snap = await getDocs(q);
  const reviews = snap.docs.map(d => ({ id: d.id, ...d.data() })) as (StrainReview & { id: string })[];
  const nextCursor = snap.docs.length ? snap.docs[snap.docs.length - 1] : undefined;
  
  return { reviews, nextCursor };
}

export async function markReviewHelpful(reviewId: string) {
  await updateDoc(doc(reviewsCol, reviewId), {
    helpfulCount: arrayUnion(1), // Note: This is simplified. In production, track user IDs to prevent duplicate votes
  });
}

// User strain lists
export async function createUserStrainList(
  userId: string,
  name: string,
  description?: string,
  isPublic = false
) {
  const list: Omit<UserStrainList, 'id'> = {
    userId,
    name,
    description,
    strainIds: [],
    isPublic,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  const ref = await addDoc(userListsCol, list as any);
  return ref.id;
}

export async function addStrainToList(listId: string, strainId: string) {
  await updateDoc(doc(userListsCol, listId), {
    strainIds: arrayUnion(strainId),
    updatedAt: serverTimestamp(),
  });
}

export async function removeStrainFromList(listId: string, strainId: string) {
  await updateDoc(doc(userListsCol, listId), {
    strainIds: arrayRemove(strainId),
    updatedAt: serverTimestamp(),
  });
}

export async function getUserStrainLists(userId: string) {
  const q = query(userListsCol, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as (UserStrainList & { id: string })[];
}

// Predefined strain effects, flavors, etc. for UI consistency
export const STRAIN_EFFECTS = [
  'Relaxed', 'Happy', 'Euphoric', 'Uplifted', 'Energetic', 'Creative', 'Focused',
  'Sleepy', 'Hungry', 'Talkative', 'Giggly', 'Aroused', 'Tingly', 'Dry Eyes',
  'Dry Mouth', 'Anxious', 'Dizzy', 'Paranoid', 'Headache'
];

export const STRAIN_FLAVORS = [
  'Earthy', 'Sweet', 'Citrus', 'Fruity', 'Pine', 'Spicy', 'Herbal', 'Diesel',
  'Skunk', 'Berry', 'Mint', 'Vanilla', 'Coffee', 'Cheese', 'Grape', 'Lemon',
  'Orange', 'Apple', 'Mango', 'Tropical', 'Woody', 'Nutty', 'Pepper'
];

export const STRAIN_AROMAS = [
  'Earthy', 'Sweet', 'Pungent', 'Pine', 'Citrus', 'Fruity', 'Floral', 'Spicy',
  'Herbal', 'Diesel', 'Skunk', 'Berry', 'Mint', 'Vanilla', 'Coffee', 'Woody',
  'Fresh', 'Sharp', 'Musky', 'Chemical', 'Ammonia', 'Tree Fruit', 'Tropical'
];

export const MEDICAL_USES = [
  'Pain Relief', 'Anxiety', 'Depression', 'Insomnia', 'Nausea', 'Loss of Appetite',
  'Muscle Spasms', 'Inflammation', 'Headaches', 'Migraines', 'PTSD', 'ADHD',
  'Bipolar Disorder', 'Chronic Pain', 'Arthritis', 'Fibromyalgia', 'Glaucoma',
  'Epilepsy', 'Cancer Symptoms', 'Crohn\'s Disease'
];

export const PRIMARY_TERPENES = [
  'Myrcene', 'Limonene', 'Pinene', 'Caryophyllene', 'Humulene', 'Linalool',
  'Terpinolene', 'Ocimene', 'Bisabolol', 'Camphene', 'Carene', 'Eucalyptol',
  'Fenchol', 'Geraniol', 'Guaiol', 'Isopulegol', 'Nerolidol', 'Phellandrene',
  'Pulegone', 'Sabinene', 'Terpineol', 'Valencene'
];