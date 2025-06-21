'use client'

import { useParams } from 'next/navigation'
import { usePublicCard } from '@/app/hooks/usePublicCard'
import { useRouter } from 'next/navigation'
import TextItem from '@/app/components/cards/TextItem'
import AudioItem from '@/app/components/cards/AudioItem'
import VideoItem from '@/app/components/cards/VideoItem'
import DocumentItem from '@/app/components/cards/DocumentItem'
import ImageItem from '@/app/components/cards/ImageItem'

export default function CompanyCardPublicPage() {
  const router = useRouter()
  const { id } = useParams()
  const { data: card, loading } = usePublicCard(id as string)

  if (loading)
    return <div className="min-h-screen flex justify-center items-center text-lg">Loading...</div>
  if (!card) return <div className="text-center pt-20 text-gray-500">Card not found or private</div>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold break-words">{card.companyName}</h1>
        <p className="text-sm text-gray-500">
          {card.companyName} ·{' '}
          <button
            onClick={() => router.push(`/publicprofile/${card.username}`)}
            className="text-blue-600 hover:underline"
          >
            @{card.username}
          </button>
        </p>
      </div>

      <div className="space-y-6">
        {card.items.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border shadow-sm bg-white dark:bg-zinc-900 space-y-3"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{item.title}</h3>

            {item.categories && (
              <p className="text-xs text-gray-400">Category: {item.categories}</p>
            )}
            {item.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
            )}

            <TextItem content={item.content} paragraphs={item.paragraphs} />

            {item.externalLink && (
              <a
                href={item.externalLink}
                className="inline-block text-sm text-blue-600 hover:underline break-all"
                target="_blank"
                rel="noreferrer"
              >
                {item.externalLink}
              </a>
            )}

            {item.mimeType?.startsWith('image/') && (
              <ImageItem url={item.signedUrl || ''} mimeType={item.mimeType} title={item.title} />
            )}

            {item.mimeType?.startsWith('video/') && (
              <VideoItem url={item.signedUrl || ''} mimeType={item.mimeType} title={item.title} />
            )}

            {item.mimeType?.startsWith('audio/') && (
              <AudioItem
                url={item.signedUrl || ''}
                title={item.title}
                categories={item.categories}
              />
            )}

            {item.mimeType?.includes('pdf') || item.mimeType?.includes('document') ? (
              <DocumentItem url={item.signedUrl || ''} />
            ) : null}

            {item.uploadedAt && (
              <p className="text-xs text-gray-400 pt-2">
                Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
