import { appArticle, appItems, appJson, type AppKind } from '@/app/lib/app-content'

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  return (await appItems()).map((i) => ({ kind: i.kind, slug: i.slug }))
}

/** One brief or article with its body as markdown: /api/app/v1/content/<news|research>/<slug> */
export async function GET(_req: Request, { params }: { params: Promise<{ kind: string; slug: string }> }) {
  const { kind, slug } = await params
  const article = await appArticle(kind as AppKind, slug)
  if (!article) return appJson({ error: 'not found' })
  return appJson(article)
}
