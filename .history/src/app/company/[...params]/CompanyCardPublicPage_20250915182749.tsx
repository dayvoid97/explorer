// app/company/[...params]/CompanyCardPublicPage.tsx
'use client'

import { useParams } from 'next/navigation'
import { usePublicCard } from '@/app/hooks/usePublicCard'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import TextItem from '@/app/components/cards/TextItem'
import AudioItem from '@/app/components/cards/AudioItem'
import VideoItem from '@/app/components/cards/VideoItem'
import DocumentItem from '@/app/components/cards/DocumentItem'
import ImageItem from '@/app/components/cards/ImageItem'
import SaveCardButton from '@/app/components/SaveCardButton'
import Script from 'next/script'
import {
  updateCardMetadata,
  updateCanonicalUrl,
  generateCardDescription,
} from '../../lib/cardSeoUtil'

export default function CompanyCardPublicPage() {
  const router = useRouter()
  const { params } = useParams()

  // Extract ID from params array - params is always an array with catch-all routes
  // params[0] = cardId, params[1...] = slug parts
  const cardId = Array.isArray(params) ? params[0] : params

  // Use your existing hook
  const { data: card, loading } = usePublicCard(cardId as string)

  // Update client-side metadata (for dynamic changes, though server-side is primary)
  useEffect(() => {
    if (card && !loading) {
      // These are mainly for dynamic updates if content changes
      updateCardMetadata(card)
      updateCanonicalUrl(card)
    }
  }, [card, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    )
  }

  if (!card) {
    return (
      <div className="text-center pt-20 text-gray-500 dark:text-gray-400">
        Card not found or private
      </div>
    )
  }

  return (
    <>
      {/* Server-side metadata is already handled, but this provides additional structured data */}
      <Script
        id="card-structured-data"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: card.companyName,
            description: generateCardDescription(card),
            url: typeof window !== 'undefined' ? window.location.href : '',
            author: {
              '@type': 'Person',
              name: card.username,
            },
            dateCreated: card.createdAt,
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: card.items.length,
              itemListElement: card.items.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.title,
                description: item.description || item.content?.substring(0, 160),
              })),
            },
          }),
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-white dark:bg-gray-900 min-h-screen">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold break-words text-gray-900 dark:text-white">
            {card.companyName}
          </h1>
          <SaveCardButton cardId={card.cardId} />
          <p className="text-m ">
            {card.companyName} · Written by{' '}
            <button
              onClick={() => router.push(`/publicprofile/${card.username}`)}
              className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
            >
              @{card.username}
            </button>
          </p>
        </div>

        {/* Card metadata for SEO (hidden from users but visible to crawlers) */}
        <div className="sr-only" itemScope itemType="https://schema.org/Organization">
          <meta itemProp="name" content={card.companyName} />
          <meta itemProp="description" content={generateCardDescription(card)} />
          <meta itemProp="dateCreated" content={card.createdAt} />
          <div itemProp="author" itemScope itemType="https://schema.org/Person">
            <meta itemProp="name" content={card.username} />
          </div>
        </div>

        {card.cardId && (
          <div className="mt-4">
            {/* Optional: If usePublicCard can tell you if the current user has saved it,
                    you can pass initialSavedStatus={card.isSavedByCurrentUser} */}
          </div>
        )}

        <div className="space-y-6">
          {card.items.map((item, idx) => (
            <article
              key={idx}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 space-y-3"
              itemScope
              itemType="https://schema.org/CreativeWork"
            >
              <header>
                <h2
                  className="text-lg font-semibold text-gray-800 dark:text-gray-200"
                  itemProp="name"
                >
                  {item.title}
                </h2>

                {item.categories && (
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    <span itemProp="genre">Category: {item.categories}</span>
                  </p>
                )}
                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300" itemProp="description">
                    {item.description}
                  </p>
                )}
              </header>

              <div itemProp="text">
                <TextItem content={item.content} paragraphs={item.paragraphs} />
              </div>

              {item.externalLink && (
                <a
                  href={item.externalLink}
                  className="inline-block text-sm text-blue-600 hover:underline dark:text-blue-400 break-all"
                  target="_blank"
                  rel="noreferrer noopener"
                  itemProp="url"
                >
                  {item.externalLink}
                </a>
              )}

              {item.mimeType?.startsWith('image/') && (
                <div itemProp="image">
                  <ImageItem
                    url={item.signedUrl || ''}
                    mimeType={item.mimeType}
                    title={item.title}
                  />
                </div>
              )}

              <div className="fg-company-public-box mt-8">
                <ins
                  className="adsbygoogle"
                  style={{ display: 'block' }}
                  data-ad-client="ca-pub-8441965953327461"
                  data-ad-slot="1271920610"
                  data-ad-format="auto"
                  data-full-width-responsive="true"
                />

                <Script
                  async
                  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8441965953327461"
                  crossOrigin="anonymous"
                  strategy="afterInteractive"
                />

                <Script id="adsbygoogle-init-company" strategy="afterInteractive">
                  {`(adsbygoogle = window.adsbygoogle || []).push({});`}
                </Script>
              </div>

              {item.mimeType?.startsWith('video/') && (
                <div itemProp="video">
                  <VideoItem
                    url={item.signedUrl || ''}
                    mimeType={item.mimeType}
                    title={item.title}
                  />
                </div>
              )}

              {item.mimeType?.startsWith('audio/') && (
                <div itemProp="audio">
                  <AudioItem
                    url={item.signedUrl || ''}
                    title={item.title}
                    categories={item.categories}
                  />
                </div>
              )}

              {item.mimeType?.includes('pdf') || item.mimeType?.includes('document') ? (
                <DocumentItem url={item.signedUrl || ''} />
              ) : null}

              {item.uploadedAt && (
                <time
                  className="text-xs text-gray-400 dark:text-gray-500 pt-2 block"
                  dateTime={item.uploadedAt}
                  itemProp="dateCreated"
                >
                  Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}
                </time>
              )}
            </article>
          ))}
        </div>
      </div>
    </>
  )
}
