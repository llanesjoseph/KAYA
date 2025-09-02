"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { differenceInYears } from 'date-fns';

export default function AgeCheckPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/';
  const [dob, setDob] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const date = new Date(dob);
      const age = differenceInYears(new Date(), date);
      if (isNaN(date.getTime())) {
        setError('Please provide a valid date.');
        return;
      }
      if (age < 21) {
        setError('You must be 21 or older to enter.');
        return;
      }
      setLoading(true);
      await fetch('/api/age-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: true })
      });
      router.push(next);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Age Verification</CardTitle>
          <CardDescription>
            You must be 21+ years old to access this site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label htmlFor="dob" className="block text-sm font-medium mb-1">Date of birth</label>
              <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Verifying...' : 'Enter'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

