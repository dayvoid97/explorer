'use client'

import React, { useEffect, useRef, useState } from 'react'

interface Participant {
  id: string
  username: string
  isHost: boolean
  joinedAt: string
  isSpeaking: boolean
}

interface LiveVideoProps {
  stream: MediaStream | null
  isHost: boolean
  participants: Participant[]
}

export default function LiveVideo({ stream, isHost, participants }: LiveVideoProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideosRef = useRef<{ [key: string]: HTMLVideoElement }>({})
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [speakingParticipants, setSpeakingParticipants] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (stream && localVideoRef.current) {
      localVideoRef.current.srcObject = stream
    }
  }, [stream])

  useEffect(() => {
    // Update speaking participants based on audio levels
    const speaking = new Set<string>()
    participants.forEach(participant => {
      if (participant.isSpeaking) {
        speaking.add(participant.id)
      }
    })
    setSpeakingParticipants(speaking)
  }, [participants])

  const toggleMute = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
      }
    }
  }

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoOff(!videoTrack.enabled)
      }
    }
  }

  const addRemoteVideo = (participantId: string, stream: MediaStream) => {
    const video = document.createElement('video')
    video.autoplay = true
    video.playsInline = true
    video.srcObject = stream
    video.className = 'w-full h-full object-cover rounded-lg'
    
    const container = document.getElementById(`remote-${participantId}`)
    if (container) {
      container.appendChild(video)
      remoteVideosRef.current[participantId] = video
    }
  }

  const removeRemoteVideo = (participantId: string) => {
    const video = remoteVideosRef.current[participantId]
    if (video) {
      video.remove()
      delete remoteVideosRef.current[participantId]
    }
  }

  return (
    <div className="flex-1 bg-black relative">
      {/* Main Video Grid */}
      <div className="h-full p-4">
        {isHost ? (
          // Host view - large local video with small participant videos
          <div className="h-full flex flex-col">
            {/* Main local video */}
            <div className="flex-1 relative mb-4">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-lg"
              />
              
              {/* Local video controls overlay */}
              <div className="absolute bottom-4 left-4 flex space-x-2">
                <button
                  onClick={toggleMute}
                  className={`p-2 rounded-full ${
                    isMuted ? 'bg-red-600' : 'bg-gray-800'
                  } text-white`}
                >
                  {isMuted ? '🔇' : '🔊'}
                </button>
                <button
                  onClick={toggleVideo}
                  className={`p-2 rounded-full ${
                    isVideoOff ? 'bg-red-600' : 'bg-gray-800'
                  } text-white`}
                >
                  {isVideoOff ? '📷' : '📹'}
                </button>
              </div>

              {/* Host indicator */}
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-2 py-1 rounded text-sm">
                HOST
              </div>
            </div>

            {/* Participant thumbnails */}
            {participants.length > 0 && (
              <div className="h-24 flex space-x-2 overflow-x-auto">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    id={`remote-${participant.id}`}
                    className={`flex-shrink-0 w-32 h-24 relative rounded-lg overflow-hidden ${
                      speakingParticipants.has(participant.id) ? 'ring-2 ring-green-500' : ''
                    }`}
                  >
                    {/* Remote video will be inserted here */}
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-white text-sm">{participant.username}</span>
                    </div>
                    
                    {/* Speaking indicator */}
                    {speakingParticipants.has(participant.id) && (
                      <div className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Participant view - grid of all videos
          <div className="h-full grid grid-cols-2 gap-4">
            {/* Local video */}
            <div className="relative">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-lg"
              />
              
              {/* Local video controls */}
              <div className="absolute bottom-2 left-2 flex space-x-1">
                <button
                  onClick={toggleMute}
                  className={`p-1 rounded-full text-xs ${
                    isMuted ? 'bg-red-600' : 'bg-gray-800'
                  } text-white`}
                >
                  {isMuted ? '🔇' : '🔊'}
                </button>
                <button
                  onClick={toggleVideo}
                  className={`p-1 rounded-full text-xs ${
                    isVideoOff ? 'bg-red-600' : 'bg-gray-800'
                  } text-white`}
                >
                  {isVideoOff ? '📷' : '📹'}
                </button>
              </div>
            </div>

            {/* Remote videos */}
            {participants.map((participant) => (
              <div
                key={participant.id}
                id={`remote-${participant.id}`}
                className={`relative ${
                  speakingParticipants.has(participant.id) ? 'ring-2 ring-green-500' : ''
                }`}
              >
                <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">{participant.username}</span>
                </div>
                
                {/* Speaking indicator */}
                {speakingParticipants.has(participant.id) && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                )}
                
                {/* Host indicator */}
                {participant.isHost && (
                  <div className="absolute top-1 left-1 bg-blue-600 text-white px-1 py-0.5 rounded text-xs">
                    HOST
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connection status */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
        {participants.length + 1} connected
      </div>
    </div>
  )
} 