'use client'

import React, { useState } from 'react'

interface LiveControlsProps {
  isHost: boolean
  stream: MediaStream | null
  onToggleDrawing: () => void
}

export default function LiveControls({ isHost, stream, onToggleDrawing }: LiveControlsProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

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

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        })
        
        // Replace video track with screen share
        if (stream) {
          const videoTrack = stream.getVideoTracks()[0]
          if (videoTrack) {
            stream.removeTrack(videoTrack)
          }
          stream.addTrack(screenStream.getVideoTracks()[0])
        }
        
        setIsScreenSharing(true)
      } else {
        // Stop screen sharing and revert to camera
        if (stream) {
          const screenTrack = stream.getVideoTracks()[0]
          if (screenTrack) {
            stream.removeTrack(screenTrack)
          }
          
          // Re-add camera video track
          const cameraStream = await navigator.mediaDevices.getUserMedia({
            video: true
          })
          stream.addTrack(cameraStream.getVideoTracks()[0])
        }
        
        setIsScreenSharing(false)
      }
    } catch (error) {
      console.error('Error toggling screen share:', error)
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Implement recording functionality
  }

  const raiseHand = () => {
    // Implement raise hand functionality
    console.log('Hand raised')
  }

  return (
    <div className="bg-gray-800 p-4">
      {/* Main Controls */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        {/* Mute/Unmute */}
        <button
          onClick={toggleMute}
          className={`p-3 rounded-full ${
            isMuted ? 'bg-red-600' : 'bg-gray-700'
          } text-white hover:opacity-80 transition`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>

        {/* Video On/Off */}
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full ${
            isVideoOff ? 'bg-red-600' : 'bg-gray-700'
          } text-white hover:opacity-80 transition`}
          title={isVideoOff ? 'Turn on video' : 'Turn off video'}
        >
          {isVideoOff ? '📷' : '📹'}
        </button>

        {/* Screen Share */}
        <button
          onClick={toggleScreenShare}
          className={`p-3 rounded-full ${
            isScreenSharing ? 'bg-blue-600' : 'bg-gray-700'
          } text-white hover:opacity-80 transition`}
          title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
        >
          {isScreenSharing ? '🖥️' : '💻'}
        </button>

        {/* Drawing Tool */}
        <button
          onClick={onToggleDrawing}
          className="p-3 rounded-full bg-gray-700 text-white hover:opacity-80 transition"
          title="Drawing tools"
        >
          ✏️
        </button>

        {/* Raise Hand */}
        <button
          onClick={raiseHand}
          className="p-3 rounded-full bg-gray-700 text-white hover:opacity-80 transition"
          title="Raise hand"
        >
          ✋
        </button>
      </div>

      {/* Host Controls */}
      {isHost && (
        <div className="border-t border-gray-700 pt-4">
          <div className="flex items-center justify-center space-x-4">
            {/* Recording */}
            <button
              onClick={toggleRecording}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                isRecording 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {isRecording ? '⏹️ Stop Recording' : '🔴 Start Recording'}
            </button>

            {/* Stream Settings */}
            <button className="px-4 py-2 rounded-lg bg-gray-700 text-white text-sm font-medium hover:bg-gray-600">
              ⚙️ Settings
            </button>
          </div>
        </div>
      )}

      {/* Status Indicators */}
      <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-400">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Live</span>
        </div>
        
        {isMuted && (
          <div className="flex items-center space-x-1">
            <span>🔇</span>
            <span>Muted</span>
          </div>
        )}
        
        {isVideoOff && (
          <div className="flex items-center space-x-1">
            <span>📷</span>
            <span>Video Off</span>
          </div>
        )}
        
        {isScreenSharing && (
          <div className="flex items-center space-x-1">
            <span>🖥️</span>
            <span>Screen Sharing</span>
          </div>
        )}
        
        {isRecording && (
          <div className="flex items-center space-x-1">
            <span>🔴</span>
            <span>Recording</span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button className="px-3 py-2 bg-gray-700 text-white text-xs rounded hover:bg-gray-600">
          📊 Share Chart
        </button>
        <button className="px-3 py-2 bg-gray-700 text-white text-xs rounded hover:bg-gray-600">
          📝 Notes
        </button>
        <button className="px-3 py-2 bg-gray-700 text-white text-xs rounded hover:bg-gray-600">
          📋 Poll
        </button>
        <button className="px-3 py-2 bg-gray-700 text-white text-xs rounded hover:bg-gray-600">
          🎯 Focus Mode
        </button>
      </div>
    </div>
  )
} 