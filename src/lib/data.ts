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
  { id: '1', user: { name: 'Alice', avatarUrl: 'https://placehold.co/128x128.png' } },
  { id: '2', user: { name: 'Bob', avatarUrl: 'https://placehold.co/128x128.png' } },
  { id: '3', user: { name: 'Charlie', avatarUrl: 'https://placehold.co/128x128.png' } },
  { id: '4', user: { name: 'Diana', avatarUrl: 'https://placehold.co/128x128.png' } },
  { id: '5', user: { name: 'Eve', avatarUrl: 'https://placehold.co/128x128.png' } },
  { id: '6', user: { name: 'Frank', avatarUrl: 'https://placehold.co/128x128.png' } },
  { id: '7', user: { name: 'Grace', avatarUrl: 'https://placehold.co/128x128.png' } },
];

export const posts: Post[] = [
  {
    id: '1',
    author: { name: 'Grace', avatarUrl: 'https://placehold.co/128x128.png' },
    content: 'Just enjoying a beautiful sunset at the beach. #blessed #sunset',
    imageUrl: 'https://placehold.co/600x400.png',
    likes: 128,
    commentsCount: 12,
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: '2',
    author: { name: 'Frank', avatarUrl: 'https://placehold.co/128x128.png' },
    content: 'My new setup is finally complete! What do you guys think?',
    imageUrl: 'https://placehold.co/600x400.png',
    likes: 345,
    commentsCount: 45,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '3',
    author: { name: 'Eve', avatarUrl: 'https://placehold.co/128x128.png' },
    content: 'Thinking about the future of web development. Server components are a game changer!',
    likes: 99,
    commentsCount: 23,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
];

export const messages: Message[] = [
    { id: '1', user: { name: 'Alice', avatarUrl: 'https://placehold.co/128x128.png' }, lastMessage: 'Hey, are you free this weekend?', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), unread: 2 },
    { id: '2', user: { name: 'Bob', avatarUrl: 'https://placehold.co/128x128.png' }, lastMessage: 'Let\'s catch up tomorrow!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), unread: 0 },
    { id: '3', user: { name: 'Charlie', avatarUrl: 'https://placehold.co/128x128.png' }, lastMessage: 'Loved your latest post!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), unread: 0 },
];

export const trendingTopics = [
    { name: '#NextJS15', posts: '15.2k' },
    { name: '#AIFuturism', posts: '12.8k' },
    { name: '#KayaLaunch', posts: '10.1k' },
    { name: '#UIUXDesign', posts: '8.7k' },
]

export const suggestions = [
    { name: 'TechInnovators', avatarUrl: 'https://placehold.co/128x128.png', handle: 'techtrends' },
    { name: 'ArtVibes', avatarUrl: 'https://placehold.co/128x128.png', handle: 'dailyart' },
    { name: 'FoodieHub', avatarUrl: 'https://placehold.co/128x128.png', handle: 'tastybites' },
]
