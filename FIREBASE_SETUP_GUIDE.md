# Firebase Setup Guide for KAYA Social Media Platform

## 🔥 Firebase Configuration Required

The KAYA platform is fully built but requires Firebase project setup to function. Here's how to configure it:

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name your project (e.g., "kaya-social-media")
4. Enable Google Analytics (optional)
5. Create project

## 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Go to **Sign-in method** tab
4. Enable the following providers:
   - **Email/Password** - Click and enable
   - **Google** - Click, enable, and configure OAuth consent screen

## 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we'll add security rules later)
4. Select a location (choose closest to your users)

## 4. Enable Storage

1. Go to **Storage**
2. Click **Get started**
3. Start in test mode
4. Choose same location as Firestore

## 5. Get Configuration Keys

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click **Web app** icon (`</>`)
4. Register app with name "KAYA Web App"
5. Copy the configuration object

## 6. Configure Environment Variables

Create or update `.env.local` file in your project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 7. Deploy Security Rules

Run the deployment script to set up Firestore security rules:

```bash
npm run deploy:firestore
```

Or manually copy rules from `firestore.rules` and `storage.rules` to Firebase Console.

## 8. Configure OAuth (for Google Sign-In)

1. Go to **Authentication > Sign-in method**
2. Click on **Google**
3. Add your domain to **Authorized domains**:
   - `localhost` (for development)
   - Your production domain (e.g., `kayahub.com`)

## 9. Test the Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Try creating an account at `http://localhost:3000/signup`
3. Test login at `http://localhost:3000/login`

## 🚨 Common Issues & Solutions

### Authentication Errors
- **"Invalid email or password"**: Check if Firebase Auth is enabled
- **400 errors**: Verify environment variables are correct
- **CORS errors**: Add your domain to Firebase authorized domains

### Google OAuth Issues
- **Cross-Origin-Opener-Policy errors**: Configure OAuth consent screen
- **Popup blocked**: Ensure domain is in authorized domains list
- **Stuck on "Signing In"**: Check OAuth configuration

### Database Errors
- **Permission denied**: Deploy Firestore security rules
- **Collection not found**: Rules will create collections automatically

## 🔧 Development vs Production

### Development Setup
- Use `localhost:3000` in authorized domains
- Test mode for Firestore (temporary)
- Local environment variables

### Production Setup
- Add production domain to authorized domains
- Deploy proper security rules
- Use production environment variables
- Enable Firebase Analytics

## 📝 Security Rules Deployment

The project includes pre-configured security rules:

- **`firestore.rules`**: Database access control
- **`storage.rules`**: File upload security
- **`scripts/deploy-firestore.sh`**: Automated deployment

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Email + Google)
- [ ] Firestore database created
- [ ] Storage enabled
- [ ] Environment variables configured
- [ ] Security rules deployed
- [ ] OAuth domains configured
- [ ] Test signup/login working

Once Firebase is properly configured, the KAYA platform will be fully functional!
