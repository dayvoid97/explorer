'use client'

import React, { useState } from 'react'
import { Copy, MessageSquare, Linkedin, Check, X as XIcon } from 'lucide-react'

export interface ShareMenuProps {
  isOpen: boolean
  onClose: () => void
  shareData: {
    url: string
    title: string
    text: string
  }
  className?: string
}

export default function ShareMenu({ isOpen, onClose, shareData, className = '' }: ShareMenuProps) {
  const [copySuccess, setCopySuccess] = useState(false)

  if (!isOpen) return null

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(shareData.url)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const shareToX = (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareData.text
    )}&url=${encodeURIComponent(shareData.url)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    onClose()
  }

  const shareToLinkedIn = (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareData.url
    )}`
    window.open(url, '_blank', 'noopener,noreferrer')
    onClose()
  }

  const shareViaSMS = (e: React.MouseEvent) => {
    e.stopPropagation()
    const message = `${shareData.text} ${shareData.url}`
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`
    window.location.href = smsUrl
    onClose()
  }

  const useNativeShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url,
        })
        onClose()
      } catch (err) {
        console.error('Error sharing:', err)
      }
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
      />

      {/* Share Menu */}
      <div
        className={`absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 ${className}`}
      >
        <button
          onClick={copyToClipboard}
          className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
        >
          {copySuccess ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span>{copySuccess ? 'Copied!' : 'Copy link'}</span>
        </button>

        <button
          onClick={shareToX}
          className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
        >
          <XIcon className="w-4 h-4" />
          <span>Share on X</span>
        </button>

        <button
          onClick={shareToLinkedIn}
          className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
        >
          <Linkedin className="w-4 h-4" />
          <span>Share on LinkedIn</span>
        </button>

        <button
          onClick={shareViaSMS}
          className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Share via SMS</span>
        </button>

        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={useNativeShare}
            className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm border-t border-gray-100 dark:border-gray-600 mt-1 pt-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            <span>More options</span>
          </button>
        )}
      </div>
    </>
  )
}
