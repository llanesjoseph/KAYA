# Testing Guide for KAYA Platform

## Overview

This project uses **Jest** and **React Testing Library** for comprehensive testing of components, API routes, and database functions.

## Test Structure

```
KAYA/
├── jest.config.ts              # Jest configuration
├── jest.setup.ts               # Test setup and global mocks
├── src/
│   ├── lib/
│   │   └── __tests__/
│   │       ├── test-utils.tsx  # Testing utilities and helpers
│   │       └── db.test.ts      # Database function tests
│   ├── app/
│   │   └── api/
│   │       └── __tests__/
│   │           └── bug-report.test.ts  # API route tests
│   └── components/
│       └── __tests__/
│           └── post-card.test.tsx      # Component tests
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (for development)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Coverage Goals

The testing infrastructure targets **80% coverage** for critical paths:

- ✅ **Database Functions** (`src/lib/db.ts`) - Core CRUD operations
- ✅ **API Routes** (`src/app/api/**/route.ts`) - Request validation and handling
- ✅ **Components** (`src/components/**/*.tsx`) - User interactions and rendering

### Current Test Coverage

| Module | Tests | Coverage Focus |
|--------|-------|---------------|
| `db.ts` | 10 tests | User profiles, posts, likes, follows, comments |
| `bug-report API` | 9 tests | Validation, sanitization, error handling |
| `post-card` | 14 tests | Rendering, interactions, accessibility |

## Test Utilities

### Mock Providers

The `test-utils.tsx` provides helper functions for testing:

```typescript
import { renderWithProviders, createMockUser } from '@/lib/__tests__/test-utils';

// Create a mock authenticated user
const mockUser = createMockUser({
  uid: 'test-123',
  email: 'test@example.com',
  displayName: 'Test User',
});

// Render component with auth context
renderWithProviders(<YourComponent />, { user: mockUser });
```

### Firebase Mocking

All Firebase functions are mocked in tests:

```typescript
import { mockFirestore, createMockDocSnapshot } from '@/lib/__tests__/test-utils';

// Mock Firestore responses
mockedGetDoc.mockResolvedValue(
  createMockDocSnapshot({ name: 'John' }, true)
);
```

## Writing New Tests

### 1. Database Function Tests

```typescript
// src/lib/__tests__/your-function.test.ts
import { yourFunction } from '../db';
import { getDoc } from 'firebase/firestore';

jest.mock('firebase/firestore');
const mockedGetDoc = getDoc as jest.MockedFunction<typeof getDoc>;

describe('yourFunction', () => {
  it('should do something', async () => {
    mockedGetDoc.mockResolvedValue(/* mock data */);
    const result = await yourFunction('param');
    expect(result).toBe(/* expected */);
  });
});
```

### 2. API Route Tests

```typescript
// src/app/api/__tests__/your-route.test.ts
import { POST } from '../your-route/route';
import { NextRequest } from 'next/server';

describe('Your API Route', () => {
  it('should validate input', async () => {
    const req = {
      json: jest.fn().mockResolvedValue({ /* data */ }),
    } as unknown as NextRequest;

    const response = await POST(req);
    expect(response.status).toBe(200);
  });
});
```

### 3. Component Tests

```typescript
// src/components/__tests__/your-component.test.tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/lib/__tests__/test-utils';
import { YourComponent } from '../your-component';

describe('YourComponent', () => {
  it('should render correctly', () => {
    renderWithProviders(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    renderWithProviders(<YourComponent />);

    const button = screen.getByRole('button');
    await user.click(button);

    // Assert expected behavior
  });
});
```

## Testing Best Practices

### ✅ DO:
- Write descriptive test names that explain what is being tested
- Test both happy paths and error cases
- Mock external dependencies (Firebase, APIs, etc.)
- Use `waitFor` for async operations
- Test accessibility (screen readers, keyboard navigation)
- Clean up after each test with `beforeEach` and `afterEach`

### ❌ DON'T:
- Test implementation details
- Rely on test execution order
- Mock everything (only mock external dependencies)
- Write overly complex tests
- Ignore warnings and errors in console

## Common Testing Patterns

### Testing Async Operations
```typescript
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### Testing User Interactions
```typescript
const user = userEvent.setup();
const button = screen.getByRole('button', { name: 'Submit' });
await user.click(button);
```

### Testing Forms
```typescript
const input = screen.getByLabelText('Email');
await user.type(input, 'test@example.com');
```

### Testing Error States
```typescript
mockFunction.mockRejectedValue(new Error('Network error'));
// ... trigger error
expect(screen.getByText(/error/i)).toBeInTheDocument();
```

## Debugging Tests

### Run specific test file
```bash
npm test -- db.test.ts
```

### Run tests matching pattern
```bash
npm test -- -t "should create post"
```

### View test coverage for specific file
```bash
npm run test:coverage -- --collectCoverageFrom="src/lib/db.ts"
```

### Enable verbose output
```bash
npm test -- --verbose
```

## CI/CD Integration

Tests are automatically run on:
- Every pull request
- Before deployment
- As part of pre-commit hooks (optional)

To add tests to pre-commit:
```json
{
  "scripts": {
    "precommit": "npm test && npm run security-scan"
  }
}
```

## Troubleshooting

### Issue: "Cannot find module '@/...'"
**Solution:** Ensure `jest.config.ts` has correct path mapping:
```typescript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

### Issue: "ReferenceError: fetch is not defined"
**Solution:** Add to `jest.setup.ts`:
```typescript
global.fetch = jest.fn();
```

### Issue: Firebase initialization errors
**Solution:** Mock Firebase in test files:
```typescript
jest.mock('@/lib/firebase', () => ({
  db: { _type: 'mockDB' },
  auth: { _type: 'mockAuth' },
}));
```

### Issue: "Cannot read property 'mockResolvedValue' of undefined"
**Solution:** Ensure you're casting mocked functions:
```typescript
const mockedFunction = someFunction as jest.MockedFunction<typeof someFunction>;
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Jest Matchers](https://jestjs.io/docs/expect)

## Next Steps

1. **Increase Coverage**: Add tests for remaining components and functions
2. **E2E Tests**: Consider adding Playwright or Cypress for end-to-end testing
3. **Performance Tests**: Add benchmarks for critical database operations
4. **Visual Regression**: Consider Chromatic or Percy for visual testing
5. **Mutation Testing**: Use Stryker to verify test quality

---

**Last Updated:** 2025-10-04
**Maintained By:** KAYA Development Team
