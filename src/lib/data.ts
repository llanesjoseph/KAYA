export type User = {
  name: string;
  avatarUrl: string;
};

export type Story = {
  id: string;
  user: User;
};

export type Post = {
  id: string;
  author: User;
  content: string;
  imageUrl?: string;
  likes: number;
  commentsCount: number;
  timestamp: string;
};

export type Message = {
    id: string;
    user: User;
    lastMessage: string;
    timestamp: string;
    unread: number;
}

export const stories: Story[] = [
  { id: '1', user: { name: 'Kaya Collective', avatarUrl: 'https://placehold.co/128x128.png?text=KC' } },
  { id: '2', user: { name: 'Green Rooted', avatarUrl: 'https://placehold.co/128x128.png?text=GR' } },
  { id: '3', user: { name: 'Earthbound Herbals', avatarUrl: 'https://placehold.co/128x128.png?text=EH' } },
  { id: '4', user: { name: 'Forest & Flower', avatarUrl: 'https://placehold.co/128x128.png?text=FF' } },
  { id: '5', user: { name: 'Cedar & Sage', avatarUrl: 'https://placehold.co/128x128.png?text=CS' } },
  { id: '6', user: { name: 'Sunrise Farms', avatarUrl: 'https://placehold.co/128x128.png?text=SF' } },
  { id: '7', user: { name: 'Moss & Moon', avatarUrl: 'https://placehold.co/128x128.png?text=MM' } },
];

export const posts: Post[] = [
  {
    id: '1',
    author: { name: 'Green Rooted', avatarUrl: 'https://placehold.co/128x128.png?text=GR' },
    content:
      'Morning trim in the garden. Pine, citrus, and damp earth on the breeze. Grounded and grateful. #terpenes #sunGrown',
    imageUrl: 'https://placehold.co/1200x675.png?text=Sun-grown+Garden',
    likes: 214,
    commentsCount: 18,
    timestamp: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
  },
  {
    id: '2',
    author: { name: 'Earthbound Herbals', avatarUrl: 'https://placehold.co/128x128.png?text=EH' },
    content:
      'Cold-cured rosin, small-batch, pressed low and slow. Notes of forest floor and sweet resin. #solventless #craft',
    imageUrl: 'https://placehold.co/1200x675.png?text=Rosin+Jar',
    likes: 389,
    commentsCount: 47,
    timestamp: new Date(Date.now() - 1000 * 60 * 63).toISOString(),
  },
  {
    id: '3',
    author: { name: 'Cedar & Sage', avatarUrl: 'https://placehold.co/128x128.png?text=CS' },
    content:
      'Walking the tree line before sundown. Soil is rich, canopy is humming. Nature knows the way. #regenerative #livingSoil',
    imageUrl: 'https://placehold.co/1200x675.png?text=Forest+Edge',
    likes: 151,
    commentsCount: 22,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: '4',
    author: { name: 'Moss & Moon', avatarUrl: 'https://placehold.co/128x128.png?text=MM' },
    content:
      'Hand-rolled with organic paper, lakeside reflection session. Calm mind, rooted heart. #eveningRitual #nature',
    imageUrl: 'https://placehold.co/1200x675.png?text=Lakeside+Ritual',
    likes: 278,
    commentsCount: 39,
    timestamp: new Date(Date.now() - 1000 * 60 * 147).toISOString(),
  },
];

export const messages: Message[] = [
  {
    id: '1',
    user: { name: 'Forest & Flower', avatarUrl: 'https://placehold.co/128x128.png?text=FF' },
    lastMessage: 'Trail walk at golden hour later? The pines are singing.',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    unread: 2,
  },
  {
    id: '2',
    user: { name: 'Sunrise Farms', avatarUrl: 'https://placehold.co/128x128.png?text=SF' },
    lastMessage: "Cure room smells like citrus peel and rain. Come by tomorrow?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    unread: 0,
  },
  {
    id: '3',
    user: { name: 'Green Rooted', avatarUrl: 'https://placehold.co/128x128.png?text=GR' },
    lastMessage: 'Soil mix drop next week—worm castings and forest compost.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    unread: 0,
  },
];

export const trendingTopics = [
  { name: '#LivingSoil', posts: '12.4k' },
  { name: '#SunGrown', posts: '11.1k' },
  { name: '#RegenerativeAg', posts: '9.8k' },
  { name: '#TerpTalk', posts: '7.6k' },
];

export const suggestions = [
  { name: 'Redwood Resin', avatarUrl: 'https://placehold.co/128x128.png?text=RR', handle: 'redwoodresin' },
  { name: 'River Stone', avatarUrl: 'https://placehold.co/128x128.png?text=RS', handle: 'riverstone' },
  { name: 'Valley Bloom', avatarUrl: 'https://placehold.co/128x128.png?text=VB', handle: 'valleybloom' },
];
