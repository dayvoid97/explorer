import React from 'react'
import { useInstagramShare } from '../hooks/useInstagramShare'

interface InstagramShareButtonProps {
  win: any
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function InstagramShareButton({
  win,
  className = '',
  size = 'md',
  showText = true,
}: InstagramShareButtonProps) {
  const { generateAndDownload, isGenerating, error } = useInstagramShare()

  const handleShare = () => {
    generateAndDownload(win)
  }

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
  }

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  }

  return (
    <div>
      <button
        onClick={handleShare}
        disabled={isGenerating}
        className={`
          flex items-center gap-2 
          bg-gradient-to-r from-purple-500 to-pink-500 
          hover:from-purple-600 hover:to-pink-600
          text-white rounded-lg font-medium
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${sizeClasses[size]}
          ${className}
        `}
      >
        {/* Instagram Icon */}
        <svg width={iconSize[size]} height={iconSize[size]} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>

        {showText && <span>{isGenerating ? 'Generating...' : 'Share on Instagram'}</span>}
      </button>

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  )
}
