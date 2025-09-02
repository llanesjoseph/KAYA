"use client";
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AuthGuard } from '@/components/auth-guard';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { uploadMediaAndGetUrl } from '@/lib/db';
import { Input as FileInput } from '@/components/ui/input';
import { CropperDialog } from '@/components/ui/cropper-dialog';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [roles, setRoles] = useState<string>('');
  const [expertise, setExpertise] = useState<string>('');
  const [links, setLinks] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);
  const [cropTarget, setCropTarget] = useState<'avatar' | 'banner' | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setUsername(user.email ? user.email.split('@')[0] : '');
    }
  }, [user]);

  const onSave = async () => {
    if (!user) return;
    let photoURL = user.photoURL || null;
    let bannerUrl: string | null | undefined;
    if (avatarFile) photoURL = await uploadMediaAndGetUrl(avatarFile, 'avatars');
    if (bannerFile) bannerUrl = await uploadMediaAndGetUrl(bannerFile, 'banners');
    await updateDoc(doc(db, 'users', user.uid), {
      displayName: name,
      bio,
      photoURL,
      bannerUrl: bannerUrl || null,
      roles: roles.split(',').map(s => s.trim()).filter(Boolean),
      expertiseTags: expertise.split(',').map(s => s.trim()).filter(Boolean),
      links: links.split(',').map(s => s.trim()).filter(Boolean).map((url: string) => ({ label: url, url })),
      private: isPrivate,
    });
  };
  return (
    <AuthGuard>
      <AppShell>
        <div className="w-full p-4 sm:p-6 lg:p-8">
          <header className="mb-8">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight lg:text-5xl">
              Settings
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Manage your account and privacy settings.
            </p>
          </header>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Profile Information</CardTitle>
                <CardDescription>
                  Update your public profile details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Avatar</Label>
                  <div className="flex gap-2">
                    <FileInput type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
                    <Button type="button" variant="outline" onClick={() => { if (avatarFile) { setCropTarget('avatar'); setCropOpen(true); } }}>Crop</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Banner</Label>
                  <div className="flex gap-2">
                    <FileInput type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} />
                    <Button type="button" variant="outline" onClick={() => { if (bannerFile) { setCropTarget('banner'); setCropOpen(true); } }}>Crop</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input id="bio" placeholder="Tell us about yourself" value={bio} onChange={(e) => setBio(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roles">Roles (comma separated)</Label>
                  <Input id="roles" value={roles} onChange={(e) => setRoles(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expertise">Expertise tags (comma separated)</Label>
                  <Input id="expertise" value={expertise} onChange={(e) => setExpertise(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="links">Links (comma separated URLs)</Label>
                  <Input id="links" value={links} onChange={(e) => setLinks(e.target.value)} />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button onClick={onSave}>Save Changes</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Privacy Controls</CardTitle>
                <CardDescription>
                  Control who can see your content and interact with you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="private-account" className="font-semibold">
                      Private Account
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Only approved followers can see your posts.
                    </p>
                  </div>
                  <Switch id="private-account" checked={isPrivate} onCheckedChange={(v) => setIsPrivate(Boolean(v))} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="tagging" className="font-semibold">
                      Allow Tagging
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Let others tag you in their photos and posts.
                    </p>
                  </div>
                  <Switch id="tagging" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dms" className="font-semibold">
                      Allow Direct Messages
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Control who can send you direct messages.
                    </p>
                  </div>
                  <Switch id="dms" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppShell>
      <CropperDialog
        open={cropOpen}
        onOpenChange={setCropOpen}
        file={cropTarget === 'avatar' ? avatarFile : bannerFile}
        aspect={cropTarget === 'avatar' ? 1 : 3}
        onCropped={(blob) => {
          const f = new File([blob], `${cropTarget || 'image'}.jpg`, { type: 'image/jpeg' });
          if (cropTarget === 'avatar') setAvatarFile(f); else setBannerFile(f);
        }}
      />
    </AuthGuard>
  );
}
