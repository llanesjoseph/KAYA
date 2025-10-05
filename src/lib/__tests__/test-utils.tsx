import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AuthContextProvider } from '@/context/auth-context';
import { User } from 'firebase/auth';

// Mock Firebase Auth User
export const createMockUser = (overrides?: Partial<User>): User => ({
  uid: 'test-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: 'https://example.com/avatar.jpg',
  emailVerified: true,
  isAnonymous: false,
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString(),
  },
  providerData: [],
  refreshToken: 'mock-refresh-token',
  tenantId: null,
  delete: jest.fn(),
  getIdToken: jest.fn(),
  getIdTokenResult: jest.fn(),
  reload: jest.fn(),
  toJSON: jest.fn(),
  phoneNumber: null,
  providerId: 'firebase',
  ...overrides,
} as User);

// Mock Auth Context Provider
export const MockAuthProvider = ({
  children,
  user = null,
  loading = false
}: {
  children: React.ReactNode;
  user?: User | null;
  loading?: boolean;
}) => {
  const mockAuthContext = {
    user,
    loading,
  };

  return (
    <AuthContextProvider>
      {children}
    </AuthContextProvider>
  );
};

// Custom render with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  user?: User | null;
  loading?: boolean;
}

export function renderWithProviders(
  ui: ReactElement,
  { user = null, loading = false, ...renderOptions }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MockAuthProvider user={user} loading={loading}>
        {children}
      </MockAuthProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    user,
  };
}

// Mock Firestore functions
export const mockFirestore = {
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  startAfter: jest.fn(),
  serverTimestamp: jest.fn(() => ({ seconds: Date.now() / 1000, nanoseconds: 0 })),
  increment: jest.fn((n: number) => ({ increment: n })),
  arrayUnion: jest.fn((...items: any[]) => ({ arrayUnion: items })),
  runTransaction: jest.fn(),
  writeBatch: jest.fn(() => ({
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    commit: jest.fn(),
  })),
  onSnapshot: jest.fn((query, callback) => {
    callback({ docs: [], size: 0 });
    return jest.fn(); // unsubscribe function
  }),
};

// Mock Firebase Storage
export const mockStorage = {
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(() => Promise.resolve('https://example.com/uploaded-file.jpg')),
};

// Helper to create mock Firestore document snapshot
export const createMockDocSnapshot = (data: any, exists = true) => ({
  exists: () => exists,
  data: () => data,
  id: 'mock-doc-id',
  ref: { id: 'mock-doc-id' },
});

// Helper to create mock Firestore query snapshot
export const createMockQuerySnapshot = (docs: any[] = []) => ({
  docs: docs.map((data, index) => ({
    id: `mock-doc-${index}`,
    data: () => data,
    ref: { id: `mock-doc-${index}` },
  })),
  empty: docs.length === 0,
  size: docs.length,
  forEach: (callback: (doc: any) => void) => docs.forEach((data, index) =>
    callback({
      id: `mock-doc-${index}`,
      data: () => data,
      ref: { id: `mock-doc-${index}` },
    })
  ),
});

// Wait for async updates
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
