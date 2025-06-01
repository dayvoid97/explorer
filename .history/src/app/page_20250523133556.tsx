'use client'
import ExplorerPage from './explorer/page'
import { PostHogProvider } from 'posthog-js/react'
import posthog from 'posthog-js'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

export default function Home() {
  const pathname = usePathname()
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (!POSTHOG_KEY) {
      console.warn('❌ PostHog key is not set')
      return
    }

    if (!hasInitialized.current) {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        person_profiles: 'identified_only',
        loaded: (ph) => {
          if (process.env.NODE_ENV === 'development') ph.debug()
        },
      })
      hasInitialized.current = true
    }

    posthog.capture('$pageview', { pathname })
  }, [pathname])

  return (
    <PostHogProvider client={posthog}>
      <main className="flex flex-col items-center justify-center min-h-screen text-center">
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Explore public equities by name, ticker, or region.
        </p>
        <ExplorerPage />
      </main>
    </PostHogProvider>
  )
}
