// utils/uploadHandlers.ts

import { getToken } from '../lib/auth'
import type { TableRow } from '../components/TableBuilder'
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface UploadCommonFields {
  cardId: string
  title: string
  description?: string
  tags?: string
  externalLink?: string
}

interface UploadResponse {
  success: boolean
  message?: string
  [key: string]: any
}

// Upload text content to Firestore
export async function uploadTextItem({
  cardId,
  title,
  description,
  tags,
  externalLink,
  textContent,
}: UploadCommonFields & { textContent: string }): Promise<UploadResponse> {
  const token = getToken()

  const payload = {
    cardId,
    item: {
      title,
      description,
      categories: tags,
      externalLink,
      type: 'text',
      content: textContent,
      mimeType: 'text/plain',
      isDraft: false,
    },
  }

  const res = await fetch(`${API_URL}/gurkha/companycard/add-item`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) throw new Error('❌ Failed to upload text item')
  return await res.json()
}

// Upload table data to Firestore
export async function uploadTableItem({
  cardId,
  title,
  description,
  tags,
  externalLink,
  tableData,
}: UploadCommonFields & { tableData: TableRow[] }): Promise<UploadResponse> {
  const token = getToken()

  const payload = {
    cardId,
    item: {
      title,
      description,
      categories: tags,
      externalLink,
      type: 'table',
      content: JSON.stringify(tableData),
      mimeType: 'application/json',
      isDraft: false,
    },
  }

  const res = await fetch(`${API_URL}/gurkha/companycard/add-item`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) throw new Error('❌ Failed to upload table data')
  return await res.json()
}

// Upload media file to S3 and return metadata
export async function uploadMediaItem({
  file,
  cardId,
  type,
}: {
  file: File
  cardId: string
  type: 'image' | 'video' | 'document' | 'chart'
}): Promise<{ fileUrl: string; fileName: string; mimeType: string }> {
  const token = getToken()
  const mimeType = file.type
  const fileName = file.name

  const signedUrlRes = await fetch(`${API_URL}/media/get-upload-url`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileName, mimeType, cardId }),
  })

  if (!signedUrlRes.ok) throw new Error('❌ Failed to get signed URL')

  const { uploadUrl, fileUrl } = (await signedUrlRes.json()) as {
    uploadUrl: string
    fileUrl: string
  }

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': mimeType },
    body: file,
  })

  if (!uploadRes.ok) throw new Error('❌ Upload to S3 failed')

  return { fileUrl, fileName, mimeType }
}
