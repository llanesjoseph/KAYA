import { POST } from '../bug-report/route';
import { NextRequest } from 'next/server';
import { Resend } from 'resend';

// Mock Resend
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({
        id: 'mock-email-id',
        from: 'KAYA Bug Reporter <bugs@bugs.crucibleanalytics.dev>',
        to: ['llanes.joseph.m@gmail.com'],
      }),
    },
  })),
}));

// Mock environment variables
const originalEnv = process.env;

describe('Bug Report API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      RESEND_API_KEY: 'test-api-key',
      BUG_REPORT_EMAIL: 'test@example.com',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  const createMockRequest = (body: any): NextRequest => {
    return {
      json: jest.fn().mockResolvedValue(body),
    } as unknown as NextRequest;
  };

  const validBugReport = {
    description: 'Test bug description that is long enough to pass validation',
    email: 'reporter@example.com',
    userName: 'Test User',
    userId: 'user123',
    consoleLogs: 'console.log("test")',
    browserInfo: {
      userAgent: 'Mozilla/5.0',
      platform: 'Win32',
      language: 'en-US',
      screenResolution: '1920x1080',
      viewport: '1200x800',
      url: 'https://example.com/page',
    },
  };

  describe('Validation', () => {
    it('should reject request with missing description', async () => {
      const req = createMockRequest({
        ...validBugReport,
        description: '',
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
      expect(data.details).toBeDefined();
    });

    it('should reject request with description too short', async () => {
      const req = createMockRequest({
        ...validBugReport,
        description: 'Too short',
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
    });

    it('should reject request with invalid email', async () => {
      const req = createMockRequest({
        ...validBugReport,
        email: 'invalid-email',
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
    });

    it('should reject request with missing browserInfo', async () => {
      const req = createMockRequest({
        description: 'Test bug description that is long enough',
        email: 'reporter@example.com',
        userName: 'Test User',
        userId: 'user123',
        consoleLogs: 'test logs',
        // Missing browserInfo
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
    });

    it('should reject request with invalid URL in browserInfo', async () => {
      const req = createMockRequest({
        ...validBugReport,
        browserInfo: {
          ...validBugReport.browserInfo,
          url: 'not-a-valid-url',
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
    });

    it('should reject request with description over 5000 characters', async () => {
      const req = createMockRequest({
        ...validBugReport,
        description: 'a'.repeat(5001),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
    });
  });

  describe('Successful Bug Reports', () => {
    it('should successfully send bug report with valid data', async () => {
      const req = createMockRequest(validBugReport);

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();

      // Verify Resend was called
      const ResendMock = Resend as jest.MockedClass<typeof Resend>;
      const resendInstance = ResendMock.mock.results[0].value;
      expect(resendInstance.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'KAYA Bug Reporter <bugs@bugs.crucibleanalytics.dev>',
          to: ['test@example.com'],
          replyTo: 'reporter@example.com',
          subject: expect.stringContaining('Bug Report'),
        })
      );
    });

    it('should sanitize HTML in bug report content', async () => {
      const req = createMockRequest({
        ...validBugReport,
        description: '<script>alert("XSS")</script> This is a bug',
        userName: '<img src=x onerror=alert(1)>',
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      // Verify sanitization by checking the email content
      const ResendMock = Resend as jest.MockedClass<typeof Resend>;
      const resendInstance = ResendMock.mock.results[0].value;
      const emailCall = resendInstance.emails.send.mock.calls[0][0];

      // The HTML should have escaped characters
      expect(emailCall.html).toContain('&lt;script&gt;');
      expect(emailCall.html).toContain('&lt;img');
      expect(emailCall.html).not.toContain('<script>');
    });

    it('should handle empty console logs gracefully', async () => {
      const req = createMockRequest({
        ...validBugReport,
        consoleLogs: '',
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should truncate long description in email subject', async () => {
      const longDescription = 'a'.repeat(100);
      const req = createMockRequest({
        ...validBugReport,
        description: longDescription,
      });

      const response = await POST(req);

      expect(response.status).toBe(200);

      const ResendMock = Resend as jest.MockedClass<typeof Resend>;
      const resendInstance = ResendMock.mock.results[0].value;
      const emailCall = resendInstance.emails.send.mock.calls[0][0];

      expect(emailCall.subject).toContain('...');
      expect(emailCall.subject.length).toBeLessThan(100);
    });
  });

  describe('Error Handling', () => {
    it('should handle Resend API errors gracefully', async () => {
      // Mock Resend to throw an error
      const ResendMock = Resend as jest.MockedClass<typeof Resend>;
      ResendMock.mockImplementationOnce(() => ({
        emails: {
          send: jest.fn().mockRejectedValue(new Error('Resend API Error')),
        },
      }) as any);

      const req = createMockRequest(validBugReport);

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to send bug report');
      expect(data.details).toBeUndefined(); // Should not expose error details
    });

    it('should handle malformed JSON', async () => {
      const req = {
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as unknown as NextRequest;

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to send bug report');
    });
  });

  describe('Security', () => {
    it('should prevent XSS attacks in all user inputs', async () => {
      const xssPayload = '<script>alert("XSS")</script>';
      const req = createMockRequest({
        description: xssPayload + ' ' + validBugReport.description,
        email: validBugReport.email,
        userName: xssPayload,
        userId: xssPayload,
        consoleLogs: xssPayload,
        browserInfo: {
          userAgent: xssPayload,
          platform: xssPayload,
          language: xssPayload,
          screenResolution: xssPayload,
          viewport: xssPayload,
          url: validBugReport.browserInfo.url,
        },
      });

      const response = await POST(req);

      expect(response.status).toBe(200);

      const ResendMock = Resend as jest.MockedClass<typeof Resend>;
      const resendInstance = ResendMock.mock.results[0].value;
      const emailCall = resendInstance.emails.send.mock.calls[0][0];

      // Verify all script tags are escaped
      expect(emailCall.html).not.toContain('<script>');
      expect(emailCall.html).toContain('&lt;script&gt;');
    });

    it('should sanitize SQL injection attempts', async () => {
      const sqlPayload = "'; DROP TABLE users; --";
      const req = createMockRequest({
        ...validBugReport,
        description: sqlPayload + ' This is a bug report',
        userId: sqlPayload,
      });

      const response = await POST(req);

      expect(response.status).toBe(200);

      const ResendMock = Resend as jest.MockedClass<typeof Resend>;
      const resendInstance = ResendMock.mock.results[0].value;
      const emailCall = resendInstance.emails.send.mock.calls[0][0];

      // SQL special characters should be escaped
      expect(emailCall.html).toContain('&#039;');
    });
  });
});
