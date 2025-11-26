import Script from 'next/script'

/**
 * Global AdSense Script Loader
 * * NOTE: This component should be placed once in your root layout (e.g., app/layout.tsx)
 * within the <head> or at the top of the <body> to ensure the script loads across all pages.
 * * IMPORTANT: Replace 'ca-pub-xxxxxxxxxxxxxxxx' with your actual AdSense Client ID.
 */
export const AdSenseScript = () => {
  const adClient = 'ca-pub-8441965953327461' // <<< UPDATED WITH USER'S CLIENT ID

  if (!adClient) {
    return null
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
      strategy="lazyOnload" // Loads after hydration, good for performance
      crossOrigin="anonymous"
    />
  )
}
