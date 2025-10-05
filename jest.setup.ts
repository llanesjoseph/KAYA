import '@testing-library/jest-dom';

// Polyfill for fetch (required by Next.js and Firebase)
global.fetch = jest.fn();
global.Request = jest.fn() as any;
global.Headers = jest.fn() as any;

// Proper Response mock with json() method
global.Response = class Response {
  static json(body: any, init?: ResponseInit) {
    return new Response(JSON.stringify(body), {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
  }

  constructor(public body: any, public init?: ResponseInit) {}

  async json() {
    return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
  }

  get status() {
    return this.init?.status || 200;
  }

  get headers() {
    return new Map(Object.entries(this.init?.headers || {}));
  }
} as any;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Suppress console errors in tests (optional)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

// Mock lucide-react icons (use string returns to avoid JSX in .ts file)
jest.mock('lucide-react', () => ({
  Heart: () => 'Heart',
  MessageSquare: () => 'MessageSquare',
  Share2: () => 'Share2',
  MoreHorizontal: () => 'MoreHorizontal',
  MoreVertical: () => 'MoreVertical',
  Flag: () => 'Flag',
  UserPlus: () => 'UserPlus',
  UserMinus: () => 'UserMinus',
  Send: () => 'Send',
  X: () => 'X',
  ChevronDown: () => 'ChevronDown',
  Check: () => 'Check',
}));
