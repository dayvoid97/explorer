'use client'

import { Share2, Facebook, Twitter } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ShareButtons({
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

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
  }

  const handleShareToOthers = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: subtitle,
          url: url,
        })
      } catch (err) {
        console.log('Share cancelled or failed')
      }
    } else {
      handleCopyLink()
    }
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
        <button
          onClick={handleShareToOthers}
          className="p-2 rounded-full hover:bg-gray-100 transition text-gray-700 hover:text-green-600"
          title="Share via SMS, iMessage, Email, etc."
        >
          <Share2 size={20} />
        </button>
        {copied && <span className="text-xs text-green-600 font-medium">Copied!</span>}
      </div>
    </div>
  )
}
