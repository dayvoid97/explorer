// hooks/useUnauthenticatedPrompt.ts
import { useState, useCallback } from 'react'

interface UseUnauthenticatedPromptReturn {
  showPrompt: boolean
  interactionCount: number
  triggerPrompt: () => void
  dismissPrompt: () => void
  reset: () => void
}

export const useUnauthenticatedPrompt = (
  promptDuration: number = 6000
): UseUnauthenticatedPromptReturn => {
  const [showPrompt, setShowPrompt] = useState(false)
  const [interactionCount, setInteractionCount] = useState(0)

  const triggerPrompt = useCallback(() => {
    setInteractionCount((prev) => prev + 1)
    setShowPrompt(true)
    setTimeout(() => setShowPrompt(false), promptDuration)
  }, [promptDuration])

  const dismissPrompt = useCallback(() => {
    setShowPrompt(false)
  }, [])

  const reset = useCallback(() => {
    setShowPrompt(false)
    setInteractionCount(0)
  }, [])

  return {
    showPrompt,
    interactionCount,
    triggerPrompt,
    dismissPrompt,
    reset,
  }
}
