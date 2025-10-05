import { Resend } from 'resend';

// Email domains
const NOTIFICATION_DOMAIN = 'kayamail.crucibleanalytics.dev';
const BUG_DOMAIN = 'bugs.crucibleanalytics.dev';

// Lazy-load Resend to avoid build-time errors
let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Send notification email from kayamail.crucibleanalytics.dev
 */
export async function sendNotificationEmail(options: EmailOptions) {
  try {
    const resend = getResend();
    const data = await resend.emails.send({
      from: `KAYA <notifications@${NOTIFICATION_DOMAIN}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo || `support@${NOTIFICATION_DOMAIN}`,
    });

    return { success: true, data };
  } catch (error: any) {
    console.error('Failed to send notification email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const html = `
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
          .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
          .features {
            background: #f9fafb;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
          }
          .feature-item {
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0; font-size: 32px;">🌿 Welcome to KAYA!</h1>
        </div>
        <div class="content">
          <h2>Hi ${userName}! 👋</h2>
          <p>
            Welcome to <strong>KAYA</strong> – your cannabis education and community platform!
          </p>
          <p>
            We're excited to have you join our community of cannabis enthusiasts, educators,
            cultivators, and industry professionals.
          </p>

          <div class="features">
            <h3>Here's what you can do on KAYA:</h3>
            <div class="feature-item">📚 <strong>Learn:</strong> Access educational articles about cannabis news, legal updates, and cultivation</div>
            <div class="feature-item">🤝 <strong>Connect:</strong> Follow other users and engage with the community</div>
            <div class="feature-item">💼 <strong>Grow:</strong> Explore job opportunities in the cannabis industry</div>
            <div class="feature-item">📅 <strong>Network:</strong> Discover and attend cannabis industry events</div>
            <div class="feature-item">💬 <strong>Share:</strong> Post your insights and join discussions</div>
          </div>

          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" class="button">
              Get Started
            </a>
          </div>

          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            Need help? Reply to this email or visit our help center.
          </p>

          <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
            Happy exploring! 🌿<br>
            The KAYA Team
          </p>
        </div>
      </body>
    </html>
  `;

  return sendNotificationEmail({
    to: userEmail,
    subject: '🌿 Welcome to KAYA – Let\'s Get Started!',
    html,
  });
}

/**
 * Send notification for new follower
 */
export async function sendFollowerNotification(
  recipientEmail: string,
  recipientName: string,
  followerName: string,
  followerProfileUrl: string
) {
  const html = `
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
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
            border-radius: 0 0 8px 8px;
          }
          .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">👥 New Follower!</h1>
        </div>
        <div class="content">
          <p>Hi ${recipientName},</p>
          <p>
            <strong>${followerName}</strong> just started following you on KAYA!
          </p>
          <p>
            Connect with them and check out their profile to see what they're interested in.
          </p>
          <div style="text-align: center;">
            <a href="${followerProfileUrl}" class="button">
              View Profile
            </a>
          </div>
          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            The KAYA Team 🌿
          </p>
        </div>
      </body>
    </html>
  `;

  return sendNotificationEmail({
    to: recipientEmail,
    subject: `${followerName} started following you on KAYA`,
    html,
  });
}

/**
 * Send notification for new comment
 */
export async function sendCommentNotification(
  recipientEmail: string,
  recipientName: string,
  commenterName: string,
  commentText: string,
  postUrl: string
) {
  const html = `
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
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
            border-radius: 0 0 8px 8px;
          }
          .comment-box {
            background: #f9fafb;
            padding: 15px;
            border-left: 4px solid #667eea;
            border-radius: 4px;
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">💬 New Comment</h1>
        </div>
        <div class="content">
          <p>Hi ${recipientName},</p>
          <p>
            <strong>${commenterName}</strong> commented on your post:
          </p>
          <div class="comment-box">
            "${commentText}"
          </div>
          <div style="text-align: center;">
            <a href="${postUrl}" class="button">
              View Comment
            </a>
          </div>
          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            The KAYA Team 🌿
          </p>
        </div>
      </body>
    </html>
  `;

  return sendNotificationEmail({
    to: recipientEmail,
    subject: `${commenterName} commented on your post`,
    html,
  });
}

/**
 * Send notification for new like
 */
export async function sendLikeNotification(
  recipientEmail: string,
  recipientName: string,
  likerName: string,
  postUrl: string
) {
  const html = `
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
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
            border-radius: 0 0 8px 8px;
          }
          .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">❤️ New Like</h1>
        </div>
        <div class="content">
          <p>Hi ${recipientName},</p>
          <p>
            <strong>${likerName}</strong> liked your post!
          </p>
          <div style="text-align: center;">
            <a href="${postUrl}" class="button">
              View Post
            </a>
          </div>
          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            The KAYA Team 🌿
          </p>
        </div>
      </body>
    </html>
  `;

  return sendNotificationEmail({
    to: recipientEmail,
    subject: `${likerName} liked your post on KAYA`,
    html,
  });
}

/**
 * Send invite email
 */
export async function sendInviteEmail(
  recipientEmail: string,
  inviterName: string,
  inviteMessage?: string
) {
  const html = `
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
            <strong>${inviterName}</strong> has invited you to join KAYA – a cannabis education
            and community platform!
          </p>

          ${inviteMessage ? `
          <div class="invite-box">
            <p style="margin: 0;"><strong>Personal message from ${inviterName}:</strong></p>
            <p style="margin: 10px 0 0 0;">"${inviteMessage}"</p>
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
            This invitation was sent by ${inviterName}. If you don't want to receive invitations
            like this, you can safely ignore this email.
          </p>
        </div>
      </body>
    </html>
  `;

  return sendNotificationEmail({
    to: recipientEmail,
    subject: `${inviterName} invited you to join KAYA 🌿`,
    html,
  });
}
