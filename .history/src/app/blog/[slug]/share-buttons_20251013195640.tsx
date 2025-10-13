'use client'

import { useEffect, useState } from 'react'

// SVG Icons for better quality
const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75-2.45 2.5-5.5 2.5-5.5" />
  </svg>
)

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 011-1h3z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const RedditIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 11-2.498 0c0-.688.562-1.249 1.249-1.249zm-5.01 0c.689 0 1.25.561 1.25 1.249a1.25 1.25 0 11-2.498 0c0-.688.561-1.249 1.249-1.249zm5.008 9.75c-.708 0-1.386.086-2.06.28a2.04 2.04 0 00-3.97 0 13.882 13.882 0 01-2.06-.28c-.3 0-.484.3-.484.632 0 .414.335 1.09.923 1.771.388.41 1.06.776 2.05.776s1.662-.368 2.05-.776c.588-.68.923-1.357.923-1.771 0-.332-.184-.632-.484-.632zm-.006 2.822c-1.215.224-1.87.792-1.87 1.342 0 .564.648 1.212 1.87 1.436 1.216-.224 1.87-.872 1.87-1.436 0-.55-.654-1.118-1.87-1.342z" />
  </svg>
)

const CopyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
)

export function ShareButtons({ title, subtitle }: { title: string; subtitle: string }) {
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setUrl(typeof window !== 'undefined' ? window.location.href : '')
  }, [])

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-4 py-4 border-t border-b border-gray-200">
      <span className="text-sm font-medium">Share:</span>
      <div className="flex gap-3">
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-blue-50 transition text-gray-700 hover:text-blue-500"
          title="Share on Twitter/X"
        >
          <TwitterIcon />
        </a>
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-blue-50 transition text-gray-700 hover:text-blue-600"
          title="Share on Facebook"
        >
          <FacebookIcon />
        </a>
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-blue-50 transition text-gray-700 hover:text-blue-700"
          title="Share on LinkedIn"
        >
          <LinkedInIcon />
        </a>
        <a
          href={shareLinks.reddit}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-orange-50 transition text-gray-700 hover:text-orange-600"
          title="Share on Reddit"
        >
          <RedditIcon />
        </a>
        <button
          onClick={handleCopyLink}
          className="p-2 rounded-full hover:bg-gray-100 transition text-gray-700 hover:text-green-600"
          title="Copy link"
        >
          <CopyIcon />
        </button>
        {copied && <span className="text-xs text-green-600 font-medium">Copied!</span>}
      </div>
    </div>
  )
}
