export type BlogPost = {
  slug: string
  title: string
  subtitle: string
  categories: string[]
  content: string // markdown text
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'mp-materials-valuation',
    title: 'MP Materials: A Discounted Cash Flow Valuation Approach',
    subtitle: 'MP Materials (NYSE:MP)...',
    categories: ['Nasdaq', 'Stocks', 'Rare Earths'],
    content: `
Welcome to **Gurkha Finance!**

![MP Materials Chart](https://yourcdn.com/images/mp-materials-chart.png)

MP Materials is a leading producer of NdPr—core ingredients for permanent magnets.

Read more on [Investor Relations](https://mpmaterials.com/investors).

You can also download the full DCF spreadsheet here:
[Download Excel File](https://yourcdn.com/files/mp-dcf.xlsx)
    `,
  },
]
