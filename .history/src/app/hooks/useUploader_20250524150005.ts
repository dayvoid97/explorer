// utils/uploadHandlers.js

import { getToken } from '../lib/auth'

export const uploadTextItem = async ({
  cardId,
  title,
  description,
  tags,
  externalLink,
  textContent,
}) => {
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

  const res = await fetch('/api/gurkha/companycard/add-item', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) throw new Error('Failed to upload text item')
  return res.json()
}

export const uploadTableItem = async ({
  cardId,
  title,
  description,
  tags,
  externalLink,
  tableData,
}) => {
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

  const res = await fetch('/api/gurkha/companycard/add-item', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) throw new Error('Failed to upload table data')
  return res.json()
}

export const uploadMediaItem = async ({ file, cardId, type }) => {
  const token = getToken()
  const mimeType = file.type
  const fileName = file.name

  const signedUrlRes = await fetch('/api/media/get-upload-url', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileName, mimeType, cardId }),
  })

  if (!signedUrlRes.ok) throw new Error('Failed to get signed URL')

  const { uploadUrl, fileUrl } = await signedUrlRes.json()

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': mimeType },
    body: file,
  })

  if (!uploadRes.ok) throw new Error('Upload failed')

  return { fileUrl, fileName, mimeType }
}
