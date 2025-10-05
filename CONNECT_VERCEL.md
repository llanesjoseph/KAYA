# 🔗 Connect Your GitHub Repo to Vercel

## The Problem:
Your code is pushing to GitHub ✅, but Vercel doesn't know about your repo yet!

---

## ✅ Setup Steps (5 Minutes)

### Step 1: Go to Vercel
👉 **https://vercel.com/new**

### Step 2: Sign In
- Use your GitHub account
- Authorize Vercel to access GitHub

### Step 3: Import Your Repository

**On the "Import Git Repository" page:**

1. Look for: **llanesjoseph/KAYA**
2. If you don't see it, click **"Adjust GitHub App Permissions"**
3. Give Vercel access to the **KAYA** repository
4. Click **"Import"** next to **llanesjoseph/KAYA**

### Step 4: Configure Project

**Project Name:** `kaya` (or whatever you want)

**Framework Preset:** Next.js (should auto-detect)

**Root Directory:** `./` (leave as default)

**Build Settings:** (should auto-detect from package.json)
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Step 5: Add Environment Variables

⚠️ **CRITICAL - Click "Environment Variables" dropdown**

Add these **9 variables** (get values from your `.env.local`):

```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyA7tvTOqf70qMkWmunwKouqw51XaWYf7Ak
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = kaya-4e1c4.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = kaya-4e1c4
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = kaya-4e1c4.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 969650140042
NEXT_PUBLIC_FIREBASE_APP_ID = 1:969650140042:web:7bbbbf361d95e0c3360e73
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = G-BWG9ZPERCC
RESEND_API_KEY = <YOUR NEW REGENERATED KEY FROM RESEND.COM>
NEXT_PUBLIC_APP_URL = https://kaya.vercel.app
```

**For each variable:**
- Paste name
- Paste value
- Select: **Production**, **Preview**, **Development** (all 3!)
- Click **Add**

### Step 6: Deploy!

1. Click **"Deploy"** button
2. Wait 2-3 minutes
3. Watch the build logs
4. Get your live URL! 🎉

---

## 🔄 After First Deployment

Once deployed, **automatic deployments are enabled**:

```
git push origin main → Vercel auto-deploys
```

---

## 🔗 Quick Links

| Action | Link |
|--------|------|
| **Import to Vercel** | https://vercel.com/new |
| **Your GitHub Repo** | https://github.com/llanesjoseph/KAYA |
| **Get Resend API Key** | https://resend.com/api-keys |
| **Firebase Console** | https://console.firebase.google.com/project/kaya-4e1c4 |

---

## ⚠️ IMPORTANT: Regenerate Resend API Key

**Before deploying:**

1. Go to: https://resend.com/api-keys
2. **Delete** old key: `re_dro5Az7h_...` (the exposed one)
3. **Create new** API key
4. Copy the new key
5. Use it in Vercel environment variables

---

## ✅ After Setup

Once you complete this setup:
- ✅ Every `git push` auto-deploys
- ✅ You get a live URL
- ✅ Preview URLs for every PR
- ✅ Automatic SSL/HTTPS

**Your deployment flow will be:**
```bash
git add .
git commit -m "changes"
git push origin main
# ✨ Vercel automatically deploys!
```

---

**Start here:** https://vercel.com/new

Import **llanesjoseph/KAYA** and you're done! 🚀
