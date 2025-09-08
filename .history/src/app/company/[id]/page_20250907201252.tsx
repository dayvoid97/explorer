'use client'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { usePublicCard } from '@/app/hooks/usePublicCard' // This hook should fetch public card data
import { useRouter } from 'next/navigation'
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
  createCardSlug,
  generateCardTitle,
  generateCardDescription,
} from '../../lib/cardSeoUtil'

export default function CompanyCardPublicPage() {
  const router = useRouter()
  const { id } = useParams()
  const { data: card, loading } = usePublicCard(id as string)

  // Update SEO metadata when card data loads
  useEffect(() => {
    if (card && !loading) {
      updateCardMetadata(card)
      updateCanonicalUrl(card)

      // Optional: Update the URL slug without redirecting (for better SEO)
      const slug = createCardSlug(card.companyName, card.cardTicker)
      const newUrl = `/company/${card.cardId}/${slug}`

      // Only update if the current URL doesn't already have the slug
      if (!window.location.pathname.includes(slug)) {
        window.history.replaceState(null, '', newUrl)
      }
    }
  }, [card, loading])

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-lg text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    )
  if (!card)
    return (
      <div className="text-center pt-20 text-gray-500 dark:text-gray-400">
        Card not found or private
      </div>
    )

  return (
    <>
      {/* Add JSON-LD structured data */}
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
        {' '}
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
        {/* NEW: Place the SaveCardButton here, typically near the header */}
        {card.cardId && ( // Ensure card.cardId exists before rendering button
          <div className="mt-4">
            {/* Optional: If usePublicCard can tell you if the current user has saved it,
                  you can pass initialSavedStatus={card.isSavedByCurrentUser} */}
          </div>
        )}
        <div className="space-y-6">
          {card.items.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 space-y-3" // Added dark mode bg/border
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {item.title}
              </h3>

              {item.categories && (
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Category: {item.categories}
                </p>
              )}
              {item.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
              )}

              {/* Item components are assumed to handle their own dark mode */}
              <TextItem content={item.content} paragraphs={item.paragraphs} />

              {item.externalLink && (
                <a
                  href={item.externalLink}
                  className="inline-block text-sm text-blue-600 hover:underline dark:text-blue-400 break-all"
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.externalLink}
                </a>
              )}

              {/* Media components are assumed to handle their own dark mode */}
              {item.mimeType?.startsWith('image/') && (
                <ImageItem url={item.signedUrl || ''} mimeType={item.mimeType} title={item.title} />
              )}
              <div className="fg-company-public-box mt-8">
                <ins
                  className="adsbygoogle"
                  style={{ display: 'block' }}
                  data-ad-client="ca-pub-8441965953327461"
                  data-ad-slot="1271920610"
                  data-ad-format="auto"
                  data-full-width-responsive="true"
                ></ins>

                {/* Load the AdSense library */}
                <Script
                  async
                  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8441965953327461"
                  crossOrigin="anonymous"
                  strategy="afterInteractive"
                />

                {/* Initialize the ad */}
                <Script id="adsbygoogle-init-company" strategy="afterInteractive">
                  {`(adsbygoogle = window.adsbygoogle || []).push({});`}
                </Script>
              </div>
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
                <p className="text-xs text-gray-400 dark:text-gray-500 pt-2">
                  Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
