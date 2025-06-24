'use client'

import { useState } from 'react'
// IMPORT CHANGE: No longer need getToken directly here
// IMPORTANT: uploadTableItem, uploadMediaItem, uploadTextItem MUST be updated internally to use authFetch
import { uploadTableItem, uploadMediaItem, uploadTextItem } from '../hooks/useUploader'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Image as ImageIcon, Video, FileText, BarChart2, Upload, Volume2 } from 'lucide-react' // Renamed Image to ImageIcon to avoid conflict
import TableBuilder from './TableBuilder'
import DocumentUploader from './DocumentUploader'
import { TableRow } from './TableBuilder'
import MultiMediaUploader from './MultiMediaUploader'

// NEW IMPORTS: authFetch for API calls, and removeTokens for handling auth errors
import { authFetch } from '../lib/api'
import { removeTokens } from '../lib/auth'
import { useRouter } from 'next/navigation' // For redirection

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL // Renamed from API_BASE for consistency

export default function MediaUploader({ cardId }: { cardId: string }) {
  const router = useRouter() // Initialize useRouter
  const [file, setFile] = useState<File | null>(null)
  const [tableData, setTableData] = useState<TableRow[]>([])

  const [textContent, setTextContent] = useState('') // For plain text notes

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [externalLink, setExternalLink] = useState('')
  const [type, setType] = useState<
    'text' | 'table' | 'image' | 'video' | 'document' | 'chart' | 'audio' | ''
  >('')
  const [status, setStatus] = useState<string | null>(null) // For success/error messages
  const [open, setOpen] = useState(false) // For dropdown/modal open state

  // Helper for consistent auth redirection
  const handleAuthRedirect = (errMessage: string = 'Session expired. Please log in again.') => {
    setStatus(`🚨 ${errMessage}`) // Display error status
    removeTokens() // Clear both access and refresh tokens
    router.push('/login') // Redirect to login page
  }

  const resetForm = () => {
    setFile(null)
    setTitle('')
    setDescription('')
    setTags('')
    setExternalLink('')
    setType('')
    setTableData([]) // Reset table data as well
    setTextContent('') // Reset text content
    setStatus(null) // Clear status
    setOpen(false) // Close the form
  }

  const handleUpload = async () => {
    if (!title || !type) {
      setStatus('⚠️ Missing required fields (Title, Type).')
      return
    }

    // Basic validation for content type
    if (type === 'text' && !textContent.trim()) {
      setStatus('⚠️ Please enter some text content.')
      return
    }
    if (type === 'table' && tableData.length === 0) {
      setStatus('⚠️ Please create a table.')
      return
    }
    if (['image', 'video', 'document', 'chart', 'audio'].includes(type) && !file) {
      setStatus('⚠️ Please select a file for upload.')
      return
    }

    try {
      setStatus('🚀 Processing upload...')

      let finalPayload: any // To hold the item data for the add-item endpoint

      if (type === 'text') {
        // IMPORTANT: uploadTextItem should use authFetch internally
        await uploadTextItem({
          // Assuming this hook handles its own token validation now
          cardId,
          title,
          description,
          tags,
          externalLink,
          textContent,
        })
        finalPayload = {
          // Construct payload if not done in hook for add-item endpoint
          cardId,
          item: {
            title,
            description,
            categories: tags,
            externalLink,
            type,
            textContent,
            isDraft: false,
          },
        }
      } else if (type === 'table') {
        // IMPORTANT: uploadTableItem should use authFetch internally
        await uploadTableItem({
          // Assuming this hook handles its own token validation now
          cardId,
          title,
          description,
          tags,
          externalLink,
          tableData,
        })
        finalPayload = {
          // Construct payload if not done in hook for add-item endpoint
          cardId,
          item: {
            title,
            description,
            categories: tags,
            externalLink,
            type,
            tableData,
            isDraft: false,
          },
        }
      } else if (['image', 'video', 'document', 'chart', 'audio'].includes(type) && file) {
        // IMPORTANT: uploadMediaItem should use authFetch internally
        const { fileUrl, fileName, mimeType, fileSize } = await uploadMediaItem({
          // Assuming this hook handles its own token validation now
          file,
          cardId,
          type: type as 'image' | 'video' | 'document' | 'chart' | 'audio',
        })

        finalPayload = {
          cardId,
          item: {
            title,
            description,
            categories: tags, // Renamed from 'tags' to 'categories' to match backend typically
            externalLink,
            type,
            mimeType,
            isDraft: false,
            fileName,
            url: fileUrl,
            fileSize: fileSize || file.size, // Use reported fileSize or fallback to client-side
          },
        }
      } else {
        setStatus('⚠️ Invalid type or missing file.')
        return
      }

      // After specific item upload, use authFetch to add item details to the company card.
      // This is the direct API call that needs authFetch.
      const res = await authFetch(`${API_URL}/gurkha/companycard/add-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }, // authFetch adds Authorization header
        body: JSON.stringify(finalPayload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(
          errorData.message || errorData.error || 'Failed to save item details to card.'
        )
      }

      setStatus('✅ Uploaded successfully!')
      setTimeout(() => resetForm(), 2000) // Reset form after success
    } catch (err: any) {
      console.error('❌ Upload failed:', err)
      // Catch errors thrown by authFetch (e.g., when refresh fails or no token initially)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setStatus(`🚨 Upload failed: ${err.message}`)
      }
    }
  }

  const mediaOptions = [
    { label: 'Text Note', icon: <FileText size={16} />, value: 'text' },
    { label: 'Audio', icon: <Volume2 size={16} />, value: 'audio' },
    { label: 'Table', icon: <BarChart2 size={16} />, value: 'table' },
    { label: 'Image', icon: <ImageIcon size={16} />, value: 'image' }, // Use ImageIcon
    { label: 'Video', icon: <Video size={16} />, value: 'video' },
    { label: 'Document', icon: <FileText size={16} />, value: 'document' },
    { label: 'Chart', icon: <BarChart2 size={16} />, value: 'chart' },
  ]
  const getCurrentTypeLabel = () => {
    const option = mediaOptions.find((opt) => opt.value === type)
    return option ? option.label : type
  }

  const renderContentInput = () => {
    switch (type) {
      case 'text':
        return (
          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium dark:text-gray-200">
              Content
            </label>
            <textarea
              placeholder="Enter your text content here..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              rows={6}
              className="resize-vertical bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              {textContent.length} characters
            </p>
          </div>
        )

      case 'table':
        return (
          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium dark:text-gray-200">
              Table Data
            </label>
            <TableBuilder
              onTableChange={(data) => setTableData(data)}
              initialRows={2}
              initialCols={3}
            />
          </div>
        )

      case 'document':
      case 'image':
      case 'audio':
      case 'video':
      case 'chart':
        return (
          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium dark:text-gray-200">
              {getCurrentTypeLabel()} File
            </label>
            {/* These components (DocumentUploader, MultiMediaUploader) also need dark mode styles */}
            <MultiMediaUploader // Or DocumentUploader for document type
              acceptedTypes={
                type === 'document'
                  ? [
                      'application/pdf',
                      'application/msword',
                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                      'application/vnd.ms-excel',
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      'application/vnd.ms-powerpoint',
                      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                      'text/plain',
                      'text/csv',
                    ]
                  : type
              }
              maxSizeInMB={type === 'audio' ? 100 : type === 'video' ? 200 : 50} // Default 50MB for image/chart/document
              onFileSelect={(selectedFile) => {
                setFile(selectedFile)
                setStatus(null)
              }}
              onFileRemove={() => {
                setFile(null)
                setStatus(null)
              }}
              enablePreview={true}
              enableMetadataExtraction={true}
            />
            {type === 'chart' && (
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                Upload chart images or PDFs
              </p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="mt-8">
      <div className="mb-4">
        <button
          onClick={() => setOpen(!open)}
          // Dark mode styles for button
          className="bg-green-600 dark:bg-green-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800 px-4 py-2 rounded-full flex items-center gap-2 text-sm shadow-sm transition"
        >
          <Plus size={18} />
          Add Media
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
              // Dark mode styles for dropdown
              className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg w-72 p-2 space-y-1"
            >
              {mediaOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setType(opt.value as any)
                    setOpen(false)
                    setStatus(null)
                  }}
                  // Dark mode styles for dropdown items
                  className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm rounded-md"
                >
                  <span className="text-gray-700 dark:text-gray-300">{opt.icon}</span>
                  <div className="flex flex-col text-left">
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {opt.label}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                      {opt.value}
                    </span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Upload Form */}
      {type && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          // Dark mode styles for upload form container
          className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 mt-6 rounded-xl p-6 space-y-5 shadow-sm"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Upload size={20} />
              Upload {getCurrentTypeLabel()}
            </h3>
            <button
              onClick={() => setType('')}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title="Cancel"
            >
              <Plus size={16} className="rotate-45" />
            </button>
          </div>

          {/* Common Fields */}
          <div className="space-y-4">
            {/* Title - Required */}
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium dark:text-gray-200">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter a title for this item"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                // Dark mode styles for input
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium dark:text-gray-200">
                Description
              </label>
              <textarea
                placeholder="Optional description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                // Dark mode styles for textarea
                className="resize-vertical bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium dark:text-gray-200">Tags</label>
              <input
                type="text"
                placeholder="Enter tags separated by commas"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                // Dark mode styles for input
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                Separate multiple tags with commas (e.g., design, ui, mockup)
              </p>
            </div>

            {/* External Link */}
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium dark:text-gray-200">
                External Link
              </label>
              <input
                type="url"
                placeholder="https://... (optional)"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                // Dark mode styles for input
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Type-Specific Content */}
          {renderContentInput()}

          {/* Upload Button */}
          <div className="border-t pt-4 border-gray-200 dark:border-gray-700">
            <button
              onClick={handleUpload}
              disabled={
                !title ||
                (!textContent.trim() && type === 'text') ||
                (type === 'table' && tableData.length === 0) ||
                (['image', 'video', 'document', 'chart', 'audio'].includes(type) && !file) ||
                status?.includes('Processing') // Disable during processing
              }
              // Dark mode styles for upload button (primary colors)
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:text-gray-200 dark:bg-blue-700 dark:hover:bg-blue-800 dark:disabled:bg-gray-700 dark:disabled:text-gray-500 disabled:cursor-not-allowed w-full px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Upload size={16} />
              {status?.includes('Processing') ||
              status?.includes('Uploading') ||
              status?.includes('Saving')
                ? status
                : `Upload ${getCurrentTypeLabel()} to Card`}
            </button>
          </div>

          {/* Status Message */}
          {status && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              // Dark mode styles for status messages
              className={`text-sm p-3 rounded-lg ${
                status.includes('✅')
                  ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800'
                  : status.includes('⚠️') || status.includes('🚨')
                  ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800'
                  : 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
              }`}
            >
              {status}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  )
}
