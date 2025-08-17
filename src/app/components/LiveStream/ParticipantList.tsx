'use client'

import React, { useState } from 'react'

interface Participant {
  id: string
  username: string
  isHost: boolean
  joinedAt: string
  isSpeaking: boolean
}

interface ParticipantListProps {
  participants: Participant[]
  isHost: boolean
  onClose: () => void
}

export default function ParticipantList({ participants, isHost, onClose }: ParticipantListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'joined' | 'speaking'>('name')

  const filteredParticipants = participants.filter(participant =>
    participant.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedParticipants = [...filteredParticipants].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.username.localeCompare(b.username)
      case 'joined':
        return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
      case 'speaking':
        if (a.isSpeaking && !b.isSpeaking) return -1
        if (!a.isSpeaking && b.isSpeaking) return 1
        return 0
      default:
        return 0
    }
  })

  const muteParticipant = (participantId: string) => {
    // Implement mute participant functionality
    console.log('Mute participant:', participantId)
  }

  const removeParticipant = (participantId: string) => {
    // Implement remove participant functionality
    console.log('Remove participant:', participantId)
  }

  const promoteToHost = (participantId: string) => {
    // Implement promote to host functionality
    console.log('Promote to host:', participantId)
  }

  const formatJoinTime = (joinedAt: string) => {
    const joinTime = new Date(joinedAt)
    const now = new Date()
    const diffMs = now.getTime() - joinTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just joined'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    return `${diffHours}h ago`
  }

  return (
    <div className="h-full bg-gray-800 border-l border-gray-700">
      {/* Header */}
      <div className="bg-gray-900 px-4 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Participants ({participants.length})</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="p-4 space-y-3">
        <input
          type="text"
          placeholder="Search participants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="name">Sort by Name</option>
          <option value="joined">Sort by Join Time</option>
          <option value="speaking">Sort by Speaking</option>
        </select>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto">
        {sortedParticipants.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No participants found</p>
          </div>
        ) : (
          <div className="space-y-1 p-4">
            {sortedParticipants.map((participant) => (
              <div
                key={participant.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  participant.isSpeaking ? 'bg-blue-900' : 'bg-gray-700'
                } hover:bg-gray-600 transition`}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {participant.username.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Participant Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium text-sm">
                        {participant.username}
                      </span>
                      {participant.isHost && (
                        <span className="bg-blue-600 text-white px-1 py-0.5 rounded text-xs">
                          HOST
                        </span>
                      )}
                      {participant.isSpeaking && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <div className="text-gray-400 text-xs">
                      Joined {formatJoinTime(participant.joinedAt)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {isHost && !participant.isHost && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => muteParticipant(participant.id)}
                      className="p-1 text-gray-400 hover:text-white text-xs"
                      title="Mute participant"
                    >
                      🔇
                    </button>
                    <button
                      onClick={() => promoteToHost(participant.id)}
                      className="p-1 text-gray-400 hover:text-white text-xs"
                      title="Promote to host"
                    >
                      👑
                    </button>
                    <button
                      onClick={() => removeParticipant(participant.id)}
                      className="p-1 text-red-400 hover:text-red-300 text-xs"
                      title="Remove participant"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-700 p-4">
        <div className="text-gray-400 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span>Total Participants:</span>
            <span className="text-white">{participants.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Speaking:</span>
            <span className="text-white">{participants.filter(p => p.isSpeaking).length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Hosts:</span>
            <span className="text-white">{participants.filter(p => p.isHost).length}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 