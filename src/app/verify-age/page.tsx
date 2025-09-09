'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { differenceInYears, format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';

import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { KayaHubLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function VerifyAgePage() {
  const [dob, setDob] = useState<Date>();
  const [ageAttestation, setAgeAttestation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if user is not authenticated or doesn't need age verification
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!dob) {
      setError('Please provide your date of birth.');
      return;
    }

    const age = differenceInYears(new Date(), dob);
    if (age < 21) {
      setError('You must be 21 or older to use Kaya.');
      return;
    }

    if (!ageAttestation) {
      setError('You must confirm that you are 21 or older.');
      return;
    }

    if (!user) {
      setError('You must be logged in to complete verification.');
      return;
    }

    setLoading(true);
    try {
      // Update user profile with age verification
      await updateDoc(doc(db, 'users', user.uid), {
        dob: dob,
        needsAgeVerification: false, // Remove the flag
        ageVerifiedAt: new Date(),
      });

      toast({
        title: 'Age Verified!',
        description: 'Welcome to Kaya! Redirecting you to the homepage.',
      });

      router.push('/home');
    } catch (error: any) {
      setError('Failed to verify age. Please try again.');
      console.error('Age verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <KayaHubLogo className="mx-auto h-12 w-auto" />
          <h1 className="mt-6 text-3xl font-bold tracking-tight">
            Age Verification Required
          </h1>
          <p className="mt-2 text-muted-foreground">
            Complete your profile to access Kaya
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Verify Your Age</CardTitle>
            <CardDescription>
              You must be 21+ years old to access cannabis-related content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="dob"
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !dob && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dob ? format(dob, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dob}
                      onSelect={setDob}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      captionLayout="dropdown-buttons"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="age-attestation"
                  checked={ageAttestation}
                  onCheckedChange={setAgeAttestation}
                />
                <Label htmlFor="age-attestation" className="text-sm">
                  I confirm that I am 21 years of age or older *
                </Label>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !dob || !ageAttestation}
              >
                {loading ? 'Verifying...' : 'Verify Age & Continue'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-xs text-center text-muted-foreground">
          Your date of birth is used only for age verification and is stored securely.
        </p>
      </div>
    </div>
  );
}