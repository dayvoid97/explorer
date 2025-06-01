'use client'
import ExplorerPage from './explorer/page'
import { PostHogProvider } from 'posthog-js/react'
import posthog from 'posthog-js'
import { useEffect } from 'react'
import { Router } from 'next/router'

export default function Home() {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
      // Enable debug mode in development
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug()
      },
    })

    const handleRouteChange = () => posthog?.capture('$pageview')

    Router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center">
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
        Explore public equities by name, ticker, or region.
      </p>
      <ExplorerPage />
    </main>
  )
}
