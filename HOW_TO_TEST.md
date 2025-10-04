# How Your Friends Can Test KAYA

Quick guide for getting your friends to test the KAYA cannabis platform.

## For You (The Owner)

### Step 1: Deploy the Application (Choose One)

#### Option A: Local Testing
```bash
cd C:\Users\bigpe\OneDrive\Desktop\Crucible\KAYA
npm run dev
```
Then share your local network IP: `http://[your-ip]:3000`

#### Option B: Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Go to https://vercel.com
3. Import your GitHub repository
4. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
5. Deploy and get your live URL

#### Option C: Deploy to Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```

### Step 2: Share Access with Friends

Send them:
1. **The URL** (Vercel URL or your IP address)
2. **This testing guide** (share HOW_TO_TEST.md)
3. **The beta testing guide** (share BETA_TESTING_GUIDE.md)

### Step 3: Monitor Feedback

Set up a way to collect feedback:
- Google Form for structured feedback
- Shared Discord/Slack channel
- Email thread
- Notion/Trello board for bug tracking

---

## For Your Friends (The Testers)

### Quick Start (5 Minutes)

#### 1. Access the Platform
- Click the URL shared by Joseph
- You should see the KAYA cannabis platform

#### 2. Age Verification
- You must be **21 years or older** to access
- Enter your date of birth when prompted
- Click "Enter"

#### 3. Create Your Account
1. Click "**Sign Up**" in the top right
2. Enter your email address
3. Create a password
4. Click "Sign up"
5. You might need to verify your email

#### 4. Set Up Your Profile
1. Add your **display name** (can be a nickname)
2. Upload a **profile photo** (optional)
3. Write a short **bio** about your cannabis interests
4. Select your **role(s)**:
   - Consumer
   - Medical Patient
   - Educator
   - Cultivator
   - Business Owner
   - Advocate
5. Add **expertise tags** (e.g., "Medical Cannabis", "Cooking with Cannabis", "Growing")
6. Click "Save"

#### 5. Start Exploring!

**First Things to Try:**
1. **Home Feed** - See posts from the community
2. **Create a Post** - Share your thoughts on cannabis
3. **Browse Articles** - Read educational content
4. **Discover** - Search for users and topics
5. **Follow People** - Connect with Dr. Sarah Green, Mike Johnson, or Lisa Chen

---

## What to Test (30 Minutes)

### 🏠 Home & Feed
- [ ] Create a text post about cannabis
- [ ] Add a photo to a post
- [ ] Use hashtags like #cannabis-education or #medical
- [ ] Like some posts
- [ ] Comment on posts
- [ ] Follow 2-3 users

### 📰 Content & Learning
- [ ] Read an article about cannabis cultivation
- [ ] Read an article about medical cannabis
- [ ] Click on a hashtag to see related content
- [ ] Browse different topics

### 🔍 Discover
- [ ] Search for "cannabis"
- [ ] Search for users by name
- [ ] Explore trending topics
- [ ] Follow someone from "Who to Follow"

### 👤 Profile
- [ ] View your profile page
- [ ] Edit your profile (add expertise, bio, etc.)
- [ ] Upload a banner image
- [ ] Add a website link

### 🏢 Jobs & Events
- [ ] Check out available cannabis jobs
- [ ] View company profiles
- [ ] Look at upcoming events

---

## How to Report Issues

### Found a Bug? 🐛
Send to: **llanes.joseph.m@gmail.com**

Include:
- What you were doing
- What went wrong
- Screenshot (if possible)
- Your browser (Chrome, Safari, etc.)

**Example:**
```
Subject: Bug - Can't upload profile photo

I was trying to upload a profile photo in Settings.
When I click "Upload", nothing happens.

Browser: Chrome on Mac
Screenshot: [attached]
```

### Have Feedback? 💭
Share your thoughts on:
- What you liked
- What was confusing
- What features you'd want
- Design suggestions

---

## Testing Checklist

Copy this and check off as you test:

```
Basic Features:
□ Created account successfully
□ Verified age (21+)
□ Set up profile with photo and bio
□ Made a post
□ Liked a post
□ Commented on a post
□ Followed a user
□ Searched for content
□ Read an article
□ Clicked on a hashtag
□ Viewed someone's profile
□ Edited my profile

Found Issues:
□ [Issue 1: Description]
□ [Issue 2: Description]
□ [Issue 3: Description]

Suggestions:
□ [Suggestion 1]
□ [Suggestion 2]
□ [Suggestion 3]
```

---

## FAQs

**Q: Do I need to be a cannabis user to test this?**
A: No! We need testers of all backgrounds. If you're 21+, you can test.

**Q: Is this real cannabis content?**
A: Yes, but it's educational. This is a platform for cannabis education, news, and community.

**Q: Will my information be shared?**
A: No, this is a test environment. Your data is only for testing purposes.

**Q: How long should I test?**
A: Spend at least 30 minutes exploring. The more you test, the more helpful it is!

**Q: Can I test on my phone?**
A: Yes! Please do. Mobile testing is very important.

**Q: What if I find something broken?**
A: Perfect! That's what testing is for. Report it to Joseph immediately.

---

## Content Available for Testing

The platform has pre-loaded content:

**Articles:**
- Cannabis legislation news
- Banking reform for cannabis businesses
- Indoor vs outdoor cultivation guide
- Medical cannabis research
- Cannabis entrepreneur story
- Cannabis and yoga lifestyle piece

**Topics to Explore:**
- #cannabis-education
- #medical-marijuana
- #cultivation
- #legalization
- #cannabis-business
- #legal
- #lifestyle

**Sample Users to Follow:**
- KAYA Content Team (official curator)
- Dr. Sarah Green (medical professional)
- Mike Johnson (cultivator)
- Lisa Chen (lawyer/compliance)

**Jobs Posted:**
- Cannabis Cultivation Specialist (Denver, CO)
- Budtender / Cannabis Consultant (Los Angeles, CA)
- Compliance Manager (Portland, OR)

**Company:**
- Green Horizons Cannabis Co.

**Event:**
- Cannabis Industry Expo 2025 (Las Vegas, March 15)

---

## Tips for Great Testing

1. **Try to break things** - Click buttons multiple times, try weird inputs
2. **Test on different devices** - Phone, tablet, laptop
3. **Use different browsers** - Chrome, Safari, Firefox
4. **Think like a user** - What would confuse a new person?
5. **Be creative** - Try features in unexpected ways
6. **Take notes** - Write down everything you notice
7. **Have fun** - Explore and enjoy the platform!

---

## After Testing

**Send Joseph:**
1. Your completed checklist
2. Any bugs you found
3. Screenshots of issues
4. Your overall thoughts
5. Feature suggestions

**Thank you for testing!** Your feedback helps make KAYA better for the cannabis community. 🌿

---

## Contact

**Questions or Issues?**
- Email: llanes.joseph.m@gmail.com
- Include "KAYA Testing" in subject line

**Emergency/Critical Bugs:**
- Text/call Joseph directly with details
