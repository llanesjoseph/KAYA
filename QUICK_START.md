# 🚀 Quick Start Guide - KAYA Cannabis Platform

Get your KAYA site up and running with cannabis content in 15 minutes!

## Prerequisites

- Node.js 18+ installed
- Firebase account (use **Bigpenger@gmail.com**)
- Git installed

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Firebase Setup

### Option A: Interactive Setup (Easiest)

```bash
npm run setup:firebase
```

This interactive wizard will:
- Guide you through Firebase configuration
- Create your `.env.local` file
- Provide next steps

### Option B: Manual Setup

1. **Create Firebase Project:**
   - Go to https://console.firebase.google.com/
   - Sign in with Bigpenger@gmail.com
   - Click "Create a project" or select existing project
   - Name it: `KAYA` (or your choice)

2. **Enable Services:**
   - **Authentication** → Enable Email/Password and Google
   - **Firestore Database** → Create database (Production mode)
   - **Storage** → Get started (Production mode)

3. **Get Configuration:**
   - Project Settings → Your apps → Web app
   - Copy the config values

4. **Create .env.local:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and fill in your Firebase config values
   ```

5. **Download Service Account:**
   - Project Settings → Service Accounts
   - Generate new private key
   - Save as `firebase-service-account.json` in project root

## Step 3: Deploy Firestore Rules

```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login with Bigpenger@gmail.com
firebase login

# Initialize (select Firestore, use existing files)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules,firestore:indexes
```

## Step 4: Seed Cannabis Content

```bash
npm run seed
```

This will populate your Firestore with:
- 📰 8 articles (news, guides, medical info)
- 💬 2 quick fact posts
- 📅 1 event (Cannabis Industry Expo)
- 🏢 1 company with 3 job listings
- 🏷️  15+ topics/hashtags

## Step 5: Start Development Server

```bash
npm run dev
```

Visit: **http://localhost:3000**

## Step 6: Create Your Account

1. Go to http://localhost:3000/signup
2. Sign up with email/password or Google
3. Complete age verification (21+)
4. Start exploring!

## What's Included

Your seeded content includes:

### Articles
- **News:** Federal banking reform, state legislation updates
- **Guides:** Indoor vs outdoor cultivation, terpenes guide
- **Medical:** Cannabis for chronic pain management
- **Culture:** Entrepreneur stories, lifestyle features

### Events
- Cannabis Industry Expo 2025
- (Add more through the /events/new page)

### Jobs
- Cannabis Cultivation Specialist
- Budtender / Cannabis Consultant
- Compliance Manager

### Topics
- #cannabis-education
- #medical-marijuana
- #legalization
- #cultivation
- #cannabis-business
- And more!

## Quick Links

- **Home Feed:** http://localhost:3000/home
- **Articles:** http://localhost:3000/articles
- **Events:** http://localhost:3000/events
- **Jobs:** http://localhost:3000/jobs
- **Discover:** http://localhost:3000/discover

## Create Your Own Content

After signing up, you can:

1. **Create Posts:**
   - Share quick updates on the home feed
   - Add images and videos
   - Use hashtags for discoverability

2. **Write Articles:**
   - Visit /articles/new
   - Long-form content with rich formatting
   - Add cover images

3. **Post Events:**
   - Visit /events/new
   - Cannabis conferences, meetups, expos

4. **List Jobs:**
   - Visit /jobs/new
   - Cannabis industry job postings

## Troubleshooting

### Firebase not initialized
- Check `.env.local` has all values filled in
- Restart dev server: `npm run dev`

### Permission denied in Firestore
- Deploy security rules: `firebase deploy --only firestore:rules`

### Content not showing
- Run seed script: `npm run seed`
- Check Firebase Console → Firestore Database

### Need help?
- Read full guide: `CONTENT_SEEDING_GUIDE.md`
- Check Firebase Console for errors

## Deploy to Production

### Firebase App Hosting (Recommended)

```bash
firebase init hosting
firebase deploy
```

### Vercel

```bash
npm install -g vercel
vercel
# Add environment variables in Vercel dashboard
```

## Next Steps

1. **Customize:** Edit seeded content in Firebase Console
2. **Invite Users:** Share your site URL
3. **Add Content:** Use the cannabis-content-framework.json as inspiration
4. **Monitor:** Check Firebase Analytics

## Support Files

- `CONTENT_SEEDING_GUIDE.md` - Detailed seeding instructions
- `FIREBASE_SETUP_GUIDE.md` - Firebase configuration guide
- `DEPLOYMENT_GUIDE.md` - Production deployment guide

---

**🌿 Your KAYA cannabis community is ready!**

Need more help? Check the detailed guides or Firebase documentation.

