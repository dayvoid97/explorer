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
      // afterInteractive rather than lazyOnload. lazyOnload waits for every
      // other resource on the page to finish, which on an article with a large
      // hero image can be seconds — and slots that come into view before the
      // library arrives just sit queued and empty.
      //
      // The individual slots are now viewport-gated, so the library loading a
      // little earlier does not cause a burst of unviewed requests; it just
      // means a slot fills promptly once the reader reaches it.
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  )
}
