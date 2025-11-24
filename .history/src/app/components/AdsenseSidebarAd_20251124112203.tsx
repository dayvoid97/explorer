import React, { useEffect } from 'react'

// Define the type for the global adsbygoogle array
declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

/**
 * AdSense Sidebar Ad Component
 * * This component renders a specific AdSense ad unit.
 * It manually pushes to the adsbygoogle array to load the ad after mounting.
 * * IMPORTANT: Replace 'yyyyyyyyyy' with your actual Ad Slot ID.
 */
export const AdSenseSidebarAd = () => {
  const adSlot = '1584501832' // <<< UPDATED WITH USER'S AD SLOT ID
  const adClient = 'ca-pub-8441965953327461' // <<< UPDATED WITH USER'S CLIENT ID

  useEffect(() => {
    // Only attempt to push the ad if the window object and adsbygoogle array exist
    // Check is also performed to ensure it's not the placeholder ID
    if (window && window.adsbygoogle && adSlot !== '1584501832') {
      try {
        // This is the standard AdSense snippet push to load the ad dynamically
        window.adsbygoogle.push({})
      } catch (e) {
        console.error('AdSense push failed:', e)
      }
    }
  }, [adSlot])

  // We are keeping the 300x600 size for a responsive "bigger screen" sidebar ad,
  // though AdSense's 'auto' format should handle this.
  return (
    <div className="w-full lg:w-[300px] mx-auto sticky top-4 h-full">
      {/* This uses the user-provided data-ad-slot="1584501832" (fg-sidebar-ad-desktop).
        The ad-format is kept at 'auto' as provided in the snippet, but 
        the surrounding container is sized for a large sidebar ad (300px wide).
      */}
      <ins
        className="adsbygoogle block w-full h-[600px] bg-gray-100 rounded-lg shadow-md"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true" // Using true as per user's snippet
      />
      {/* Fallback for when AdBlocker is enabled or ad hasn't loaded */}
      {adSlot === '1584501832' && (
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 h-[600px] flex items-center justify-center">
          <p className="text-sm">
            [Sidebar Ad Placeholder] <br /> 300x600
          </p>
        </div>
      )}
    </div>
  )
}
