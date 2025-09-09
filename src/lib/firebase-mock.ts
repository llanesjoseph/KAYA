// Temporary mock Firebase for development without real Firebase config
// This allows the app to run for UI testing without Firebase backend

export const mockAuth = {
  currentUser: null,
  onAuthStateChanged: () => () => {},
  signInWithEmailAndPassword: async () => ({ user: { uid: 'mock-user', email: 'test@example.com' } }),
  createUserWithEmailAndPassword: async () => ({ user: { uid: 'mock-user', email: 'test@example.com' } }),
  signOut: async () => {},
};

export const mockDb = {
  collection: () => ({
    add: async () => ({ id: 'mock-doc-id' }),
    doc: () => ({
      get: async () => ({ exists: false, data: () => null }),
      set: async () => {},
      update: async () => {},
    }),
  }),
};

export const mockStorage = {
  ref: () => ({
    put: async () => ({ ref: { getDownloadURL: async () => 'mock-url' } }),
  }),
};

// Export mocked Firebase services
export const app = {};
export const db = mockDb;
export const auth = mockAuth;
export const storage = mockStorage;
export const analytics = null;