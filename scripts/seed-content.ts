/**
 * Seed Script for KAYA Cannabis Content Framework
 * 
 * This script populates Firestore with content from cannabis-content-framework.json
 * Run with: npx tsx scripts/seed-content.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Initialize Firebase Admin
if (!getApps().length) {
  // For local development, use environment variables
  // For production, use service account
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    initializeApp({
      credential: cert(serviceAccount)
    });
  } else {
    // Use Firebase Web API key for admin SDK (not ideal but works for seeding)
    console.log('Using Firebase project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
    initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: `firebase-adminsdk@${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.iam.gserviceaccount.com`,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || ''
      } as any)
    });
  }
}

const db = getFirestore();

interface ContentFramework {
  site_metadata: any;
  content_templates: any;
  content_library: any[];
  photo_galleries?: any[];
  content_schedule?: any;
  seo_metadata?: any;
  social_media_templates?: any;
  content_ideas_bank?: any[];
  user_generated_content?: any;
}

// Default user ID for system-generated content
const SYSTEM_USER_ID = 'system-content-curator';
const SYSTEM_USER_NAME = 'KAYA Content Team';
const SYSTEM_USER_PHOTO = 'https://api.dicebear.com/7.x/shapes/svg?seed=kaya';

// Primary user
const PRIMARY_USER_EMAIL = 'llanes.joseph.m@gmail.com';

async function createSystemUser() {
  console.log('Creating system user...');
  const userRef = db.collection('users').doc(SYSTEM_USER_ID);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    await userRef.set({
      uid: SYSTEM_USER_ID,
      displayName: SYSTEM_USER_NAME,
      email: 'content@kayahub.com',
      photoURL: SYSTEM_USER_PHOTO,
      bio: 'Official KAYA content curator bringing you the latest in cannabis news, education, and culture.',
      createdAt: Timestamp.now(),
      roles: ['Content Creator', 'Educator'],
      expertiseTags: ['Cannabis Education', 'Industry News', 'Legal Updates']
    });
    console.log('✓ System user created');
  } else {
    console.log('✓ System user already exists');
  }
}

async function findOrCreatePrimaryUser() {
  console.log('Finding or updating primary user profile...');

  // Query for user by email
  const usersSnapshot = await db.collection('users')
    .where('email', '==', PRIMARY_USER_EMAIL)
    .limit(1)
    .get();

  if (!usersSnapshot.empty) {
    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;

    // Update user profile with cannabis-related content
    await db.collection('users').doc(userId).update({
      bio: 'Cannabis enthusiast, educator, and community builder. Passionate about sharing knowledge and building connections in the cannabis space.',
      roles: ['Educator', 'Community Leader', 'Advocate'],
      expertiseTags: ['Cannabis Education', 'Community Building', 'Cannabis Culture'],
      bannerUrl: 'https://images.unsplash.com/photo-1536424935794-24e3d4344ed6?w=1200&h=400&fit=crop',
    });

    console.log(`✓ Updated profile for ${PRIMARY_USER_EMAIL}`);
    return userId;
  } else {
    console.log(`⚠ User with email ${PRIMARY_USER_EMAIL} not found. They will need to sign up first.`);
    return null;
  }
}

function extractTags(content: any): string[] {
  const tags: string[] = [];
  
  // Extract from tags array
  if (content.tags && Array.isArray(content.tags)) {
    tags.push(...content.tags);
  }
  
  // Extract from category
  if (content.category) {
    tags.push(content.category);
  }
  
  // Extract from topics_covered
  if (content.topics_covered && Array.isArray(content.topics_covered)) {
    tags.push(...content.topics_covered);
  }
  
  // Extract from medical_conditions
  if (content.medical_conditions && Array.isArray(content.medical_conditions)) {
    tags.push(...content.medical_conditions);
  }
  
  // Normalize tags (remove spaces, lowercase, add # if not present)
  return tags.map(tag => {
    const normalized = tag.toLowerCase().replace(/\s+/g, '-');
    return normalized.startsWith('#') ? normalized : `#${normalized}`;
  });
}

async function seedArticles(contentLibrary: any[]) {
  console.log('\n📰 Seeding Articles...');
  const batch = db.batch();
  let count = 0;
  
  const articleTypes = ['news', 'guide', 'medical', 'story', 'lifestyle', 'blog'];
  const articles = contentLibrary.filter(item => articleTypes.includes(item.type));
  
  for (const item of articles) {
    const articleRef = db.collection('articles').doc();
    const tags = extractTags(item);
    
    let content = item.content || item.full_text || '';
    
    // Build rich content from sections if available
    if (item.sections && Array.isArray(item.sections)) {
      content = item.sections.map((section: any) => {
        let sectionText = `## ${section.heading}\n\n${section.content || ''}`;
        
        if (section.subsections) {
          sectionText += '\n\n' + section.subsections.map((sub: any) => 
            `### ${sub.name}\n${sub.description || ''}`
          ).join('\n\n');
        }
        
        return sectionText;
      }).join('\n\n');
    }
    
    // Add key takeaways
    if (item.key_takeaways && Array.isArray(item.key_takeaways)) {
      content += '\n\n## Key Takeaways\n\n';
      content += item.key_takeaways.map((t: string) => `- ${t}`).join('\n');
    }
    
    // Add expert quotes
    if (item.expert_quotes && Array.isArray(item.expert_quotes)) {
      content += '\n\n## Expert Insights\n\n';
      content += item.expert_quotes.map((q: any) => 
        `> "${q.quote}"\n> — ${q.expert}, ${q.credentials}`
      ).join('\n\n');
    }
    
    const articleData = {
      authorId: SYSTEM_USER_ID,
      title: item.title,
      content: content || item.excerpt || item.summary || 'Content coming soon...',
      coverUrl: item.featured_image || item.images?.[0]?.url || item.images?.[0],
      createdAt: item.date_published ? Timestamp.fromDate(new Date(item.date_published)) : Timestamp.now(),
      likeCount: 0,
      commentCount: 0,
      tags: tags,
      hidden: false,
      // Additional metadata
      metadata: {
        source: 'cannabis-content-framework',
        originalType: item.type,
        readTimeMinutes: item.read_time_minutes,
        priority: item.priority,
        difficultyLevel: item.difficulty_level,
        jurisdiction: item.jurisdiction,
        effectiveDate: item.effective_date
      }
    };
    
    batch.set(articleRef, articleData);
    count++;
    
    if (count % 500 === 0) {
      await batch.commit();
      console.log(`  ✓ Committed ${count} articles`);
    }
  }
  
  if (count % 500 !== 0) {
    await batch.commit();
  }
  
  console.log(`✓ Seeded ${count} articles`);
}

async function seedPosts(contentLibrary: any[]) {
  console.log('\n💬 Seeding Posts...');
  const batch = db.batch();
  let count = 0;
  
  const postTypes = ['quick_fact', 'short_blurb'];
  const posts = contentLibrary.filter(item => postTypes.includes(item.type));
  
  for (const item of posts) {
    const postRef = db.collection('posts').doc();
    const tags = extractTags(item);
    
    const postData = {
      authorId: SYSTEM_USER_ID,
      authorName: SYSTEM_USER_NAME,
      authorPhotoURL: SYSTEM_USER_PHOTO,
      content: item.content,
      createdAt: Timestamp.now(),
      likeCount: 0,
      commentCount: 0,
      tags: tags,
      hidden: false
    };
    
    batch.set(postRef, postData);
    count++;
  }
  
  if (count > 0) {
    await batch.commit();
  }
  
  console.log(`✓ Seeded ${count} posts`);
}

async function seedEvents(contentLibrary: any[]) {
  console.log('\n📅 Seeding Events...');
  const batch = db.batch();
  let count = 0;
  
  const events = contentLibrary.filter(item => item.type === 'event');
  
  for (const item of events) {
    const eventRef = db.collection('events').doc();
    
    const eventData = {
      organizerId: SYSTEM_USER_ID,
      title: item.title,
      description: item.description || '',
      startAt: item.date ? Timestamp.fromDate(new Date(item.date)) : Timestamp.now(),
      endAt: item.end_date ? Timestamp.fromDate(new Date(item.end_date)) : null,
      location: item.location || '',
      coverUrl: item.featured_image || item.images?.[0],
      createdAt: Timestamp.now(),
      metadata: {
        registrationUrl: item.registration_url,
        featuredSpeakers: item.featured_speakers || []
      }
    };
    
    batch.set(eventRef, eventData);
    count++;
  }
  
  if (count > 0) {
    await batch.commit();
  }
  
  console.log(`✓ Seeded ${count} events`);
}

async function seedCompaniesAndJobs() {
  console.log('\n🏢 Seeding Sample Companies and Jobs...');
  
  // Create a sample cannabis company
  const companyRef = db.collection('companies').doc();
  await companyRef.set({
    ownerId: SYSTEM_USER_ID,
    name: 'Green Horizons Cannabis Co.',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=greenhorizons',
    bio: 'Leading cannabis cultivation and retail company focused on sustainable practices and community education.',
    website: 'https://example.com',
    followerCount: 0,
    createdAt: Timestamp.now()
  });
  
  const companyId = companyRef.id;
  
  // Create sample jobs
  const jobs = [
    {
      title: 'Cannabis Cultivation Specialist',
      description: 'Experienced grower needed for indoor cultivation facility. Must have knowledge of organic growing methods and state compliance.',
      location: 'Denver, CO'
    },
    {
      title: 'Budtender / Cannabis Consultant',
      description: 'Customer-facing role helping patients and consumers find the right products. Cannabis knowledge and excellent communication skills required.',
      location: 'Los Angeles, CA'
    },
    {
      title: 'Compliance Manager',
      description: 'Ensure all operations meet state and local cannabis regulations. Legal background preferred.',
      location: 'Portland, OR'
    }
  ];
  
  for (const job of jobs) {
    const jobRef = db.collection('jobs').doc();
    await jobRef.set({
      companyId: companyId,
      title: job.title,
      description: job.description,
      location: job.location,
      createdAt: Timestamp.now()
    });
  }
  
  console.log('✓ Seeded 1 company and 3 jobs');
}

async function seedTopics(contentLibrary: any[]) {
  console.log('\n🏷️  Seeding Topics...');
  const topicsMap = new Map<string, { name: string; postCount: number; articleCount: number }>();
  
  // Collect all tags from content
  for (const item of contentLibrary) {
    const tags = extractTags(item);
    const isArticle = !['quick_fact', 'short_blurb'].includes(item.type);
    
    for (const tag of tags) {
      const id = tag.toLowerCase().replace(/^#/, '');
      const existing = topicsMap.get(id) || { name: tag, postCount: 0, articleCount: 0 };
      
      if (isArticle) {
        existing.articleCount++;
      } else {
        existing.postCount++;
      }
      
      topicsMap.set(id, existing);
    }
  }
  
  // Add default cannabis topics
  const defaultTopics = [
    { id: 'cannabis-education', name: '#cannabis-education', postCount: 0, articleCount: 0 },
    { id: 'medical-marijuana', name: '#medical-marijuana', postCount: 0, articleCount: 0 },
    { id: 'cannabis-culture', name: '#cannabis-culture', postCount: 0, articleCount: 0 },
    { id: 'legalization', name: '#legalization', postCount: 0, articleCount: 0 },
    { id: 'cultivation', name: '#cultivation', postCount: 0, articleCount: 0 },
    { id: 'cannabis-business', name: '#cannabis-business', postCount: 0, articleCount: 0 }
  ];
  
  for (const topic of defaultTopics) {
    if (!topicsMap.has(topic.id)) {
      topicsMap.set(topic.id, topic);
    }
  }
  
  // Save topics to Firestore
  const batch = db.batch();
  let count = 0;
  
  for (const [id, topic] of topicsMap.entries()) {
    const topicRef = db.collection('topics').doc(id);
    batch.set(topicRef, {
      name: topic.name,
      postCount: topic.postCount,
      articleCount: topic.articleCount,
      createdAt: Timestamp.now()
    });
    count++;
  }
  
  await batch.commit();
  console.log(`✓ Seeded ${count} topics`);
}

async function createSampleUsers() {
  console.log('\n👥 Creating sample users for testing...');

  const sampleUsers = [
    {
      uid: 'sample-user-1',
      displayName: 'Dr. Sarah Green',
      email: 'sarah.green@example.com',
      photoURL: 'https://i.pravatar.cc/150?img=1',
      bio: 'Cannabis researcher and medical professional. Specializing in cannabinoid science and patient care.',
      roles: ['Medical Professional', 'Researcher'],
      expertiseTags: ['Medical Cannabis', 'Research', 'Patient Care']
    },
    {
      uid: 'sample-user-2',
      displayName: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      photoURL: 'https://i.pravatar.cc/150?img=2',
      bio: 'Cannabis cultivator with 10+ years experience. Passionate about sustainable growing practices.',
      roles: ['Cultivator', 'Educator'],
      expertiseTags: ['Cultivation', 'Sustainability', 'Organic Growing']
    },
    {
      uid: 'sample-user-3',
      displayName: 'Lisa Chen',
      email: 'lisa.chen@example.com',
      photoURL: 'https://i.pravatar.cc/150?img=3',
      bio: 'Cannabis industry lawyer and compliance expert. Helping businesses navigate regulations.',
      roles: ['Legal Professional', 'Compliance'],
      expertiseTags: ['Legal', 'Compliance', 'Business']
    }
  ];

  for (const userData of sampleUsers) {
    const userRef = db.collection('users').doc(userData.uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      await userRef.set({
        ...userData,
        createdAt: Timestamp.now()
      });
    }
  }

  console.log(`✓ Created ${sampleUsers.length} sample users`);
}

async function main() {
  console.log('🌿 KAYA Cannabis Content Framework Seeder\n');
  console.log('This will populate your Firestore database with cannabis content.\n');

  // Load content framework
  const frameworkPath = path.join(__dirname, '..', 'data', 'cannabis-content-framework.json');

  if (!fs.existsSync(frameworkPath)) {
    console.error('❌ Error: cannabis-content-framework.json not found in data directory');
    process.exit(1);
  }

  const framework: ContentFramework = JSON.parse(fs.readFileSync(frameworkPath, 'utf8'));
  console.log('✓ Loaded content framework\n');

  try {
    // Create system user first
    await createSystemUser();

    // Find or update primary user profile
    const primaryUserId = await findOrCreatePrimaryUser();

    // Create sample users for testing
    await createSampleUsers();

    // Seed content
    await seedArticles(framework.content_library);
    await seedPosts(framework.content_library);
    await seedEvents(framework.content_library);
    await seedCompaniesAndJobs();
    await seedTopics(framework.content_library);

    console.log('\n✅ Content seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('  - System content curator created');
    console.log('  - Primary user profile updated (if signed up)');
    console.log('  - 3 sample users created for testing');
    console.log('  - Cannabis content framework imported');
    console.log('  - Articles, posts, events, jobs, and topics seeded');
    console.log('\nNext steps:');
    console.log('1. Run your development server: npm run dev');
    console.log('2. Visit http://localhost:3000 to see your content');
    console.log('3. Sign up with llanes.joseph.m@gmail.com if you haven\'t already');
    console.log('4. Check /articles, /events, /jobs pages for seeded content\n');

  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    process.exit(1);
  }
}

main();

