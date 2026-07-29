'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Layers, Trophy, Calendar, User, MessageSquare } from 'lucide-react'
import { ExplorerItem } from '../hooks/useExplorersearch'

export default function ExplorerResultCard({ item }: { item: ExplorerItem }) {
  const router = useRouter()
  const isChrono = item.type === 'chronology'

  const route = isChrono ? `/chronoW/${item.id}` : `/winners/wincard/${item.id}`
  const creator = isChrono ? item.createdBy : item.username
  const snippet = isChrono ? item.description : item.paragraphs?.[0]

  return (
    <div
      onClick={() => router.push(route)}
      className="group w-full flex gap-4 p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
    >
      {/* Center: Content Column */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
              isChrono ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-800'
            }`}
          >
            {isChrono ? 'ChronoDub' : 'Win'}
          </span>
          <span className="text-[11px] text-zinc-500 font-bold ">@{creator}</span>
          <span className="text-[11px] text-zinc-600">•</span>
          <span className="text-[11px] text-zinc-600">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h4 className="text-l font-bold  group-hover:text-blue-400 transition-colors line-clamp-2">
          {isChrono ? item.name : item.title}
        </h4>

        <p className="text-sm  line-clamp-4 mt-1 font-medium leading-relaxed">{snippet}</p>

        {/* Footer Meta */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-bold">
            <MessageSquare size={12} />
            {isChrono ? `${item.winIds?.length || 0} More Items` : 'Explore Discussions'}
          </div>
          {isChrono &&
            item.categories?.slice(0, 2).map((cat) => (
              <span key={cat} className="text-[10px] text-zinc-600 font-bold">
                #{cat}
              </span>
            ))}
        </div>
      </div>

      {/* Right: Action Column */}
    </div>
  )
}
