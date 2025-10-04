import { NextRequest, NextResponse } from 'next/server';
import { sendInviteEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recipientEmail, inviterName, inviteMessage } = body;

    if (!recipientEmail || !inviterName) {
      return NextResponse.json(
        { error: 'Recipient email and inviter name are required' },
        { status: 400 }
      );
    }

    const result = await sendInviteEmail(recipientEmail, inviterName, inviteMessage);

    if (result.success) {
      return NextResponse.json({ success: true, data: result.data });
    } else {
      return NextResponse.json(
        { error: 'Failed to send invite', details: result.error },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Failed to send invite:', error);
    return NextResponse.json(
      { error: 'Failed to send invite', details: error.message },
      { status: 500 }
    );
  }
}
