import { getToken } from '../lib/auth'

export default function useUploader() {
  const uploadFile = async (
    file: File,
    cardId: string,
    type: string
  ): Promise<{ fileUrl: string; fileName: string }> => {
    const token = getToken()
    const mimeType = file.type
    const fileName = file.name

    const res = await fetch('/api/media/get-upload-url', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName, mimeType, cardId }),
    })

    if (!res.ok) throw new Error('❌ Failed to get signed upload URL')

    const { uploadUrl, fileUrl } = await res.json()

    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': mimeType },
      body: file,
    })

    if (!uploadRes.ok) {
      console.error('🚨 Failed upload:', await uploadRes.text())
      throw new Error('❌ Upload failed')
    }

    return { fileUrl, fileName }
  }

  return { uploadFile }
}
