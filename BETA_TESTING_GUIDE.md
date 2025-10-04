# KAYA Beta Testing Guide

Welcome to KAYA - Your Cannabis Social & Education Platform! This guide will help you test the platform and provide valuable feedback.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Key Features to Test](#key-features-to-test)
3. [Content Categories](#content-categories)
4. [How to Report Issues](#how-to-report-issues)
5. [Testing Checklist](#testing-checklist)

---

## Getting Started

### 1. Access the Platform
- **URL**: [Your deployment URL here] or http://localhost:3000 (local)
- **Age Requirement**: You must be 21+ years old to access the platform

### 2. Create Your Account
1. Visit the platform URL
2. Verify your age (21+ required)
3. Click "Sign Up" in the top right
4. Use your email address to create an account
5. Complete your profile with:
   - Display name
   - Profile photo (optional)
   - Bio describing your interests
   - Role(s): Choose from Educator, Medical Professional, Cultivator, Business Owner, Consumer, Advocate
   - Expertise tags (e.g., Medical Cannabis, Cultivation, Legal Compliance)

### 3. First Steps After Login
- Explore the home feed
- Check out trending topics
- Browse articles and educational content
- Connect with sample users (Dr. Sarah Green, Mike Johnson, Lisa Chen)

---

## Key Features to Test

### 🏠 Home Feed
**What to test:**
- [ ] View posts from followed users
- [ ] See global feed if not following anyone yet
- [ ] Like posts by clicking the heart icon
- [ ] Comment on posts
- [ ] Share posts (if implemented)
- [ ] Real-time updates when new posts are available
- [ ] "Who to Follow" suggestions appear correctly

**How to test:**
1. Navigate to `/home`
2. Scroll through the feed
3. Interact with posts (like, comment)
4. Create your own post using the "What's on your mind?" box
5. Add images or hashtags to your posts

### 📰 Articles & Education
**What to test:**
- [ ] Browse cannabis education articles
- [ ] Read full article content
- [ ] Articles are categorized correctly (news, legal, medical, cultivation, etc.)
- [ ] Tags/hashtags work properly
- [ ] Can create new articles (if you have permission)

**Article Categories to Explore:**
- **News**: Industry updates, legislation changes
- **Legal**: Compliance, regulations, zoning
- **Medical**: Research, patient care, cannabinoid science
- **Cultivation**: Growing techniques, sustainability
- **Culture**: Personal stories, community features
- **Lifestyle**: Wellness, yoga, mindfulness with cannabis
- **Business**: Market trends, entrepreneurship

**How to test:**
1. Navigate to `/articles`
2. Click on different articles to read
3. Check article metadata (author, date, read time)
4. Test article search/filtering

### 🔍 Discover
**What to test:**
- [ ] Search for users by name
- [ ] Search for content/posts by keywords
- [ ] Trending topics display correctly
- [ ] "Who to Follow" recommendations work
- [ ] Follow/unfollow functionality

**How to test:**
1. Navigate to `/discover`
2. Use the search bar to find users and content
3. Browse trending topics (cannabis-education, medical-marijuana, legalization, etc.)
4. Follow suggested users

### 👤 Profile & Settings
**What to test:**
- [ ] View your own profile at `/profile`
- [ ] Edit profile information at `/settings`
- [ ] Upload/change profile photo
- [ ] Upload/change banner image
- [ ] Update bio, roles, and expertise tags
- [ ] Add social links (website, LinkedIn, etc.)
- [ ] View your posts, media, and likes tabs

**How to test:**
1. Navigate to `/profile`
2. Click "Edit Profile" to go to `/settings`
3. Update various profile fields
4. Save changes and verify they persist

### 💬 Social Interactions
**What to test:**
- [ ] Create text posts
- [ ] Create posts with images
- [ ] Use hashtags in posts (e.g., #cannabis-education, #medical, #cultivation)
- [ ] Like and unlike posts
- [ ] Comment on posts
- [ ] View comment threads
- [ ] Follow/unfollow users
- [ ] Direct messaging (if implemented)

**How to test:**
1. Create various types of posts
2. Interact with content from system users and sample users
3. Test hashtag functionality
4. Check notifications for interactions

### 🏷️ Topics & Tags
**What to test:**
- [ ] Click on hashtags to view topic pages
- [ ] See all posts and articles for a specific topic
- [ ] Topics page displays correct content count
- [ ] Can navigate between different topics

**Available Topics:**
- #cannabis-education
- #medical-marijuana
- #cannabis-culture
- #legalization
- #cultivation
- #cannabis-business
- #legal
- #news
- #lifestyle
- #research

**How to test:**
1. Click any hashtag in a post or article
2. Navigate to `/topics/[tag]` (e.g., `/topics/cultivation`)
3. Verify posts and articles appear
4. Check pagination/load more functionality

### 🏢 Jobs & Companies
**What to test:**
- [ ] Browse job listings at `/jobs`
- [ ] View company profiles
- [ ] Follow companies
- [ ] Filter jobs by location/category
- [ ] Apply to jobs (if implemented)

**How to test:**
1. Navigate to `/jobs`
2. Browse available positions (Cultivation Specialist, Budtender, Compliance Manager)
3. Check company profile (Green Horizons Cannabis Co.)
4. Test follow/unfollow for companies

### 📅 Events
**What to test:**
- [ ] Browse upcoming cannabis events
- [ ] View event details
- [ ] RSVP to events (if implemented)
- [ ] Add events to calendar

**How to test:**
1. Navigate to `/events`
2. Check event information (Cannabis Industry Expo 2025)
3. Test event registration links

---

## Content Categories

The platform features diverse cannabis content across these categories:

### 📚 Educational Content
- **Cannabis Science**: Terpenes, cannabinoids, entourage effect
- **Medical Information**: Research studies, patient care, conditions treated
- **Cultivation Guides**: Indoor vs outdoor, sustainable practices, organic methods
- **Legal Updates**: Legislation changes, compliance requirements, zoning laws

### 📰 News & Updates
- **Industry News**: Market trends, business developments
- **Legal Changes**: New laws, policy updates, federal banking reform
- **Research Breakthroughs**: Latest scientific studies
- **Product Innovations**: New cannabis products and technologies

### 🌱 Community Features
- **Personal Stories**: Entrepreneur journeys, patient experiences
- **Cultural Content**: Cannabis in lifestyle, yoga, wellness
- **Expert Insights**: Quotes from doctors, growers, lawyers
- **User-Generated Content**: Community posts, photos, questions

---

## How to Report Issues

### What to Report
- **Bugs**: Anything that doesn't work as expected
- **UX Issues**: Confusing interfaces, hard-to-find features
- **Performance Problems**: Slow loading, errors
- **Content Issues**: Inappropriate content, broken links
- **Feature Requests**: Things you wish the platform had

### How to Report
1. **Via Email**: Send details to llanes.joseph.m@gmail.com
2. **Include**:
   - What you were trying to do
   - What happened instead
   - Screenshots (if applicable)
   - Browser and device information
   - Steps to reproduce the issue

### Bug Report Template
```
**Summary**: Brief description of the issue

**Steps to Reproduce**:
1. Go to [page]
2. Click on [element]
3. See error

**Expected Behavior**: What should happen

**Actual Behavior**: What actually happened

**Screenshots**: [Attach if relevant]

**Device/Browser**: Chrome on Windows 11 / Safari on iPhone, etc.

**Additional Context**: Any other relevant information
```

---

## Testing Checklist

### ✅ Core Functionality
- [ ] Sign up and create account
- [ ] Complete age verification (21+)
- [ ] Set up profile with bio, roles, and expertise
- [ ] Create a text post
- [ ] Create a post with an image
- [ ] Create a post with hashtags
- [ ] Like a post
- [ ] Comment on a post
- [ ] Follow another user
- [ ] Unfollow a user
- [ ] View someone else's profile
- [ ] Search for users
- [ ] Search for content
- [ ] Browse articles
- [ ] Read a full article
- [ ] Click on a hashtag/topic
- [ ] View a topic page
- [ ] Browse jobs
- [ ] View company profile
- [ ] Check notifications
- [ ] Edit profile information
- [ ] Upload profile photo
- [ ] Upload banner image
- [ ] Sign out
- [ ] Sign back in

### ✅ Content Categories to Explore
- [ ] Read a news article
- [ ] Read a legal update
- [ ] Read a cultivation guide
- [ ] Read a medical cannabis article
- [ ] Read a lifestyle/culture piece
- [ ] Explore #cannabis-education topic
- [ ] Explore #medical-marijuana topic
- [ ] Explore #cultivation topic
- [ ] Explore #legalization topic

### ✅ Mobile Testing (if applicable)
- [ ] Test on mobile browser
- [ ] Check responsive design
- [ ] Test touch interactions
- [ ] Verify image uploads work on mobile
- [ ] Check navigation menu on mobile

### ✅ Edge Cases
- [ ] Try very long post content
- [ ] Try special characters in posts
- [ ] Test with slow internet connection
- [ ] Try uploading large images
- [ ] Test browser back/forward buttons
- [ ] Refresh page while logged in
- [ ] Open multiple tabs

---

## Feedback We're Looking For

### 🎯 User Experience
- Is the navigation intuitive?
- Is the content easy to find?
- Are there any confusing features?
- What features are missing that you'd like to see?

### 📱 Design & Interface
- Is the design appealing?
- Are colors and fonts readable?
- Do images load properly?
- Is the layout responsive on different screens?

### 🌿 Content Quality
- Is the cannabis content educational and appropriate?
- Are articles informative and well-written?
- Is the content categorized correctly?
- What topics would you like to see more of?

### 🚀 Performance
- Does the app load quickly?
- Are there any delays or lag?
- Do pages crash or error out?
- Are images optimized?

### 🔒 Safety & Privacy
- Do you feel the platform is safe and appropriate?
- Is age verification working correctly?
- Are privacy settings clear?
- Is content moderation effective?

---

## Quick Tips for Testers

1. **Be Creative**: Try things in unexpected ways - that's how we find bugs!
2. **Document Everything**: Take screenshots of any issues you encounter
3. **Test Different Scenarios**: Use different browsers, devices, and network conditions
4. **Provide Context**: The more details you give, the easier it is to fix issues
5. **Have Fun**: Explore the platform, engage with content, and enjoy the experience!

---

## Sample Test Scenarios

### Scenario 1: New User Journey
1. Visit the site for the first time
2. Verify age (enter birthdate showing 21+)
3. Sign up with a new email
4. Complete profile setup
5. Explore the home feed
6. Follow 2-3 suggested users
7. Create your first post about cannabis education
8. Like and comment on another post

### Scenario 2: Content Creator
1. Log in to your account
2. Navigate to Articles
3. Create a new article about cannabis cultivation
4. Add appropriate hashtags (#cultivation, #education)
5. Upload a cover image
6. Publish the article
7. Share it on your feed
8. Check if it appears in the topic pages

### Scenario 3: Job Seeker
1. Browse the Jobs section
2. Filter by your location/interest
3. View job details (Budtender, Cultivation Specialist, etc.)
4. Check company profile
5. Follow the company
6. Save jobs of interest

### Scenario 4: Community Engagement
1. Search for #medical-marijuana
2. Read related articles and posts
3. Comment on posts with helpful insights
4. Follow users with similar interests
5. Create a post asking a question
6. Engage with responses

---

## Contact & Support

**Questions?** Reach out to:
- **Email**: llanes.joseph.m@gmail.com
- **Platform**: Use the "Report Issue" feature (if available)

**Thank you for being a beta tester!** Your feedback is invaluable in making KAYA the best cannabis education and social platform. Together, we're building a community focused on knowledge, connection, and responsible cannabis advocacy.

---

## Content Seeded for Testing

The platform has been pre-populated with:
- **5 Articles** covering news, cultivation, medical, culture, and lifestyle
- **1 Quick Fact** post about cannabis education
- **1 Event**: Cannabis Industry Expo 2025
- **1 Company**: Green Horizons Cannabis Co.
- **3 Jobs**: Cultivation Specialist, Budtender, Compliance Manager
- **23 Topics/Hashtags** including all major cannabis categories
- **4 Sample Users**: KAYA Content Team + 3 community members (Dr. Sarah Green, Mike Johnson, Lisa Chen)

Feel free to interact with all this content during your testing!

---

**Happy Testing! 🌿**
