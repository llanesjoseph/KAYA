# 🌿 KAYA Content Seeding Guide

This guide will help you populate your KAYA site with the cannabis content framework using your Firebase account: **Bigpenger@gmail.com**

## Prerequisites

1. Node.js installed
2. Firebase account (Bigpenger@gmail.com)
3. Firebase project created

## Step 1: Set Up Firebase Project

### 1.1 Create/Access Your Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Sign in with **Bigpenger@gmail.com**
3. Create a new project or select an existing one:
   - Project name: `KAYA` (or your preferred name)
   - Enable Google Analytics (optional)
   - Choose your region

### 1.2 Enable Required Services

**Authentication:**
1. Go to **Authentication** → **Get Started**
2. Enable **Email/Password** sign-in method
3. Enable **Google** sign-in method (use Bigpenger@gmail.com)

**Firestore Database:**
1. Go to **Firestore Database** → **Create database**
2. Start in **Production mode** (we have security rules)
3. Choose your region (e.g., `us-central1`)

**Storage:**
1. Go to **Storage** → **Get started**
2. Start in **Production mode**
3. Choose the same region as Firestore

### 1.3 Get Your Firebase Configuration

1. Go to **Project Settings** (gear icon) → **General**
2. Scroll down to **Your apps**
3. Click the **Web** icon (`</>`) or select your existing web app
4. Copy the configuration values

### 1.4 Download Service Account Key (for seeding)

1. Go to **Project Settings** → **Service Accounts**
2. Click **Generate new private key**
3. Download the JSON file
4. Save it as `firebase-service-account.json` in your KAYA project root
5. **⚠️ IMPORTANT:** This file contains sensitive credentials - it's already gitignored

## Step 2: Configure Environment Variables

### 2.1 Create .env.local File

Create a file named `.env.local` in your project root (copy from `.env.local.example`):

```env
# Firebase Configuration for Bigpenger@gmail.com
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Service Account Path (for seeding)
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

**Fill in the values** from Step 1.3 above.

## Step 3: Install Dependencies

```bash
npm install
```

This will install:
- `firebase-admin` - For server-side Firebase operations
- `tsx` - TypeScript execution for the seed script

## Step 4: Deploy Firestore Security Rules

Before seeding, deploy your security rules:

### Option A: Using Firebase CLI (Recommended)

```bash
# Install Firebase CLI globally (if not already installed)
npm install -g firebase-tools

# Login with Bigpenger@gmail.com
firebase login

# Initialize Firebase in your project
firebase init firestore

# Select your project
# Use existing firestore.rules and firestore.indexes.json

# Deploy rules
firebase deploy --only firestore:rules,firestore:indexes
```

### Option B: Manual Deployment

1. Go to **Firestore Database** → **Rules**
2. Copy the contents of `firestore.rules` file
3. Paste into the Firebase Console
4. Click **Publish**

Do the same for **Storage** rules using `storage.rules`.

## Step 5: Seed Your Content

Now you're ready to populate your site with cannabis content!

```bash
npm run seed
```

This script will:
- ✅ Create a system user for content curation
- 📰 Seed articles (news, guides, medical info, stories)
- 💬 Seed posts (quick facts and short blurbs)
- 📅 Seed events (industry conferences, expos)
- 🏢 Create sample companies and job listings
- 🏷️  Generate topic/hashtag index

### Expected Output:

```
🌿 KAYA Cannabis Content Framework Seeder

✓ Loaded content framework

Creating system user...
✓ System user created

📰 Seeding Articles...
✓ Seeded 8 articles

💬 Seeding Posts...
✓ Seeded 2 posts

📅 Seeding Events...
✓ Seeded 1 events

🏢 Seeding Sample Companies and Jobs...
✓ Seeded 1 company and 3 jobs

🏷️ Seeding Topics...
✓ Seeded 15 topics

✅ Content seeding completed successfully!
```

## Step 6: Test Your Site

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Visit your site:**
   - Home: http://localhost:3000
   - Articles: http://localhost:3000/articles
   - Events: http://localhost:3000/events
   - Jobs: http://localhost:3000/jobs
   - Discover: http://localhost:3000/discover

3. **Create an account:**
   - Go to http://localhost:3000/signup
   - Sign up with email/password or Google
   - Verify you're 21+ (age verification)

4. **Explore the content:**
   - Browse seeded articles about cannabis news, cultivation, medical use
   - Check out events and job listings
   - Search topics/hashtags
   - Create your own posts

## Step 7: Deploy to Production

### Option A: Firebase App Hosting (Recommended)

```bash
# Install Firebase CLI (if not done)
npm install -g firebase-tools

# Login
firebase login

# Initialize App Hosting
firebase init hosting

# Deploy
firebase deploy
```

### Option B: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# (copy from .env.local)
```

## Troubleshooting

### "Firebase not initialized" Error

**Solution:**
- Check that `.env.local` has all the correct values
- Restart your development server after changing `.env.local`
- Make sure environment variables start with `NEXT_PUBLIC_`

### "Permission denied" in Firestore

**Solution:**
- Deploy Firestore security rules (Step 4)
- Make sure you're authenticated (sign up/login)
- Check Firebase Console → Firestore → Rules

### "Service account not found" during seeding

**Solution:**
- Download the service account JSON (Step 1.4)
- Save it as `firebase-service-account.json` in project root
- Set `FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json` in `.env.local`

### Articles/Posts not showing up

**Solution:**
- Check Firebase Console → Firestore Database
- Verify collections were created: `articles`, `posts`, `events`, `jobs`, `topics`
- Run the seed script again: `npm run seed`
- Check browser console for errors

### Need to re-seed content?

To clear and re-seed:

1. Go to Firebase Console → Firestore Database
2. Delete collections: `articles`, `posts`, `events`, `jobs`, `topics`
3. Run: `npm run seed` again

## Next Steps

After seeding:

1. **Customize Content:**
   - Edit articles in Firebase Console
   - Add your own content through the UI
   - Update images and media

2. **Invite Users:**
   - Share your site URL
   - Set up email verification
   - Configure social sign-in

3. **Monitor Usage:**
   - Firebase Console → Analytics
   - Check Firestore usage
   - Monitor authentication

4. **Enhance Features:**
   - Add more content from JSON
   - Create custom content types
   - Build admin panel for content management

## Support

If you encounter issues:

1. Check Firebase Console for errors
2. Review browser console logs
3. Verify all environment variables are set
4. Ensure Firestore rules are deployed

## Security Notes

- ⚠️ **Never commit** `firebase-service-account.json` to Git
- ⚠️ **Never commit** `.env.local` to Git
- ✅ Both are already in `.gitignore`
- ✅ Use `.env.local.example` for reference only

---

**Happy Seeding! 🌿**

Your KAYA cannabis community is ready to grow!

