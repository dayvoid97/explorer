import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug } from '../../lib/markdown'
import { BlogPost } from './metadata'
import { ShareButtons } from './share-buttons'

// AdSense component
const AdSenseAd = () => {
  return (
    <div className="my-8 flex justify-center">
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8441965953327461"
        crossOrigin="anonymous"
      ></script>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
        }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-8441965953327461"
        data-ad-slot="6533303772"
      ></ins>
      <script>{`(adsbygoogle = window.adsbygoogle || []).push({});`}</script>
    </div>
  )
}

const components = {
  h1: (props: any) => (
    <h1
      className="text-4xl font-bold mt-8 mb-4"
      style={{
        fontFamily: "'Freight Big Pro', serif",
        fontWeight: 800,
        letterSpacing: '-0.05rem',
      }}
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      className="text-3xl font-bold mt-8 mb-4"
      style={{
        fontFamily: "'Freight Big Pro', serif",
        fontWeight: 800,
        letterSpacing: '-0.05rem',
      }}
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      className="text-2xl font-bold mt-6 mb-3"
      style={{
        fontFamily: "'Freight Big Pro', serif",
        fontWeight: 800,
        letterSpacing: '-0.05rem',
      }}
      {...props}
    />
  ),
  p: (props: any) => (
    <p
      style={{
        fontFamily: 'Helvetica',
        fontWeight: 400,
        fontStyle: 'normal',
      }}
      {...props}
    />
  ),
  a: (props: any) => <a className="text-blue-600 hover:underline" {...props} />,
  ul: (props: any) => <ul className="list-disc  mb-4 space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal  mb-4 space-y-2" {...props} />,
  li: (props: any) => <li className="ml-2" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-gray-800 pl-4 italic  my-4" {...props} />
  ),
  img: (props: any) => <img className="rounded-lg my-6 w-full" {...props} />,
  code: (props: any) => (
    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
  ),
}

// Helper function to inject ads based on content length
function injectAdsIntoContent(content: string): string {
  const wordCount = content.split(/\s+/).length
  let adPlaceholder = '<AdSenseAd />'

  // Add ads based on content length
  if (wordCount > 2000) {
    // For very long articles, add ads after every h2 paragraph
    return content.replace(/(## .+\n\n.+?(?=\n\n(?:##|#|$)))/gm, `$1\n\n${adPlaceholder}`)
  } else if (wordCount > 500) {
    // For medium articles, add ads after every 2nd h2 paragraph
    let headingCount = 0
    return content.replace(/(## .+\n\n.+?(?=\n\n(?:##|#|$)))/gm, (match) => {
      headingCount++
      return headingCount % 2 === 0 ? `${match}\n\n${adPlaceholder}` : match
    })
  }

  return content
}

export default async function BlogArticlePage({ params }: { params: { slug: string } }) {
  const post: BlogPost = await getPostBySlug(params.slug)

  // Inject ads into content based on length
  const contentWithAds = injectAdsIntoContent(post.content)

  return (
    <main className="max-w-3xl mx-auto p-8">
      <Link
        href="/blog"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition"
      >
        <span className="mr-2">←</span>
        Back to Blog
      </Link>

      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
      <h2 className="text-lg text-gray-600 mb-4">{post.subtitle}</h2>

      <div className="mb-6 flex flex-wrap gap-2">
        {post.categories.map((cat) => (
          <span key={cat} className="text-sm bg-gray-200 px-2 py-1 rounded-full text-gray-700">
            {cat}
          </span>
        ))}
      </div>
      <ShareButtons title={post.title} subtitle={post.subtitle} />
      {post.image && <img src={post.image} alt={post.title} className="mb-6 rounded-xl" />}

      <article className="prose prose-lg dark:prose-invert max-w-none mt-8">
        <MDXRemote source={contentWithAds} components={{ ...components, AdSenseAd }} />
      </article>
    </main>
  )
}
