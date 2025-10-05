# 🚀 Vercel Deployment Setup

## Current Configuration Status: ✅ READY

Your KAYA app is configured for automatic deployment via Vercel.

---

## 📋 Deployment Flow

```
Local Changes → Git Commit → Git Push to 'main' → Vercel Auto-Deploy → Live!
```

**Every time you push to the `main` branch, Vercel automatically:**
1. Detects the push
2. Pulls latest code
3. Runs `npm install`
4. Runs `npm run build`
5. Deploys to production
6. Gives you a live URL

---

## ✅ Current Setup Verified

### 1. **Git Configuration** ✅
- Repository: `https://github.com/llanesjoseph/KAYA.git`
- Branch: `main`
- Remote: `origin`

### 2. **Vercel Configuration** ✅
- File: `vercel.json` (configured)
- Framework: Next.js 15.3.3
- Build Command: `npm run build`
- Output Directory: `.next`

### 3. **Security** ✅
- `.env.local` in `.gitignore`
- No API keys in code
- Environment variables configured via Vercel dashboard

---

## 🔐 Required Environment Variables

**You must set these in Vercel Dashboard before deployment:**

Go to: https://vercel.com/llanesjoseph/kaya/settings/environment-variables

### Firebase Variables (7 total):
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

### Resend Email:
```
RESEND_API_KEY
```

### App URL:
```
NEXT_PUBLIC_APP_URL
```

**For each variable:**
1. Click "Add New"
2. Enter name and value (from your `.env.local`)
3. Select: **Production**, **Preview**, **Development**
4. Click "Save"

---

## 🚀 Deployment Workflow

### Initial Setup (One Time):

1. **Connect GitHub to Vercel:**
   - Go to https://vercel.com/new
   - Import `llanesjoseph/KAYA`
   - Click "Import"

2. **Add Environment Variables:**
   - Settings → Environment Variables
   - Add all 9 variables (see above)

3. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get your URL (e.g., `https://kaya-xyz.vercel.app`)

4. **Update App URL:**
   - Copy your Vercel URL
   - Update `NEXT_PUBLIC_APP_URL` in Vercel env vars
   - Redeploy

5. **Update Firebase:**
   - Firebase Console → Authentication → Settings
   - Add authorized domains:
     - Your Vercel URL
     - `*.vercel.app`

### Daily Workflow (Automatic):

```bash
# 1. Make your changes locally
# 2. Test locally
npm run dev

# 3. Commit your changes
git add .
git commit -m "Your commit message"

# 4. Push to main
git push origin main

# ✨ Vercel automatically deploys!
```

---

## 📊 Monitoring Deployments

### Check Deployment Status:
👉 https://vercel.com/llanesjoseph/kaya/deployments

**You'll see:**
- ⏳ Building...
- ✅ Ready (successful)
- ❌ Failed (with error logs)

### View Logs:
1. Click on a deployment
2. View "Build Logs" or "Function Logs"
3. Check for errors

---

## 🔧 Post-Deployment Testing

After each deployment, verify:

- [ ] Visit your Vercel URL
- [ ] Sign up / Login works
- [ ] Bug reporter appears (🐛 button)
- [ ] Test bug report submission
- [ ] Check email arrives at llanes.joseph.m@gmail.com
- [ ] Browse articles, events, jobs
- [ ] No console errors in browser DevTools

---

## 🐛 Troubleshooting

### Build Fails
**Check:**
- Vercel build logs for specific error
- All environment variables are set correctly
- No TypeScript errors (though build currently ignores them)

**Fix:**
```bash
# Test build locally first
npm run build

# If it builds locally but fails on Vercel:
# - Check environment variables
# - Check Vercel function logs
```

### Firebase Not Working
**Check:**
- All `NEXT_PUBLIC_FIREBASE_*` variables in Vercel
- Firebase authorized domains include Vercel URL

### Email Not Sending
**Check:**
- `RESEND_API_KEY` is set in Vercel
- Key is valid (regenerated after security incident)
- Check Resend dashboard: https://resend.com/emails

---

## 📝 Deployment Checklist

Before deploying new features:

- [ ] Test locally with `npm run dev`
- [ ] Run build locally with `npm run build`
- [ ] Check for console errors
- [ ] Review code changes
- [ ] Commit with clear message
- [ ] Push to `main` branch
- [ ] Monitor Vercel deployment
- [ ] Test live site after deployment

---

## 🔗 Important Links

| Service | URL |
|---------|-----|
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **Your Project** | https://vercel.com/llanesjoseph/kaya |
| **Deployments** | https://vercel.com/llanesjoseph/kaya/deployments |
| **Environment Variables** | https://vercel.com/llanesjoseph/kaya/settings/environment-variables |
| **GitHub Repo** | https://github.com/llanesjoseph/KAYA |
| **Firebase Console** | https://console.firebase.google.com/project/kaya-4e1c4 |
| **Resend Dashboard** | https://resend.com/ |

---

## 🎯 Quick Deploy Now

```bash
# Make sure you're on main branch
git checkout main

# Pull latest changes
git pull origin main

# Make your changes, then:
git add .
git commit -m "Deploy to production"
git push origin main

# Vercel deploys automatically!
# Check status: https://vercel.com/llanesjoseph/kaya/deployments
```

---

## 🔐 Security Reminders

- ✅ Never commit `.env.local`
- ✅ Never commit API keys in code
- ✅ Use Vercel environment variables for all secrets
- ✅ Keep Resend API key secure
- ✅ Regenerate keys if exposed

---

**Your deployment flow is ready!** 🎉

Just push to `main` and Vercel handles the rest.
