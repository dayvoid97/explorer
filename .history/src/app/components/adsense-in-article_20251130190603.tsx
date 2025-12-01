'use client'

import { useEffect, useRef } from 'react'

export const AdSenseInArticle = () => {
  return (
    <div className="my-4 flex justify-center items-center">
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
