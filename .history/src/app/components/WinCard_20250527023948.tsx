import React from 'react'

export default function WinCard({ win }: { win: any }) {
  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4 shadow-md space-y-3">
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <span>@{win.username}</span>
        <span>{new Date(win.createdAt).toLocaleDateString()}</span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{win.title}</h3>

      {win.paragraphs.slice(0, 2).map((p: string, i: number) => (
        <p key={i} className="text-sm text-gray-800 dark:text-gray-300">
          {p}
        </p>
      ))}

      {win.mediaUrls && win.mediaUrls.length > 0 && (
        <div className="flex space-x-2">
          {win.mediaUrls.slice(0, 2).map((url: string, i: number) => (
            <img
              key={i}
              src={url}
              alt={`win-media-${i}`}
              className="w-24 h-24 object-cover rounded-md"
            />
          ))}
        </div>
      )}

      <div className="text-sm text-blue-600 dark:text-blue-400">
        🎉 {win.upvotes ?? 0} Celebrations
      </div>
    </div>
  )
}
