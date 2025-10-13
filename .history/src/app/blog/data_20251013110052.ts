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
    subtitle:
      'MP Materials (NYSE:MP), a leading rare earth materials producer in the Western Hemisphere,has impressively grown their revenue since going public in 2020. The company recently began producing NdPr- core ingredients for manufacturing permanent magnets. In this article we approach MP Materials valuation through a discounted cash flow approach.',
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
