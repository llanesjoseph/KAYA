'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { KayaHubLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showResetSuccess, setShowResetSuccess] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/home');
    }
  }, [user, authLoading, router]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!auth) {
      setError('Authentication service is not available. Please try again later.');
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Signed In!',
        description: 'Welcome back! Redirecting you to the homepage.',
      });
      router.push('/home');
    } catch (error: any) {
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        setError('Invalid email or password.');
      } else {
        setError('An unexpected error occurred. Please try again.');
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);

    if (!auth || !db) {
      setError('Authentication service is not available. Please try again later.');
      setGoogleLoading(false);
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // For new Google users, redirect to age verification
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
          bio: '',
          createdAt: new Date(),
          needsAgeVerification: true,
        });
        
        router.push('/verify-age');
        return;
      }
      
      // Existing user - check if they need age verification
      const userData = userDoc.data();
      if (userData.needsAgeVerification) {
        router.push('/verify-age');
        return;
      }
      
      toast({
        title: 'Signed In!',
        description: 'Welcome back to Kaya! Redirecting you to the homepage.',
      });
      router.push('/home');

    } catch (error: any) {
       if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in process was cancelled.');
      } else {
        setError('Failed to sign in with Google. Please try again.');
        console.error(error);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }

    if (!auth) {
      setError('Authentication service is not available. Please try again later.');
      return;
    }

    setError(null);
    setResetLoading(true);
    setShowResetSuccess(false);

    try {
      await sendPasswordResetEmail(auth, email);
      setShowResetSuccess(true);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else {
        setError('Failed to send password reset email. Please try again.');
      }
      console.error('Password reset error:', error);
    } finally {
      setResetLoading(false);
    }
  };

  if (authLoading || user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <KayaHubLogo className="h-20 w-auto" />
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to continue to your Digital Sacred Grove.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {showResetSuccess && (
              <Alert className="mb-4">
                <AlertDescription>
                  Password reset email sent! Check your inbox for reset instructions.
                </AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="kaya@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || googleLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || googleLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading || googleLoading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
              <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading || googleLoading}>
                {googleLoading ? 'Signing In...' : 'Sign In with Google'}
              </Button>
            </form>
            
            <div className="mt-4 text-center text-sm">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handlePasswordReset}
                disabled={resetLoading || loading || googleLoading}
                className="text-xs"
              >
                {resetLoading ? 'Sending...' : 'Forgot password?'}
              </Button>
            </div>
            
            <div className="mt-2 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
