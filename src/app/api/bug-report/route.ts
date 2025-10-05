import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

// Validation schema for bug reports
const BugReportSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000, 'Description too long'),
  email: z.string().email('Invalid email address'),
  userName: z.string().min(1).max(100, 'Name too long'),
  userId: z.string().min(1),
  consoleLogs: z.string().max(50000, 'Console logs too large'),
  browserInfo: z.object({
    userAgent: z.string(),
    platform: z.string(),
    language: z.string(),
    screenResolution: z.string(),
    viewport: z.string(),
    url: z.string().url('Invalid URL'),
  }),
});

// Sanitize HTML to prevent XSS attacks
function sanitizeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// TODO: Implement rate limiting - consider using a library like 'rate-limiter-flexible'
// or Next.js middleware to prevent abuse (e.g., max 5 bug reports per hour per IP)

export async function POST(req: NextRequest) {
  // Initialize Resend at runtime to avoid build-time errors
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // Parse and validate request body
    const body = await req.json();
    const validatedData = BugReportSchema.parse(body);

    // Sanitize all user-provided text for HTML injection
    const sanitizedDescription = sanitizeHtml(validatedData.description);
    const sanitizedUserName = sanitizeHtml(validatedData.userName);
    const sanitizedEmail = sanitizeHtml(validatedData.email);
    const sanitizedUserId = sanitizeHtml(validatedData.userId);
    const sanitizedConsoleLogs = sanitizeHtml(validatedData.consoleLogs);
    const sanitizedBrowserInfo = {
      userAgent: sanitizeHtml(validatedData.browserInfo.userAgent),
      platform: sanitizeHtml(validatedData.browserInfo.platform),
      language: sanitizeHtml(validatedData.browserInfo.language),
      screenResolution: sanitizeHtml(validatedData.browserInfo.screenResolution),
      viewport: sanitizeHtml(validatedData.browserInfo.viewport),
      url: sanitizeHtml(validatedData.browserInfo.url),
    };

    // Build email HTML with sanitized data
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border: 1px solid #e5e7eb;
            }
            .section {
              background: white;
              padding: 20px;
              margin-bottom: 20px;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
            }
            .section h3 {
              margin-top: 0;
              color: #667eea;
              border-bottom: 2px solid #667eea;
              padding-bottom: 10px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 150px 1fr;
              gap: 10px;
            }
            .info-label {
              font-weight: 600;
              color: #6b7280;
            }
            .console-logs {
              background: #1f2937;
              color: #e5e7eb;
              padding: 15px;
              border-radius: 6px;
              overflow-x: auto;
              font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
              font-size: 12px;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            .bug-icon {
              font-size: 48px;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="bug-icon">🐛</div>
            <h1 style="margin: 0;">Bug Report from KAYA</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">
              ${new Date().toLocaleString('en-US', {
                dateStyle: 'full',
                timeStyle: 'long'
              })}
            </p>
          </div>

          <div class="content">
            <div class="section">
              <h3>🔴 Bug Description</h3>
              <p style="white-space: pre-wrap;">${sanitizedDescription}</p>
            </div>

            <div class="section">
              <h3>👤 Reporter Information</h3>
              <div class="info-grid">
                <span class="info-label">Name:</span>
                <span>${sanitizedUserName}</span>

                <span class="info-label">Email:</span>
                <span>${sanitizedEmail}</span>

                <span class="info-label">User ID:</span>
                <span>${sanitizedUserId}</span>

                <span class="info-label">Page URL:</span>
                <span>${sanitizedBrowserInfo.url}</span>
              </div>
            </div>

            <div class="section">
              <h3>💻 Browser & Device Information</h3>
              <div class="info-grid">
                <span class="info-label">User Agent:</span>
                <span style="word-break: break-all;">${sanitizedBrowserInfo.userAgent}</span>

                <span class="info-label">Platform:</span>
                <span>${sanitizedBrowserInfo.platform}</span>

                <span class="info-label">Language:</span>
                <span>${sanitizedBrowserInfo.language}</span>

                <span class="info-label">Screen:</span>
                <span>${sanitizedBrowserInfo.screenResolution}</span>

                <span class="info-label">Viewport:</span>
                <span>${sanitizedBrowserInfo.viewport}</span>
              </div>
            </div>

            <div class="section">
              <h3>📋 Console Logs (Last 100 entries)</h3>
              <div class="console-logs">${sanitizedConsoleLogs || 'No logs available'}</div>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">
                This bug report was automatically generated by KAYA Bug Reporter
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email via Resend
    const data = await resend.emails.send({
      from: 'KAYA Bug Reporter <bugs@bugs.crucibleanalytics.dev>',
      to: [process.env.BUG_REPORT_EMAIL || 'llanes.joseph.m@gmail.com'],
      replyTo: validatedData.email,
      subject: `🐛 Bug Report: ${sanitizedDescription.substring(0, 50)}${sanitizedDescription.length > 50 ? '...' : ''}`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    // Handle other errors without exposing sensitive details
    console.error('Bug report error:', error);
    return NextResponse.json(
      { error: 'Failed to send bug report' },
      { status: 500 }
    );
  }
}
