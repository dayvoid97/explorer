// hooks/useUploader.ts
export default function useUploader() {
  const uploadFile = async (file: File, type: string) => {
    // Step 1: Get signed URL from backend
    // Step 2: Upload file to S3
    // Step 3: Return URL to save to Firestore

    const token = getToken()
    const res = await fetch('/api/media/get-upload-url', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename: file.name, type }),
    })

    const { uploadUrl, fileUrl } = await res.json()

    await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    })

    return fileUrl
  }

  return { uploadFile }
}
