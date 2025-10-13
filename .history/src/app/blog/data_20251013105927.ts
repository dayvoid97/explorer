export type BlogPost = {
  slug: string
  title: string
  subtitle: string
  categories: string[]
  content: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'getting-started',
    title: 'Getting Started with Gurkha Finance',
    subtitle: 'How to navigate the new financial frontier',
    categories: ['Finance', 'Getting Started'],
    content: `
      Welcome to Gurkha Finance! In this post, we'll guide you through the basics
      of setting up your first financial profile and tracking your wins effectively.

      Our goal is to make finance fun, social, and empowering.
    `,
  },
  {
    slug: 'market-sentiment',
    title: 'Understanding Market Sentiment',
    subtitle: 'How investors read emotions in the charts',
    categories: ['Markets', 'Education'],
    content: `
      Market sentiment represents the overall attitude of investors toward a
      particular security or the market as a whole. Here's how you can read it
      like a pro and make smarter moves.
    `,
  },
]
