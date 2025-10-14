'use client'

import { Share2, Facebook, Linkedin, Twitter } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ShareButtons({
  title,
  subtitle,
  image,
  categories,
}: {
  title: string
  subtitle: string
  image?: string
  categories?: string[]
}) {
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setUrl(typeof window !== 'undefined' ? window.location.href : '')
  }, [])

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(subtitle)
  const encodedImage = image ? encodeURIComponent(image) : ''

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=FinancialGurkha`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
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
          title="Share on X"
        >
          <Twitter size={20} />
        </a>
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-blue-50 transition text-gray-700 hover:text-blue-600"
          title="Share on Facebook"
        >
          <Facebook size={20} />
        </a>
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-blue-50 transition text-gray-700 hover:text-blue-700"
          title="Share on LinkedIn"
        >
          <Linkedin size={20} />
        </a>

        <button
          onClick={handleCopyLink}
          className="p-2 rounded-full hover:bg-gray-100 transition text-gray-700 hover:text-green-600"
          title="Copy link"
        >
          <Share2 size={20} />
        </button>
        {copied && <span className="text-xs text-green-600 font-medium">Copied!</span>}
      </div>
    </div>
  )
}
