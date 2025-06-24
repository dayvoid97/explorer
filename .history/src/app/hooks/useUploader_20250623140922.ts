// REMOVED: import { getToken } from '../lib/auth' - authFetch handles token internally
import { authFetch } from '../lib/api' // Make sure this path is correct
import type { TableRow } from '../components/TableBuilder' // Ensure this import is correct
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
  // REMOVED: const token = getToken();

  const payload = {
    cardId,
    item: {
      title,
      description,
      categories: tags, // Assuming backend uses 'categories' for tags
      externalLink,
      type: 'text',
      paragraphs: textContent
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean),
      mimeType: 'text/plain',
      isDraft: false,
    },
  }

  try {
    // CHANGED: Use authFetch for the authenticated call
    const res = await authFetch(`${API_URL}/gurkha/companycard/add-item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }, // authFetch adds Authorization header
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || errorData.error || 'Failed to upload text item')
    }
    return await res.json()
  } catch (error) {
    console.error('❌ uploadTextItem failed:', error)
    throw error // Re-throw to be caught by MediaUploader or other calling component
  }
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
  // REMOVED: const token = getToken();

  const payload = {
    cardId,
    item: {
      title,
      description,
      categories: tags, // Assuming backend uses 'categories' for tags
      externalLink,
      type: 'table',
      content: JSON.stringify(tableData),
      mimeType: 'application/json',
      isDraft: false,
    },
  }

  try {
    // CHANGED: Use authFetch for the authenticated call
    const res = await authFetch(`${API_URL}/gurkha/companycard/add-item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }, // authFetch adds Authorization header
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || errorData.error || '❌ Failed to upload table data')
    }
    return await res.json()
  } catch (error) {
    console.error('❌ uploadTableItem failed:', error)
    throw error // Re-throw to be caught by MediaUploader or other calling component
  }
}

// Upload media file to S3 and return metadata
export async function uploadMediaItem({
  file,
  cardId,
  type, // Ensure type is passed down and used
}: {
  file: File
  cardId: string
  type: 'image' | 'video' | 'document' | 'chart' | 'audio'
}): Promise<{ fileUrl: string; fileName: string; mimeType: string; fileSize: number }> {
  // Added fileSize to return type
  // REMOVED: const token = getToken();
  const mimeType = file.type
  const fileName = file.name
  const fileSize = file.size // Get file size

  try {
    // CHANGED: Use authFetch for getting signed URL
    const signedUrlRes = await authFetch(`${API_URL}/gurkha/utils/media/get-upload-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }, // authFetch adds Authorization header
      body: JSON.stringify({ fileName, mimeType, cardId }),
    })

    const signedUrlData = await signedUrlRes.json()
    if (!signedUrlRes.ok) {
      throw new Error(signedUrlData.message || signedUrlData.error || '❌ Failed to get signed URL')
    }

    const { uploadUrl, fileUrl } = signedUrlData as {
      uploadUrl: string
      fileUrl: string
    }

    // The actual S3 upload (PUT to pre-signed URL) does NOT use authFetch,
    // as it's a direct upload to S3, not your backend API.
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': mimeType,
        'x-amz-meta-card-id': cardId, // Custom metadata for S3
      },
      body: file,
    })

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text() // S3 errors might be XML/text
      throw new Error(`❌ Upload to S3 failed: ${uploadRes.status} - ${errorText}`)
    }

    return { fileUrl, fileName, mimeType, fileSize } // Return fileSize as well
  } catch (error) {
    console.error('❌ uploadMediaItem failed:', error)
    throw error // Re-throw to be caught by MediaUploader or other calling component
  }
}
