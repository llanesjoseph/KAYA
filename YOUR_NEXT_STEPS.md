# 🎯 Your Next Steps - KAYA Setup for Bigpenger@gmail.com

## ✅ What's Been Done

1. ✅ Cannabis content framework copied to `data/cannabis-content-framework.json`
2. ✅ Seed script created (`scripts/seed-content.ts`)
3. ✅ Setup wizard created (`scripts/setup-firebase.js`)
4. ✅ Dependencies installed (firebase-admin, tsx)
5. ✅ Documentation created (guides and quick start)
6. ✅ Security configured (.gitignore updated)

## 🚀 What YOU Need to Do Now

### Step 1: Set Up Firebase Project (5 minutes)

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/
   - Sign in with: **Bigpenger@gmail.com**

2. **Create or Select Project:**
   - Click "Create a project" (or select existing)
   - Name: `KAYA` (or your choice)
   - Enable Google Analytics: Optional
   - Click "Create project"

3. **Enable Authentication:**
   - Left sidebar → **Authentication** → "Get started"
   - Go to **Sign-in method** tab
   - Enable **Email/Password** (toggle on)
   - Enable **Google** (toggle on, select Bigpenger@gmail.com)

4. **Create Firestore Database:**
   - Left sidebar → **Firestore Database** → "Create database"
   - Choose **Production mode** (we have security rules ready)
   - Select location: **us-central1** (or closest to you)
   - Click "Create"

5. **Enable Storage:**
   - Left sidebar → **Storage** → "Get started"
   - **Production mode**
   - Same location as Firestore
   - Click "Done"

### Step 2: Get Your Configuration (2 minutes)

1. **In Firebase Console:**
   - Click ⚙️ (Settings) → **Project Settings**
   - Scroll to **Your apps** section
   - Click **Web** icon (`</>`)

2. **Register App:**
   - App nickname: `KAYA Web App`
   - ✅ Check "Also set up Firebase Hosting"
   - Click "Register app"

3. **Copy Configuration:**
   - You'll see a `firebaseConfig` object
   - Keep this window open (you'll need these values)

### Step 3: Download Service Account (2 minutes)

1. **Still in Project Settings:**
   - Click **Service accounts** tab
   - Click **Generate new private key**
   - Click **Generate key**

2. **Save the JSON file:**
   - Save it to your Desktop first
   - Then move it to your KAYA project folder root
   - Rename it to: `firebase-service-account.json`
   
   Example location:
   ```
   C:\Users\bigpe\OneDrive\Desktop\Crucible\KAYA\firebase-service-account.json
   ```

### Step 4: Run Setup Wizard (3 minutes)

Open a terminal in your KAYA project folder and run:

```bash
npm run setup:firebase
```

This will ask you for:
- API Key
- Auth Domain
- Project ID
- Storage Bucket
- Messaging Sender ID
- App ID
- Measurement ID (optional)

Copy these values from the Firebase Console (Step 2 above).

**OR** you can manually create `.env.local`:

1. Copy `.env.local.example` to `.env.local`
2. Fill in the values from Firebase Console
3. Save the file

### Step 5: Install Firebase CLI (2 minutes)

```bash
npm install -g firebase-tools
```

### Step 6: Deploy Security Rules (3 minutes)

```bash
# Login with Bigpenger@gmail.com
firebase login

# Initialize Firestore
firebase init firestore
# Choose: "Use an existing project"
# Select your KAYA project
# Firestore rules: Use existing firestore.rules
# Firestore indexes: Use existing firestore.indexes.json

# Deploy rules
firebase deploy --only firestore:rules,firestore:indexes
```

### Step 7: Seed Your Content (1 minute)

```bash
npm run seed
```

You should see:
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

### Step 8: Start Your Site (1 minute)

```bash
npm run dev
```

Visit: **http://localhost:3000**

### Step 9: Create Your Account

1. Go to: http://localhost:3000/signup
2. Sign up with Google (Bigpenger@gmail.com) or email
3. Verify age (21+)
4. Explore your cannabis community!

## 📍 Where to Find Everything

### Your Seeded Content:
- **Articles:** http://localhost:3000/articles
- **Events:** http://localhost:3000/events  
- **Jobs:** http://localhost:3000/jobs
- **Home Feed:** http://localhost:3000/home

### Your Files:
```
KAYA/
├── data/
│   └── cannabis-content-framework.json  ← Content source
├── scripts/
│   ├── seed-content.ts                  ← Seeding script
│   └── setup-firebase.js                ← Setup wizard
├── .env.local.example                   ← Config template
├── firebase-service-account.json        ← Place here (you'll download)
├── QUICK_START.md                       ← 15-min guide
├── CONTENT_SEEDING_GUIDE.md            ← Detailed guide
└── SETUP_COMPLETE.md                    ← Overview
```

## 🆘 Need Help?

### Can't find Firebase values?
→ Firebase Console → ⚙️ Settings → Project Settings → Your apps

### "Permission denied" error?
→ Run: `firebase deploy --only firestore:rules`

### Service account not working?
→ Make sure file is named exactly: `firebase-service-account.json`
→ Must be in project root folder

### Content not showing?
→ Check: Firebase Console → Firestore Database
→ Should see: `articles`, `posts`, `events`, `jobs`, `topics` collections

### Still stuck?
→ Read: `CONTENT_SEEDING_GUIDE.md` (detailed instructions)
→ Check: Firebase Console for error messages

## ⏱️ Time Estimate

| Step | Time |
|------|------|
| Firebase setup | 5 min |
| Get config | 2 min |
| Service account | 2 min |
| Setup wizard | 3 min |
| Install CLI | 2 min |
| Deploy rules | 3 min |
| Seed content | 1 min |
| Start server | 1 min |
| **Total** | **~20 min** |

## 🎉 After Setup

Once running, you can:

1. **Browse 8 articles** about cannabis news, cultivation, medical use
2. **View events** like Cannabis Industry Expo 2025
3. **Check job listings** (3 cannabis industry jobs)
4. **Create posts** with images and hashtags
5. **Write articles** with rich formatting
6. **Join topics** using hashtags
7. **Connect with users** (follow, like, comment)

## 📞 Quick Commands

```bash
# Setup
npm run setup:firebase    # Interactive Firebase config
npm run seed              # Populate content

# Run
npm run dev               # Start development server

# Firebase
firebase login            # Login with Bigpenger@gmail.com
firebase deploy           # Deploy everything
firebase deploy --only firestore:rules  # Rules only

# Useful
firebase projects:list    # See your projects
firebase use project-id   # Switch projects
```

## ✅ Checklist

Before you start, make sure you have:

- [ ] Node.js installed
- [ ] Git installed
- [ ] Firebase account (Bigpenger@gmail.com)
- [ ] Text editor (VS Code recommended)
- [ ] Terminal/Command Prompt access

Then follow the steps above in order!

---

## 🌿 Ready to Begin?

Start with **Step 1** above and work through each step.

The entire process takes about 20 minutes, and then you'll have a fully functional cannabis community platform with real content!

**Good luck!** 🚀

