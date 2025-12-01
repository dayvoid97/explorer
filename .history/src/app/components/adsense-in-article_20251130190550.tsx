'use client'

import { useEffect, useRef } from 'react'

export const AdSenseInArticle = () => {
  // We no longer need the useEffect or adRef since the final AdSense snippet
  // contains its own <script> tag to trigger the ad push.
  // The useEffect has been removed to prevent duplicate push calls.

  return (
    <div className="my-4 flex justify-center items-center">
      {/* This is the raw AdSense code block converted to JSX.
        The initial <script> tag for adsbygoogle.js is assumed to be in your 
        main <head> tag or a layout file, as it should only load once.
        The ad-specific <script> tag is added here as it's part of the unit.
      */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8441965953327461"
        data-ad-slot="3009403765"
        data-ad-format="auto" // Matches the new code
        data-full-width-responsive="true" // Matches the new code
      ></ins>
      <script
        dangerouslySetInnerHTML={{
          __html: `(adsbygoogle = window.adsbygoogle || []).push({});`,
        }}
      />
    </div>
  )
}
