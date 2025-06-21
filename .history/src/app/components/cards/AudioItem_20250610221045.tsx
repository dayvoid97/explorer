'use client'

import { useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'

interface AudioItemProps {
  url: string
}

export default function AudioItem({ url }: AudioItemProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlayback = () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      audio.play()
      setIsPlaying(true)
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  return (
    <div className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-xl flex items-center gap-4 bg-white dark:bg-zinc-900">
      <button
        onClick={togglePlayback}
        className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg"
      >
        {isPlaying ? <Pause size={32} /> : <Play size={32} />}
      </button>

      <audio
        ref={audioRef}
        src={url}
        onEnded={() => setIsPlaying(false)}
        className="hidden" // Hide default controls
      />

      <div className="flex-1">
        <p className="text-base font-medium text-gray-800 dark:text-gray-100">Audio Preview</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Click play to listen</p>
      </div>
    </div>
  )
}
