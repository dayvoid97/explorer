'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useRequireResetEmail() {
  const router = useRouter()

  useEffect(() => {
    const email = localStorage.getItem('reset_email')
    if (!email) {
      router.replace('/recover') // Redirect back to step 1
    }
  }, [router])
}
