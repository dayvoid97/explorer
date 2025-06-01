// components/MediaUploader.tsx
'use client'

import { useState } from 'react'
import useUploader from '@/app/hooks/useUploader'

export default function MediaUploader({ cardId }: { cardId: string }) {
  const { uploadFile } = useUploader()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('image') // default
  const [status, setStatus] = useState<string | null>(null)

  const handleUpload = async () => {
    if (!file) return setStatus('⚠️ Please select a file.')
    try {
      const fileUrl = await uploadFile(file, type)

      const token = getToken()
      const res = await fetch(`/api/gurkha/companycard/add-item`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId,
          item: {
            title,
            description,
            url: fileUrl,
            type,
            mimeType: file.type,
            isDraft: false,
          },
        }),
      })

      if (!res.ok) throw new Error('Failed to add item to card')
      setStatus('✅ Uploaded successfully!')
    } catch (err) {
      console.error(err)
      setStatus('❌ Upload failed.')
    }
  }

  return (
    <div className="mt-10 p-6 border rounded bg-white space-y-4 shadow">
      <h2 className="text-lg font-semibold">📤 Upload Media</h2>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full border px-2 py-1 rounded"
      >
        <option value="image">🖼️ Image</option>
        <option value="video">📹 Video</option>
        <option value="document">📄 Document</option>
        <option value="chart">📊 Chart</option>
      </select>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border px-2 py-1 rounded"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border px-2 py-1 rounded"
      />

      <input
        type="file"
        accept={type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : 'application/pdf'}
        onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
        className="w-full"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload to Card
      </button>

      {status && <p className="text-sm mt-2">{status}</p>}
    </div>
  )
}
