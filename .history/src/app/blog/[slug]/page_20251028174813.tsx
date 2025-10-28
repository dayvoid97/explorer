'use client'
import Link from 'next/link'
import { getPostBySlug } from '@/app/lib/markdown'
import { BlogPost } from './metadata'
import { ShareButtons } from './share-buttons'
import { ClientMDX } from '@/app/components/ClientMDX'
import remarkGfm from 'remark-gfm'

const components = {
  h1: (props: any) => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-bold mt-8 mb-4" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-bold mt-6 mb-3" {...props} />,
  p: (props: any) => <p className="mb-3 text-base" {...props} />,
  a: (props: any) => (
    <a className="text-white bg-green-800 rounded font-bold hover:underline px-2 py-1" {...props} />
  ),
  ul: (props: any) => <ul className="list-disc mb-4 space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal mb-4 space-y-2" {...props} />,
  li: (props: any) => <li className="ml-4" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-gray-800 pl-4 italic my-4" {...props} />
  ),
  img: (props: any) => <img className="rounded-lg my-6 w-full" {...props} />,
  code: (props: any) => (
    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
  ),
  table: (props: any) => <table className="min-w-full border border-gray-300 my-6" {...props} />,
  thead: (props: any) => <thead className="bg-gray-100" {...props} />,
  tbody: (props: any) => <tbody {...props} />,
  tr: (props: any) => <tr className="border-b border-gray-300" {...props} />,
  th: (props: any) => <th className="border border-gray-300 px-4 py-2 font-bold" {...props} />,
  td: (props: any) => <td className="border border-gray-300 px-4 py-2" {...props} />,
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post: BlogPost = await getPostBySlug(slug)

  return (
    <main className="max-w-3xl mx-auto p-8">
      <Link
        href="/blog"
        className="inline-flex items-center bg-red-700 hover:text-gray-900 mb-8 px-3 py-1 rounded transition"
      >
        ← Back to Blog
      </Link>

      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
      <h2 className="text-lg mb-4">{post.subtitle}</h2>

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
        <ClientMDX source={post.content} components={components} />
      </article>
    </main>
  )
}
