# Firebase Authentication Setup Guide

Your KAYA app is already coded to support Email/Password and Google authentication. Follow these steps to ensure everything is properly configured in Firebase.

## ✅ What's Already Implemented

Your app supports:
- ✅ Email/Password signup and login
- ✅ Google OAuth (Sign in with Google)
- ✅ Password reset via email
- ✅ Age verification (21+ requirement)
- ✅ User profile creation

## 🔧 Firebase Console Setup

### Step 1: Enable Authentication Methods

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project: `kaya-4e1c4`

2. **Navigate to Authentication**
   - In the left sidebar, click **"Authentication"**
   - Click the **"Get Started"** button if you haven't set it up yet
   - Click on the **"Sign-in method"** tab

3. **Enable Email/Password Authentication**
   - Find **"Email/Password"** in the list
   - Click on it
   - Toggle **"Enable"** to ON
   - Click **"Save"**

4. **Enable Google Authentication**
   - Find **"Google"** in the provider list
   - Click on it
   - Toggle **"Enable"** to ON
   - **Project support email**: Select your email (llanes.joseph.m@gmail.com)
   - Click **"Save"**

### Step 2: Configure Authorized Domains

Firebase needs to know which domains can use authentication:

1. In **Authentication** > **Settings** tab
2. Scroll to **"Authorized domains"**
3. Make sure these domains are listed:
   - `localhost` (for local development)
   - Your production domain (when you deploy)

**Note**: `localhost` is usually authorized by default.

### Step 3: Email Template Configuration (Optional but Recommended)

Customize the email templates Firebase sends:

1. In **Authentication** > **Templates** tab
2. You can customize:
   - **Password reset emails**
   - **Email address verification** (if you enable it)
   - **Email address change**

Recommended customizations:
- **Sender name**: "KAYA" or "KAYA Hub"
- **Reply-to email**: llanes.joseph.m@gmail.com
- Customize the email content to match your brand

## 🧪 Testing Your Authentication

### Test Email/Password Auth

1. **Start your dev server**:
   ```bash
   npm run dev
   ```

2. **Go to Signup Page**:
   - Visit: http://localhost:3000/signup
   - Fill in the form with a test email
   - Must select a date of birth (21+ required)
   - Check the age attestation checkbox
   - Click "Create Account"

3. **Verify in Firebase Console**:
   - Go to **Authentication** > **Users** tab
   - You should see your new user listed

4. **Test Login**:
   - Log out
   - Go to: http://localhost:3000/login
   - Login with your test credentials
   - Should redirect to `/home`

### Test Google OAuth

1. **Go to Login or Signup Page**
2. Click **"Sign In with Google"** or **"Sign Up with Google"**
3. Select your Google account
4. If it's a new account, you'll be redirected to age verification
5. Complete age verification
6. Should redirect to `/home`

**Troubleshooting Google Auth**:
- If you get a popup blocked error, allow popups for localhost
- If you get an "unauthorized domain" error, check Step 2 above
- Clear browser cache and try again

### Test Password Reset

1. **Go to Login Page**: http://localhost:3000/login
2. Enter an email address that's registered
3. Click **"Forgot password?"**
4. Check the email inbox for the reset link
5. Click the link and set a new password

## 🔒 Security Best Practices

### 1. Password Requirements
Currently set to Firebase default (minimum 6 characters). To make it stronger:
- Consider adding validation for longer passwords (8+ chars)
- Require a mix of uppercase, lowercase, numbers

### 2. Email Verification (Optional)
To require users to verify their email:

1. In Firebase Console > **Authentication** > **Settings**
2. Enable **"Email enumeration protection"**
3. In your code, after signup, send verification email:
   ```typescript
   import { sendEmailVerification } from 'firebase/auth';

   // After createUserWithEmailAndPassword
   await sendEmailVerification(user);
   ```

### 3. Security Rules
Make sure your Firestore security rules are properly configured:

**File**: `firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read all user profiles but only write their own
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Other collections...
  }
}
```

Deploy rules:
```bash
firebase deploy --only firestore:rules
```

## 📧 Email Configuration

### Gmail SMTP (For Password Reset Emails)

Firebase handles sending password reset emails automatically. However, you can customize the sender:

1. **Custom Email Domain** (Optional, requires Firebase Blaze plan):
   - Set up a custom email domain
   - Configure SMTP settings in Firebase

2. **Default Setup**:
   - Firebase sends emails from: `noreply@kaya-4e1c4.firebaseapp.com`
   - This works fine for testing

## ✅ Verification Checklist

- [ ] Email/Password authentication enabled in Firebase Console
- [ ] Google authentication enabled in Firebase Console
- [ ] Authorized domains configured (localhost at minimum)
- [ ] Email templates customized (optional)
- [ ] Can signup with email/password successfully
- [ ] Can login with email/password successfully
- [ ] Can signup/login with Google successfully
- [ ] Password reset email sends correctly
- [ ] Age verification works (21+ requirement)
- [ ] User profile created in Firestore after signup

## 🐛 Common Issues

### Issue: "Firebase not initialized"
**Solution**: Check your `.env.local` file has all Firebase config variables

### Issue: "auth/popup-blocked"
**Solution**: Allow popups for localhost in browser settings

### Issue: "auth/unauthorized-domain"
**Solution**: Add your domain to authorized domains in Firebase Console

### Issue: Google sign-in not working
**Solution**:
1. Make sure Google provider is enabled
2. Check that you've selected a support email
3. Verify authorized domains include localhost

### Issue: Password reset email not sending
**Solution**:
1. Check spam folder
2. Verify email/password provider is enabled
3. Wait a few minutes (can take time to arrive)

## 🚀 Production Deployment

When deploying to production:

1. **Add production domain** to authorized domains
2. **Update environment variables** on hosting platform
3. **Test authentication** on production URL
4. **Consider enabling email verification** for production
5. **Set up custom email domain** (optional, Blaze plan)

## 📞 Need Help?

If you encounter issues:
- Check Firebase Console logs: **Authentication** > **Users** (shows sign-in attempts)
- Check browser console for errors
- Verify all environment variables are set
- Contact: llanes.joseph.m@gmail.com

---

Your authentication is ready to go! 🔐
