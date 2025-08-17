'use client'

import React, { useState, useEffect } from 'react'
import { Plus, X, Link2, Edit } from 'lucide-react' // Added Edit icon
import { useSocialLinksApi } from '@/app/hooks/useSocialLinksApi'

// Utility for conditionally joining class names
function cn(...inputs: (string | undefined | null | boolean)[]) {
  return inputs.filter(Boolean).join(' ')
}

// Button Component (provided by user) - Keeping its original styling logic as it's a separate component.
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

const variantClasses = {
  default:
    'bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200',
  outline:
    'border border-black text-black hover:bg-neutral-100 dark:border-white dark:text-white dark:hover:bg-white/10',
  ghost: 'text-black hover:bg-neutral-100 dark:text-white dark:hover:bg-white/10',
}

const sizeClasses = {
  default: 'px-4 py-2 text-sm',
  sm: 'px-3 py-1 text-xs',
  lg: 'px-5 py-3 text-base',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

// Platform configurations - Icons and colors adjusted for neutrality
const PLATFORMS = {
  linkedin: {
    name: 'LinkedIn',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    domain: 'linkedin.com',
    placeholder: 'https://linkedin.com/in/yourprofile',
    color: 'text-blue-600 dark:text-blue-400', // Still use brand color for icon
  },
  phone: {
    name: 'Phone',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 512 512" fill="currentColor">
        <path d="M391 351l-70-70c-9-9-23-9-32 0l-35 35c-40-20-72-52-92-92l35-35c9-9 9-23 0-32l-70-70c-9-9-23-9-32 0l-45 45c-9 9-12 22-7 33 37 86 107 156 193 193 11 5 24 2 33-7l45-45c9-9 9-23 0-32z" />
      </svg>
    ),
    domain: 'tel:',
    placeholder: '+1 (555) 123-4567',
    color: 'text-green-600 dark:text-green-400', // You can use a phone-related color
  },
  github: {
    name: 'GitHub',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    domain: 'github.com',
    placeholder: 'https://github.com/yourusername',
    color: 'text-gray-900 dark:text-gray-100',
  },
  twitter: {
    name: 'Twitter/X',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    domain: 'twitter.com',
    placeholder: 'https://twitter.com/yourusername',
    color: 'text-black dark:text-white',
  },
  youtube: {
    name: 'YouTube',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    domain: 'youtube.com',
    placeholder: 'https://youtube.com/@yourchannel',
    color: 'text-red-600 dark:text-red-400',
  },
  instagram: {
    name: 'Instagram',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    domain: 'instagram.com',
    placeholder: 'https://instagram.com/yourusername',
    color: 'text-pink-600 dark:text-pink-400',
  },
  quora: {
    name: 'Quora',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.738 18.701c-.831 0-1.512-.662-1.512-1.484 0-.823.681-1.485 1.512-1.485.832 0 1.513.662 1.513 1.485 0 .822-.681 1.484-1.513 1.484m5.908-6.748c-.773.462-1.677.745-2.674.745-2.871 0-5.197-2.325-5.197-5.195 0-2.869 2.326-5.194 5.197-5.194 2.87 0 5.195 2.325 5.195 5.194 0 .996-.283 1.927-.745 2.716l2.084 1.239c.487-.937.756-2.005.756-3.126C23.262 3.517 19.743 0 15.428 0c-4.315 0-7.834 3.517-7.834 7.832 0 1.12.269 2.189.756 3.126l2.084-1.239c-.462-.789-.745-1.72-.745-2.716 0-2.87 2.326-5.195 5.197-5.195 2.871 0 5.195 2.325 5.195 5.195 0 2.87-2.324 5.194-5.195 5.194-.997 0-1.901-.283-2.674-.745l-1.239 2.084c.937.487 2.005.756 3.126.756 4.315 0 7.834-3.517 7.834-7.832 0-1.121-.269-2.189-.756-3.126l-2.084 1.239z" />
      </svg>
    ),
    domain: 'quora.com',
    placeholder: 'https://quora.com/profile/yourname',
    color: 'text-red-700 dark:text-red-400',
  },
  reddit: {
    name: 'Reddit',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    ),
    domain: 'reddit.com',
    placeholder: 'https://reddit.com/user/yourusername',
    color: 'text-orange-600 dark:text-orange-400',
  },
  warpcast: {
    name: 'Warpcast',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.5 4L12 12.5L3.5 4L3.5 20L7.5 20L7.5 9.5L12 14L16.5 9.5L16.5 20L20.5 20L20.5 4Z" />
      </svg>
    ),
    domain: 'farcaster.xyz',
    placeholder: 'https://farcaster.xyz/kanchan',
    color: 'text-purple-600 dark:text-purple-400',
  },
  custom: {
    name: 'Custom Link',
    icon: <Link2 className="w-4 h-4" />,
    domain: '',
    placeholder: 'https://your-website.com',
    color: 'text-gray-600 dark:text-gray-400',
  },
}

// Frontend representation of a social link
interface SocialLink {
  social_id: string // e.g., 'linkedin', 'github'
  social_link: string // The URL
  social_identifier: string // Unique ID for the database record (generated once on frontend, persisted)
}

interface SocialLinksProfileProps {
  authFetch: (url: string, options?: RequestInit) => Promise<Response>
  apiBaseUrl: string
  // Initial links from profile, expected as { social_id: string; social_link: string; social_identifier: string; }[]
  initialLinks?: SocialLink[]
  onLinksUpdated?: () => void // Callback to notify parent (e.g., ProfilePage) to re-fetch profile
}

export default function SocialLinksProfile({
  authFetch,
  apiBaseUrl,
  initialLinks = [],
  onLinksUpdated,
}: SocialLinksProfileProps) {
  // Local state for managing links
  const [links, setLinks] = useState<SocialLink[]>(initialLinks)
  const [selectedPlatform, setSelectedPlatform] = useState('linkedin')
  const [url, setUrl] = useState('')
  const [inputError, setInputError] = useState('') // Error for input validation

  // Use the custom hook for API interactions
  const {
    addOrUpdateLink,
    deleteLink,
    isLoading,
    error: apiError,
    success: apiSuccess,
    clearMessages,
  } = useSocialLinksApi(authFetch, apiBaseUrl)

  // Update local links when initialLinks prop changes (e.g., after parent re-fetches profile)
  useEffect(() => {
    setLinks(initialLinks)
  }, [initialLinks])

  // Effect to clear messages after a delay
  useEffect(() => {
    if (inputError || apiError || apiSuccess) {
      const timeout = setTimeout(() => {
        setInputError('')
        clearMessages()
      }, 5000) // Clear messages after 5 seconds
      return () => clearTimeout(timeout)
    }
  }, [inputError, apiError, apiSuccess, clearMessages])

  // Effect to pre-fill URL if a link for the selected platform already exists
  useEffect(() => {
    const existingLink = links.find((link) => link.social_id === selectedPlatform)
    if (existingLink) {
      setUrl(existingLink.social_link)
    } else {
      setUrl('')
    }
    setInputError('') // Clear input error when platform changes
    clearMessages() // Clear API messages when platform changes
  }, [selectedPlatform, links, clearMessages])

  const validateUrl = (platform: string, inputUrl: string): boolean => {
    if (!inputUrl.trim()) return false

    try {
      const urlObj = new URL(inputUrl)
      if (platform === 'custom') {
        return true // Basic URL format check for custom links
      }

      const domain = PLATFORMS[platform as keyof typeof PLATFORMS].domain
      return urlObj.hostname.includes(domain)
    } catch {
      return false
    }
  }

  // Add phone validation
  const validatePhone = (input: string): boolean => {
    // Accepts +, numbers, spaces, dashes, parentheses, min 7 digits
    return /^\+?[0-9\-\s\(\)]{7,20}$/.test(input.trim())
  }

  const handleAddOrUpdateLink = async () => {
    setInputError('') // Clear previous input error

    if (selectedPlatform === 'phone') {
      if (!validatePhone(url)) {
        setInputError('Please enter a valid phone number (e.g., +1 555-123-4567)')
        return
      }
    } else {
      if (!validateUrl(selectedPlatform, url)) {
        const platformConfig = PLATFORMS[selectedPlatform as keyof typeof PLATFORMS]
        setInputError(
          selectedPlatform === 'custom'
            ? 'Please enter a valid URL (e.g., https://your-website.com)'
            : `URL must be from ${platformConfig.domain} (e.g., ${platformConfig.placeholder})`
        )
        return
      }
    }

    const trimmedUrl = url.trim()
    const existingLink = links.find((link) => link.social_id === selectedPlatform)

    let socialIdentifierToSend: string
    if (existingLink) {
      // If updating an existing link, use its existing social_identifier
      socialIdentifierToSend = existingLink.social_identifier
    } else {
      // If adding a new link, generate a new social_identifier
      socialIdentifierToSend = crypto.randomUUID()
    }

    // Call the API via the hook
    await addOrUpdateLink({
      social_id: selectedPlatform,
      social_link: trimmedUrl,
      social_identifier: socialIdentifierToSend,
    })

    // Update local state based on API success (or if API call fails, the error will be set by hook)
    // We re-fetch from parent after success to ensure data consistency with backend
    if (!apiError) {
      if (onLinksUpdated) {
        onLinksUpdated() // Notify parent to re-fetch profile
      }
      setUrl('') // Clear URL input after successful add/update
    }
  }

  const handleDeleteLink = async (socialIdentifierToDelete: string, platformName: string) => {
    setInputError('') // Clear input error
    clearMessages() // Clear API messages

    // Call the API via the hook
    await deleteLink(socialIdentifierToDelete)

    // Update local state based on API success (or if API call fails, the error will be set by hook)
    // We re-fetch from parent after success to ensure data consistency with backend
    if (!apiError) {
      if (onLinksUpdated) {
        onLinksUpdated() // Notify parent to re-fetch profile
      }
      // If the deleted link was the currently selected one, clear the URL input
      const deletedLinkWasSelected =
        links.find((link) => link.social_identifier === socialIdentifierToDelete)?.social_id ===
        selectedPlatform
      if (deletedLinkWasSelected) {
        setUrl('')
      }
    }
  }

  const getPlatformConfig = (platformKey: string) => {
    return PLATFORMS[platformKey as keyof typeof PLATFORMS] || PLATFORMS.custom
  }

  const currentLinkExists = links.some((link) => link.social_id === selectedPlatform)

  return (
    <div className="mx-auto p-0 sm:p-0 my-0 font-sans text-current ">
      {' '}
      {/* Adjusted padding, margin, and background */}
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        `}
      </style>
      <div className="space-y-4">
        {' '}
        {/* Reduced overall spacing */}
        {/* Header */}
        <div className="text-left mb-4">
          {' '}
          {/* Aligned left, reduced margin-bottom */}
          <h2 className="text-xl font-semibold text-current mb-1">Social Links</h2>{' '}
          {/* Smaller heading */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your social media profiles and custom links
          </p>
        </div>
        {/* Add/Update Link Form */}
        <div className="p-0 space-y-3">
          {' '}
          {/* Removed background, border, reduced padding and spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {' '}
            {/* Reduced gap */}
            <div>
              <label
                htmlFor="platform-select"
                className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1" // Smaller label
              >
                Platform
              </label>
              <select
                id="platform-select"
                value={selectedPlatform}
                onChange={(e) => {
                  setSelectedPlatform(e.target.value)
                }}
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-700 rounded-md
                         bg-transparent text-current
                         focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm" // Minimal styling
              >
                {Object.entries(PLATFORMS).map(([key, platform]) => (
                  <option key={key} value={key}>
                    {platform.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="url-input"
                className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1" // Smaller label
              >
                URL
              </label>
              <div className="flex gap-2">
                <input
                  type={selectedPlatform === 'phone' ? 'tel' : 'url'}
                  id="url-input"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value)
                    setInputError('') // Clear input error on change
                  }}
                  placeholder={getPlatformConfig(selectedPlatform).placeholder}
                  className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-700 rounded-md
                           bg-transparent text-current placeholder-gray-500
                           focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm" // Minimal styling
                />
                <Button
                  onClick={handleAddOrUpdateLink}
                  disabled={isLoading}
                  variant="default"
                  size="sm" // Smaller button
                  className="flex items-center gap-1 font-medium" // Reduced gap
                >
                  {isLoading ? (
                    'Saving...'
                  ) : currentLinkExists ? (
                    <>
                      <Edit className="w-3 h-3" /> Update
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3" /> Add
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          {(inputError || apiError || apiSuccess) && (
            <p
              className={cn(
                'text-xs mt-2 text-center', // Smaller text
                inputError ? 'text-red-600 dark:text-red-400' : '',
                apiError ? 'text-red-600 dark:text-red-400' : '',
                apiSuccess ? 'text-green-600 dark:text-green-400' : ''
              )}
            >
              {inputError || apiError || apiSuccess}
            </p>
          )}
        </div>
        {/* Links List */}
        {links.length > 0 && (
          <div className="space-y-2 mt-4">
            {' '}
            {/* Reduced spacing, added top margin */}
            {links.map((link) => {
              const config = getPlatformConfig(link.social_id)
              return (
                <div
                  key={link.social_identifier} // Use social_identifier for key
                  className="flex items-center gap-3 p-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0" // Minimal border, no background, smaller padding
                >
                  <div className={`${config.color} flex-shrink-0`}>{config.icon}</div>

                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-current text-sm">{config.name}: </span>
                    <a
                      href={
                        link.social_id === 'phone' ? `tel:${link.social_link}` : link.social_link
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm truncate block"
                    >
                      {link.social_link}
                    </a>
                  </div>

                  <Button
                    onClick={() => handleDeleteLink(link.social_identifier, link.social_id)}
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-md" // Smaller padding
                    aria-label={`Remove ${config.name} link`}
                    disabled={isLoading}
                  >
                    <X className="w-3 h-3" /> {/* Smaller icon */}
                  </Button>
                </div>
              )
            })}
          </div>
        )}
        {/* Empty State */}
        {links.length === 0 && (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-md mt-4">
            {' '}
            {/* Reduced padding, rounded-md */}
            <Link2 className="w-8 h-8 mx-auto mb-2 opacity-50" /> {/* Smaller icon */}
            <p className="text-sm">No links added yet. Add your first social link above!</p>
          </div>
        )}
      </div>
    </div>
  )
}
