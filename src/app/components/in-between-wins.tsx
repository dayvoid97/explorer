// @/app/components/ArticleAdUnit.tsx
'use client'

import React, { useEffect } from 'react'

interface ArticleAdUnitProps {
  slotId: string
}

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

const ArticleAdUnit: React.FC<ArticleAdUnitProps> = ({ slotId }) => {
  // useEffect hook ensures the AdSense initialization script runs client-side
  // after the component mounts and the <ins> tag is in the DOM.
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({})
      }
    } catch (e) {
      console.error('AdSense initialization failed:', e)
    }
  }, [slotId])

  return (
    <div className="w-full flex justify-center">
      {/* AdSense <ins> tag */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8441965953327461"
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

export default ArticleAdUnit
