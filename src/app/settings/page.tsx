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

export default function SettingsPage() {
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
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="Kaya User" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="@kayauser" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input id="bio" placeholder="Tell us about yourself" />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Save Changes</Button>
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
                  <Switch id="private-account" />
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
    </AuthGuard>
  );
}
