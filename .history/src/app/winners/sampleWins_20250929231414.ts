import { WinProps } from '../components/WinCard'
export const sampleWins: WinProps['win'][] = [
  {
    id: '1',
    username: 'sarahdesigns',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    title: 'Landed my first design client! 🎨',
    paragraphs: [
      'After months of building my portfolio and reaching out to local businesses, I finally signed my first paid design contract!',
      "It's a complete rebrand for a local coffee shop. They loved my modern aesthetic and color palette ideas. Starting next week!",
    ],
    upvotes: 24,
    previewImageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400',
    commentCount: 8,
  },
  {
    id: '2',
    username: 'techstartup_mike',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    title: 'Hit 1,000 users this morning! 🚀',
    paragraphs: [
      'Our SaaS product just crossed 1,000 active users! Started from zero 6 months ago.',
      'The growth has been organic - no paid ads yet. Just word of mouth and solving a real problem for developers.',
    ],
    upvotes: 156,
    commentCount: 23,
  },
  {
    id: '3',
    username: 'fitnessjourney_alex',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    title: 'Completed my first marathon! 26.2 miles ✅',
    paragraphs: [
      "I did it! Finished my first marathon in 4:32:18. A year ago, I couldn't run a single mile without stopping.",
      'The training was brutal but so worth it. Already signed up for the next one!',
    ],
    upvotes: 89,
    previewImageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400',
    commentCount: 15,
    externalLink: {
      url: 'https://youtube.com/watch?v=example',
      type: 'content',
      platform: 'youtube',
      previewImage: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400',
    },
  },
  {
    id: '4',
    username: 'bookworm_emma',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    title: 'Published my first novel! 📚',
    paragraphs: [
      'After 3 years of writing, editing, and countless rejections, my debut novel is finally available on Amazon!',
      "It's a sci-fi thriller about AI consciousness. Never thought I'd see this day. Thank you to everyone who believed in me.",
    ],
    upvotes: 203,
    commentCount: 41,
  },
  {
    id: '5',
    username: 'chefinthecity',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
    title: 'My restaurant got its first Michelin star! ⭐',
    paragraphs: [
      "I'm literally shaking. The Michelin Guide just announced their new ratings and we made the list!",
      'This has been my dream since culinary school 15 years ago. All those 80-hour weeks finally paid off.',
    ],
    upvotes: 421,
    previewImageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    commentCount: 67,
  },
  {
    id: '6',
    username: 'codemaster_jay',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 2 weeks ago
    title: 'Open source project hit 10k GitHub stars! ⭐',
    paragraphs: [
      'My side project that I started 2 years ago just reached 10,000 stars on GitHub!',
      "It's a React component library for data visualization. Never expected it to get this much traction. The community contributions have been amazing!",
    ],
    upvotes: 312,
    commentCount: 52,
  },
  {
    id: '7',
    username: 'musicproducer_leo',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 1 month ago
    title: "My track got featured on Spotify's editorial playlist! 🎵",
    paragraphs: [
      'Just woke up to an email from Spotify - they added my latest single to "New Music Friday" with 3.2M followers!',
      'Been making beats in my bedroom for 5 years. This is surreal.',
    ],
    upvotes: 178,
    previewImageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
    commentCount: 34,
  },
  {
    id: '8',
    username: 'smallbiz_owner',
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(), // 20 minutes ago
    title: 'Just closed my best sales month ever! 💰',
    paragraphs: [
      "My online store just hit $50k in revenue this month - that's 3x last month's sales!",
      'Started this business from my garage 18 months ago. Persistence really does pay off.',
    ],
    upvotes: 45,
    commentCount: 9,
  },
]
