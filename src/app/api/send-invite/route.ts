import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

// Validation schema for invite requests
const InviteSchema = z.object({
  recipientEmail: z.string().email('Invalid recipient email address'),
  inviterName: z.string().min(1, 'Inviter name is required').max(100, 'Inviter name too long'),
  inviteMessage: z.string().max(1000, 'Invite message too long').optional(),
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
// or Next.js middleware to prevent spam (e.g., max 10 invites per hour per user/IP)

export async function POST(req: NextRequest) {
  // Initialize Resend at runtime
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // Parse and validate request body
    const body = await req.json();
    const validatedData = InviteSchema.parse(body);

    // Sanitize user-provided text to prevent XSS
    const sanitizedInviterName = sanitizeHtml(validatedData.inviterName);
    const sanitizedInviteMessage = validatedData.inviteMessage
      ? sanitizeHtml(validatedData.inviteMessage)
      : undefined;

    // Build email HTML with sanitized data
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background: #ffffff;
              padding: 40px 30px;
              border: 1px solid #e5e7eb;
              border-top: none;
              border-radius: 0 0 8px 8px;
            }
            .invite-box {
              background: #f9fafb;
              padding: 20px;
              border-left: 4px solid #667eea;
              border-radius: 4px;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 14px 40px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 32px;">🌿 Join KAYA!</h1>
          </div>
          <div class="content">
            <p>
              <strong>${sanitizedInviterName}</strong> has invited you to join KAYA – a cannabis education
              and community platform!
            </p>

            ${sanitizedInviteMessage ? `
            <div class="invite-box">
              <p style="margin: 0;"><strong>Personal message from ${sanitizedInviterName}:</strong></p>
              <p style="margin: 10px 0 0 0;">"${sanitizedInviteMessage}"</p>
            </div>
            ` : ''}

            <p>
              KAYA brings together cannabis enthusiasts, educators, cultivators, and industry
              professionals in one place to learn, share, and connect.
            </p>

            <h3>What you can do on KAYA:</h3>
            <ul>
              <li>📚 Access educational content about cannabis</li>
              <li>🤝 Connect with like-minded individuals</li>
              <li>💼 Explore cannabis industry opportunities</li>
              <li>📅 Discover events and networking opportunities</li>
              <li>💬 Share your knowledge and experiences</li>
            </ul>

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/signup" class="button">
                Accept Invitation
              </a>
            </div>

            <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
              This invitation was sent by ${sanitizedInviterName}. If you don't want to receive invitations
              like this, you can safely ignore this email.
            </p>
          </div>
        </body>
      </html>
    `;

    // Send email via Resend
    const data = await resend.emails.send({
      from: 'KAYA <notifications@kayamail.crucibleanalytics.dev>',
      to: validatedData.recipientEmail,
      subject: `${sanitizedInviterName} invited you to join KAYA 🌿`,
      html: emailHtml,
      replyTo: `support@kayamail.crucibleanalytics.dev`,
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
    console.error('Failed to send invite:', error);
    return NextResponse.json(
      { error: 'Failed to send invite' },
      { status: 500 }
    );
  }
}
