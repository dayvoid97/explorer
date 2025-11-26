'use client'
import React, { useEffect } from 'react'

// Define the type for the global adsbygoogle array
declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

/**
 * AdSense Sidebar Ad Component
 * * Renders a fixed-size 300x600 skyscraper ad.
 * * It manually pushes to the adsbygoogle array to load the ad after mounting.
 */
export const AdSenseSidebarAd = () => {
  const adSlot = '1584501832'
  const adClient = 'ca-pub-8441965953327461'

  useEffect(() => {
    // Only attempt to push the ad if the window object and adsbygoogle array exist
    if (window && window.adsbygoogle) {
      try {
        // This is the standard AdSense snippet push to load the ad dynamically
        window.adsbygoogle.push({})
      } catch (e) {
        console.error('AdSense push failed:', e)
      }
    }
  }, [adSlot])

  return (
    // The container is fixed to 300px wide and uses sticky positioning
    <div className="w-[300px] mx-auto sticky top-4">
      <ins
        className="adsbygoogle"
        style={{ , width: '300px', height: '600px' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
      />
    </div>
  )
}
