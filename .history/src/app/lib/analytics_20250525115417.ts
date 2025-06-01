'use client'

import posthog from 'posthog-js'

export function trackEvent(name: string, properties: Record<string, any> = {}) {
  if (typeof window !== 'undefined') {
    posthog.capture(name, properties)
  }
}
