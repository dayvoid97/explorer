'use client'

import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug } from '../../lib/markdown'
import { BlogPost } from './metadata'
import { Share2, Facebook, Linkedin, Twitter } from 'lucide-react'
import { useEffect, useState } from 'react'

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

function ShareButtons({
  title,
  subtitle,
  image,
}: {
  title: string
  subtitle: string
  image?: string
}) {
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setUrl(typeof window !== 'undefined' ? window.location.href : '')
  }, [])

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedSubtitle = encodeURIComponent(subtitle)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=FinancialGurkha`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-4 py-4 border-t border-b border-gray-200">
      <span className="text-sm font-medium text-gray-600">Share:</span>
      <div className="flex gap-3">
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-blue-50 transition"
          title="Share on Twitter"
        >
          <Twitter size={20} className="text-blue-400" />
        </a>
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-blue-50 transition"
          title="Share on Facebook"
        >
          <Facebook size={20} className="text-blue-600" />
        </a>
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-blue-50 transition"
          title="Share on LinkedIn"
        >
          <Linkedin size={20} className="text-blue-700" />
        </a>
        <button
          onClick={handleCopyLink}
          className="p-2 rounded-full hover:bg-gray-100 transition"
          title="Copy link"
        >
          <Share2 size={20} className="text-gray-600" />
        </button>
        {copied && <span className="text-xs text-green-600 font-medium">Copied!</span>}
      </div>
    </div>
  )
}

export default async function BlogArticlePage({ params }: { params: { slug: string } }) {
  const post: BlogPost = await getPostBySlug(params.slug)

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

      {post.image && <img src={post.image} alt={post.title} className="mb-6 rounded-xl" />}

      <ShareButtons title={post.title} subtitle={post.subtitle} image={post.image} />

      <article className="prose prose-lg dark:prose-invert max-w-none mt-8">
        <MDXRemote source={post.content} components={components} />
      </article>
    </main>
  )
}
