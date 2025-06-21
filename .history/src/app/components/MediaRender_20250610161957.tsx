import React from 'react'

interface MediaRendererProps {
  signedUrl: string
  mimeType?: string
  title: string
}

export const MediaRenderer: React.FC<MediaRendererProps> = ({ signedUrl, mimeType, title }) => {
  if (!signedUrl || !mimeType) return null

  if (mimeType.startsWith('image/')) {
    return (
      <img
        src={signedUrl}
        alt={title}
        className="w-full rounded-md border object-contain max-h-96"
        loading="lazy"
      />
    )
  }

  if (mimeType.startsWith('video/')) {
    return (
      <video preload="metadata" className="w-full rounded-md border max-h-[500px] object-contain">
        <source src={signedUrl} type={mimeType} />
        Your browser does not support the video tag.
      </video>
    )
  }

  // fallback for unsupported media types (e.g., downloadable files)
  return (
    <a
      href={signedUrl}
      download
      target="_blank"
      rel="noreferrer"
      className="text-sm text-blue-600 underline break-all"
    >
      Download file: {title}
    </a>
  )
}
