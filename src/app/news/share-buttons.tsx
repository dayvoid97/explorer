'use client'

import { useState } from 'react'
import { Twitter, Mail, MessageCircle, Link2, Share2, Instagram, Check } from 'lucide-react'

/** Minimal Threads glyph (lucide has no brand icon for it). */
function ThreadsIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="11"
        fontWeight="bold"
        fill="currentColor"
        stroke="none"
        fontFamily="system-ui, sans-serif"
      >
        @
      </text>
    </svg>
  )
}
function RedditIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="14" r="7" />
      <circle cx="9.4" cy="13" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="14.6" cy="13" r="0.6" fill="currentColor" stroke="none" />
      <path d="M9.2 16.4c.9.9 4.7.9 5.6 0" />
      <path d="M12 7V4" />
      <circle cx="12" cy="3.2" r="0.9" fill="currentColor" stroke="none" />
      <path d="M5.6 11.2 3.5 10" />
      <path d="M18.4 11.2l2.1-1.2" />
    </svg>
  )
}

export function NewsShareButtons({
  title,
  url,
  image,
  excerpt,
  compact = false,
}: {
  title: string
  url: string
  image?: string
  excerpt?: string
  compact?: boolean
}) {
  const [copied, setCopied] = useState(false)
  const [hint, setHint] = useState<string | null>(null)

  const showHint = (msg: string, ms = 4500) => {
    setHint(msg)
    setTimeout(() => setHint(null), ms)
  }

  const copyLinkQuietly = async (): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(url)
      return true
    } catch {
      return false
    }
  }

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const shareText = `${title} ${url}`
  const encodedShareText = encodeURIComponent(shareText)

  const links = {
    x: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedShareText}`,
    sms: `sms:?&body=${encodedShareText}`,
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url })
      } catch {
        /* user cancelled */
      }
    } else {
      handleCopyLink()
    }
  }

  /**
   * "Post on Threads" — pre-formats headline + first line + link, copies it,
   * and opens the native share sheet with the cover image where Threads is
   * one tap away. Note: this posts from the *visitor's* Threads account;
   * only the newsroom (server-side) can publish as @financialgurkha.
   */
  const handleThreadsShare = async () => {
    const threadsText = excerpt ? `${title}\n\n${excerpt}\n\n${url}` : `${title}\n\n${url}`
    try {
      await navigator.clipboard.writeText(threadsText)
      showHint('Copied — paste it into Threads')
    } catch {
      /* clipboard unavailable; still try the share sheet */
    }
    if (image) {
      try {
        const res = await fetch(image)
        const blob = await res.blob()
        const file = new File([blob], 'financial-gurkha-cover.jpg', {
          type: blob.type || 'image/jpeg',
        })
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title, text: threadsText })
          return
        }
      } catch {
        /* fall through */
      }
    }
    handleNativeShare()
  }

  /**
   * "Share as IG story" — Instagram offers no web share URL for Stories
   * (unlike X/Reddit intents); it only works from native mobile apps.
   * Closest the web gets: the Web Share API with the cover image as a file,
   * which on phones opens the OS share sheet where Instagram (incl. Stories)
   * appears as a target. On desktop we fall back to downloading the cover
   * image + copying the link so the reader can post it manually.
   */
  const handleStoryShare = async () => {
    // Always copy the link first: on phones the reader pastes it straight
    // into Instagram's link sticker; on desktop the fallback below re-copies.
    const linkCopied = await copyLinkQuietly()
    if (linkCopied) {
      showHint('Link copied — paste it as a sticker in your story')
    }

    if (image) {
      try {
        const res = await fetch(image)
        const blob = await res.blob()
        const file = new File([blob], 'financial-gurkha-cover.jpg', {
          type: blob.type || 'image/jpeg',
        })
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title, text: shareText })
          return
        }
      } catch {
        /* fall through to manual fallback */
      }
      // Desktop fallback: download the cover + (re)copy the link.
      try {
        const a = document.createElement('a')
        a.href = image
        a.download = 'financial-gurkha-cover.jpg'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        await copyLinkQuietly()
        showHint('Image saved + link copied — paste it as a sticker in your story')
        return
      } catch {
        /* fall through */
      }
    }
    handleNativeShare()
  }

  const btn =
    'p-2 rounded-full transition text-stone-500 hover:text-amber-800 hover:bg-amber-100/60'
  const size = compact ? 16 : 18

  return (
    <div className={compact ? 'flex items-center gap-1' : 'flex items-center gap-2'}>
      {!compact && (
        <span className="text-sm font-semibold text-stone-500 mr-1">Share</span>
      )}
      <a
        href={links.x}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
        title="Share on X"
        aria-label="Share on X"
      >
        <Twitter size={size} />
      </a>
      <a
        href={links.reddit}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
        title="Share on Reddit"
        aria-label="Share on Reddit"
      >
        <RedditIcon size={size} />
      </a>
      <button
        onClick={handleThreadsShare}
        className={btn}
        title="Post on Threads"
        aria-label="Post on Threads"
      >
        <ThreadsIcon size={size} />
      </button>
      <a href={links.email} className={btn} title="Email to a friend" aria-label="Email to a friend">
        <Mail size={size} />
      </a>
      <a href={links.sms} className={btn} title="Text this article" aria-label="Text this article">
        <MessageCircle size={size} />
      </a>
      <button
        onClick={handleStoryShare}
        className={btn}
        title="Share as Instagram story"
        aria-label="Share as Instagram story"
      >
        <Instagram size={size} />
      </button>
      <button
        onClick={handleNativeShare}
        className={btn}
        title="More sharing options"
        aria-label="More sharing options"
      >
        <Share2 size={size} />
      </button>
      <button
        onClick={handleCopyLink}
        className={btn}
        title="Copy link"
        aria-label="Copy link"
      >
        {copied ? <Check size={size} className="text-green-600" /> : <Link2 size={size} />}
      </button>
      {copied && !compact && (
        <span className="text-xs text-green-700 font-medium">Copied!</span>
      )}
      {hint && (
        <span className="text-xs text-stone-500 font-medium transition-opacity">
          {hint}
        </span>
      )}
    </div>
  )
}
