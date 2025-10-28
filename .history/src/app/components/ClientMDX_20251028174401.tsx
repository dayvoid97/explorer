'use client'

import { useEffect, useState } from 'react'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'
import { AdSenseAd } from './adsense-ad'

interface ClientMDXProps {
  source: string
  components?: MDXRemoteProps['components']
}

export function ClientMDX({ source, components = {} }: ClientMDXProps) {
  const [content, setContent] = useState(source)

  useEffect(() => {
    const injectAds = (text: string) => {
      const paragraphs = text.split('\n\n')
      if (paragraphs.length > 5) {
        // Insert one ad after 2nd paragraph
        paragraphs.splice(2, 0, '<AdSenseAd />')
      }
      return paragraphs.join('\n\n')
    }
    setContent(injectAds(source))
  }, [source])

  return <MDXRemote source={content} components={{ ...components, AdSenseAd }} />
}
