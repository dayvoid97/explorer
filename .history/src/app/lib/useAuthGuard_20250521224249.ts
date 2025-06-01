// lib/useAuthGuard.ts
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isLoggedIn } from './auth'

export default function useAuthGuard(redirectTo = '/login') {
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push(redirectTo)
    }
  }, [])
}
