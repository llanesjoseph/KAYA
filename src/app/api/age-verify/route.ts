import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createHmac } from 'crypto';

// Validation schema for age verification
const AgeVerifySchema = z.object({
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (use YYYY-MM-DD)'),
});

// Calculate age from date of birth
function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Adjust age if birthday hasn't occurred this year yet
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

// Create cryptographic signature to prevent cookie tampering
function createSignature(value: string): string {
  const secret = process.env.AGE_VERIFY_SECRET || 'default-secret-change-in-production';
  return createHmac('sha256', secret)
    .update(value)
    .digest('hex');
}

// Create signed cookie value
function createSignedValue(timestamp: number): string {
  const value = timestamp.toString();
  const signature = createSignature(value);
  return `${value}.${signature}`;
}

// TODO: Implement rate limiting - consider using Next.js middleware to prevent
// brute force attempts (e.g., max 5 attempts per hour per IP)

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const validatedData = AgeVerifySchema.parse(body);

    // Verify the date is valid
    const birthDate = new Date(validatedData.dateOfBirth);
    if (isNaN(birthDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date of birth' },
        { status: 400 }
      );
    }

    // Verify date is not in the future
    if (birthDate > new Date()) {
      return NextResponse.json(
        { error: 'Date of birth cannot be in the future' },
        { status: 400 }
      );
    }

    // Calculate age and verify user is 21 or older
    const age = calculateAge(validatedData.dateOfBirth);
    if (age < 21) {
      return NextResponse.json(
        { error: 'You must be 21 or older to access this site', verified: false },
        { status: 403 }
      );
    }

    // Create response with verified status
    const res = NextResponse.json({ verified: true, ok: true });

    // Create signed cookie value with timestamp to prevent tampering
    const timestamp = Date.now();
    const signedValue = createSignedValue(timestamp);

    // Set secure, httpOnly cookie marking verification
    res.cookies.set('ageVerified', signedValue, {
      httpOnly: true, // Prevent JavaScript access to cookie
      sameSite: 'lax', // CSRF protection
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return res;
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    // Handle other errors without exposing sensitive details
    console.error('Age verification error:', error);
    return NextResponse.json(
      { error: 'Age verification failed' },
      { status: 500 }
    );
  }
}

