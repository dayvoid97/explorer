'use client'

import { Share2, Facebook, Linkedin, Twitter, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ShareButtons({ title, subtitle }: { title: string; subtitle: string }) {
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setUrl(typeof window !== 'undefined' ? window.location.href : '')
  }, [])

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

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
      <span className="text-sm font-medium ">Share:</span>
      <div className="flex gap-3">
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-blue-50 transition"
          title="Share on Twitter"
        >
          <X size={20} className="text-black" />
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
