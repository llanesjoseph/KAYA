# Kaya Social Media - MVP Feature Checklist

This file outlines the necessary features to get the Kaya social media platform to a Minimum Viable Product (MVP) state.

### 1. User Authentication & Profiles
- [ ] **User Sign-Up and Login:** Implement Firebase Authentication for email/password and Google provider.
- [ ] **User Logout:** Provide a clear way for users to sign out.
- [ ] **Edit Profile Page:** Allow users to update their display name, bio, and profile avatar. This involves connecting the settings page to the database.
- [ ] **View Other User Profiles:** Create a dynamic route `/[username]` to display any user's profile and posts.

### 2. Core Feed & Posting
- [ ] **Database Integration for Posts:** Connect the "Create Post" form to a `posts` collection in Firestore.
- [ ] **Image Uploads:** Integrate Firebase Storage to allow users to upload an image with their post.
- [ ] **Dynamic Feed:** The main homepage feed should display posts from the database, sorted chronologically.
- [ ] **Liking Posts:** Implement the functionality to like and unlike a post, updating a `likes` subcollection and a count on the post document.
- [ ] **Commenting on Posts:** Allow users to write and view comments on posts, storing them in a `comments` subcollection.

### 3. Social Graph
- [ ] **Follow/Unfollow System:** Create functionality for users to follow and unfollow each other. This will likely involve `following` and `followers` subcollections on user documents.
- [ ] **Personalized Feed:** Update the main feed logic to only show posts from users that the current user follows.
- [ ] **Update Profile Stats:** Dynamically display the correct "Following" and "Followers" counts on user profile pages.

### 4. Real-time Features
- [ ] **Direct Messaging (1-on-1):** Implement a basic real-time chat between two users using Firestore.
- [ ] **Notifications (Stretch Goal):** A system to notify users of likes, comments, and new followers.

### 5. Backend & Database
- [ ] **Finalize Firestore Schema:** Define and document the data structure for users, posts, likes, comments, follows, and messages.
- [ ] **Security Rules:** Write and deploy Firestore Security Rules to protect user data and ensure users can only access and modify their own information.
