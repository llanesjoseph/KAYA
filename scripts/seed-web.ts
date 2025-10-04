/**
 * Web-based Seed Script for KAYA Cannabis Content Framework
 *
 * This script uses Firebase Web SDK to populate Firestore
 * Run with: npx tsx scripts/seed-web.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, addDoc, Timestamp, writeBatch } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

async function createSystemUser() {
  console.log('Creating system user...');
  const userRef = doc(db, 'users', SYSTEM_USER_ID);

  try {
    await setDoc(userRef, {
      uid: SYSTEM_USER_ID,
      displayName: SYSTEM_USER_NAME,
      email: 'content@kayahub.com',
      photoURL: SYSTEM_USER_PHOTO,
      bio: 'Official KAYA content curator bringing you the latest in cannabis news, education, and culture.',
      createdAt: Timestamp.now(),
      roles: ['Content Creator', 'Educator'],
      expertiseTags: ['Cannabis Education', 'Industry News', 'Legal Updates']
    }, { merge: true });
    console.log('✓ System user created/updated');
  } catch (error) {
    console.error('Error creating system user:', error);
  }
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
    const userRef = doc(db, 'users', userData.uid);
    await setDoc(userRef, {
      ...userData,
      createdAt: Timestamp.now()
    }, { merge: true });
  }

  console.log(`✓ Created ${sampleUsers.length} sample users`);
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
  let count = 0;

  const articleTypes = ['news', 'guide', 'medical', 'story', 'lifestyle', 'blog'];
  const articles = contentLibrary.filter(item => articleTypes.includes(item.type));

  for (const item of articles) {
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

    const articleData: any = {
      authorId: SYSTEM_USER_ID,
      title: item.title,
      content: content || item.excerpt || item.summary || 'Content coming soon...',
      coverUrl: item.featured_image || item.images?.[0]?.url || item.images?.[0] || '',
      createdAt: item.date_published ? Timestamp.fromDate(new Date(item.date_published)) : Timestamp.now(),
      likeCount: 0,
      commentCount: 0,
      tags: tags,
      hidden: false
    };

    // Only add metadata fields that are defined
    const metadata: any = { source: 'cannabis-content-framework' };
    if (item.type) metadata.originalType = item.type;
    if (item.read_time_minutes) metadata.readTimeMinutes = item.read_time_minutes;
    if (item.priority) metadata.priority = item.priority;
    if (item.difficulty_level) metadata.difficultyLevel = item.difficulty_level;
    if (item.jurisdiction) metadata.jurisdiction = item.jurisdiction;
    if (item.effective_date) metadata.effectiveDate = item.effective_date;

    if (Object.keys(metadata).length > 1) {
      articleData.metadata = metadata;
    }

    await addDoc(collection(db, 'articles'), articleData);
    count++;
  }

  console.log(`✓ Seeded ${count} articles`);
}

async function seedPosts(contentLibrary: any[]) {
  console.log('\n💬 Seeding Posts...');
  let count = 0;

  const postTypes = ['quick_fact', 'short_blurb'];
  const posts = contentLibrary.filter(item => postTypes.includes(item.type));

  for (const item of posts) {
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

    await addDoc(collection(db, 'posts'), postData);
    count++;
  }

  console.log(`✓ Seeded ${count} posts`);
}

async function seedEvents(contentLibrary: any[]) {
  console.log('\n📅 Seeding Events...');
  let count = 0;

  const events = contentLibrary.filter(item => item.type === 'event');

  for (const item of events) {
    const eventData: any = {
      organizerId: SYSTEM_USER_ID,
      title: item.title,
      description: item.description || '',
      startAt: item.date ? Timestamp.fromDate(new Date(item.date)) : Timestamp.now(),
      location: item.location || '',
      coverUrl: item.featured_image || item.images?.[0] || '',
      createdAt: Timestamp.now()
    };

    // Only add optional fields if defined
    if (item.end_date) {
      eventData.endAt = Timestamp.fromDate(new Date(item.end_date));
    }

    const metadata: any = {};
    if (item.registration_url) metadata.registrationUrl = item.registration_url;
    if (item.featured_speakers?.length) metadata.featuredSpeakers = item.featured_speakers;

    if (Object.keys(metadata).length > 0) {
      eventData.metadata = metadata;
    }

    await addDoc(collection(db, 'events'), eventData);
    count++;
  }

  console.log(`✓ Seeded ${count} events`);
}

async function seedCompaniesAndJobs() {
  console.log('\n🏢 Seeding Sample Companies and Jobs...');

  // Create a sample cannabis company
  const companyRef = await addDoc(collection(db, 'companies'), {
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
    await addDoc(collection(db, 'jobs'), {
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
  let count = 0;

  for (const [id, topic] of topicsMap.entries()) {
    await setDoc(doc(db, 'topics', id), {
      name: topic.name,
      postCount: topic.postCount,
      articleCount: topic.articleCount,
      createdAt: Timestamp.now()
    });
    count++;
  }

  console.log(`✓ Seeded ${count} topics`);
}

async function main() {
  console.log('🌿 KAYA Cannabis Content Framework Seeder (Web SDK)\n');
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
    console.log('  - 3 sample users created for testing');
    console.log('  - Cannabis content framework imported');
    console.log('  - Articles, posts, events, jobs, and topics seeded');
    console.log('\nNext steps:');
    console.log('1. Run your development server: npm run dev');
    console.log('2. Visit http://localhost:3000 to see your content');
    console.log('3. Sign up with llanes.joseph.m@gmail.com if you haven\'t already');
    console.log('4. Check /articles, /events, /jobs pages for seeded content\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    process.exit(1);
  }
}

main();
