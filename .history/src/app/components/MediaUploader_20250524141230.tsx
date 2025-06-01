'use client'

import { useState } from 'react'
import useUploader from '../hooks/useUploader'
import { getToken } from '../lib/auth'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Image, Video, FileText, BarChart2, Upload } from 'lucide-react'
import TableBuilder from './TableBuilder'
import DocumentUploader from './DocumentUploader'
import { TableRow } from './TableBuilder'
import MultiMediaUploader, { MediaMetadata } from './MultiMediaUploader'
export default function MediaUploader({ cardId }: { cardId: string }) {
  const { uploadFile } = useUploader()
  const [file, setFile] = useState<File | null>(null)
  const [tableData, setTableData] = useState<TableRow[]>([])
  const [mediaMetadata, setMediaMetadata] = useState<MediaMetadata | null>(null)
  const [textContent, setTextContent] = useState('') // For plain text notes

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [externalLink, setExternalLink] = useState('')
  const [type, setType] = useState<
    'text' | 'table' | 'image' | 'video' | 'document' | 'chart' | ''
  >('')
  const [status, setStatus] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const resetForm = () => {
    setFile(null)
    setTitle('')
    setDescription('')
    setTags('')
    setExternalLink('')
    setType('')
    setTableData([]) // Reset table data as well
  }

  const handleUpload = async () => {
    if (!title || !type) return setStatus('⚠️ Missing required fields.')
    // Additional validation based on type
    if (type === 'text' && !textContent.trim()) {
      return setStatus('⚠️ Please enter some text content.')
    }
    if (type === 'table' && (!tableData || tableData.length === 0)) {
      return setStatus('⚠️ Please create a table.')
    }
    if (['image', 'video', 'document', 'chart'].includes(type) && !file) {
      return setStatus('⚠️ Please select a file.')
    }

    try {
      const token = getToken()
      let fileUrl = ''
      let fileName = ''
      let tableContent = ''

      setStatus('🚀 Processing upload...')

      if (['image', 'video', 'document', 'chart'].includes(type) && file) {
        setStatus('📤 Uploading file...')
        const result = await uploadFile(file, cardId, type)
        fileUrl = result.fileUrl
        fileName = result.fileName
      }
      // Handle different content types
      if (type === 'text') {
        content = textContent
      } else if (type === 'table') {
        content = JSON.stringify(tableData)
      }
      setStatus('💾 Saving to card...')

      // Handle table data
      if (type === 'table') {
        if (!tableData || tableData.length === 0) {
          return setStatus('⚠️ Please create a table.')
        }
        tableContent = JSON.stringify(tableData)
      }

      setStatus('💾 Saving to card...')

      const payload = {
        cardId,
        item: {
          title,
          description,
          categories: tags,
          externalLink,
          type,
          mimeType: file?.type || (type === 'table' ? 'application/json' : ''),
          isDraft: false,
          fileName,
          content,
          url: fileUrl,
          fileSize: file?.size || 0, // Add file size for documents
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

      if (!res.ok) throw new Error('Failed to save item to card')

      setStatus('✅ Uploaded successfully!')
      setTimeout(() => {
        resetForm()
      }, 2000)
    } catch (err) {
      console.error('❌ Upload failed:', err)
      setStatus('🚨 Upload failed')
    }
  }

  const mediaOptions = [
    { label: 'Text Note', icon: <FileText size={16} />, value: 'text' },
    { label: 'Table', icon: <BarChart2 size={16} />, value: 'table' },
    { label: 'Image', icon: <Image size={16} />, value: 'image' },
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
            <label className="text-foreground text-sm font-medium">Content</label>
            <textarea
              placeholder="Enter your text content here..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              rows={6}
              className="bg-background text-foreground resize-vertical w-full border px-3 py-2 rounded min-h-[120px]"
            />
            <p className="text-muted-foreground text-xs">{textContent.length} characters</p>
          </div>
        )

      case 'table':
        return (
          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">Table Data</label>
            <TableBuilder
              onTableChange={(data) => setTableData(data)}
              initialRows={2}
              initialCols={3}
            />
          </div>
        )

      case 'document':
        return (
          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">Document File</label>
            <DocumentUploader
              onFileSelect={(selectedFile) => {
                setFile(selectedFile)
                setStatus(null)
              }}
              onFileRemove={() => {
                setFile(null)
                setStatus(null)
              }}
              maxSizeInMB={25}
              acceptedTypes={[
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'text/plain',
                'text/csv',
              ]}
            />
          </div>
        )

      case 'image':
        return (
          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">Image File</label>
            <MultiMediaUploader
              acceptedTypes="image"
              maxSizeInMB={50}
              onFileSelect={(selectedFile, metadata) => {
                setFile(selectedFile)
                setMediaMetadata(metadata || null)
                setStatus(null)
              }}
              onFileRemove={() => {
                setFile(null)
                setMediaMetadata(null)
                setStatus(null)
              }}
              enablePreview={true}
              enableMetadataExtraction={true}
            />
          </div>
        )

      case 'video':
        return (
          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">Video File</label>
            <MultiMediaUploader
              acceptedTypes="video"
              maxSizeInMB={200}
              onFileSelect={(selectedFile, metadata) => {
                setFile(selectedFile)
                setMediaMetadata(metadata || null)
                setStatus(null)
              }}
              onFileRemove={() => {
                setFile(null)
                setMediaMetadata(null)
                setStatus(null)
              }}
              enablePreview={true}
              enableMetadataExtraction={true}
            />
          </div>
        )

      case 'chart':
        return (
          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">Chart File</label>
            <MultiMediaUploader
              acceptedTypes="both"
              maxSizeInMB={25}
              onFileSelect={(selectedFile, metadata) => {
                setFile(selectedFile)
                setMediaMetadata(metadata || null)
                setStatus(null)
              }}
              onFileRemove={() => {
                setFile(null)
                setMediaMetadata(null)
                setStatus(null)
              }}
              enablePreview={true}
              enableMetadataExtraction={true}
            />
            <p className="text-muted-foreground text-xs">Upload chart images or PDFs</p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="mt-8">
      {/* Media Type Selector */}
      <div className="relative inline-block">
        <button
          onClick={() => setOpen(!open)}
          className="bg-muted hover:bg-muted/70 border-border text-foreground flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-colors"
        >
          <Plus size={18} />
          Add Media
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="bg-background border-border text-foreground absolute mt-2 z-10 w-64 border rounded-xl shadow-lg p-2 space-y-1"
            >
              {mediaOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setType(opt.value as any)
                    setOpen(false)
                    setStatus(null) // Clear any previous status
                  }}
                  className="hover:bg-muted w-full flex items-start gap-3 px-3 py-2 text-sm rounded-lg text-left transition-colors"
                >
                  <div className="mt-0.5">{opt.icon}</div>
                  <div>
                    <div className="font-medium">{opt.label}</div>
                    <div className="text-muted-foreground text-xs">{opt.icon}</div>
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
          className="border-border bg-card text-foreground mt-6 border rounded-xl p-6 space-y-5 shadow-sm"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Upload size={20} />
              Upload {getCurrentTypeLabel()}
            </h3>
            <button
              onClick={() => setType('')}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Cancel"
            >
              <Plus size={16} className="rotate-45" />
            </button>
          </div>

          {/* Common Fields */}
          <div className="space-y-4">
            {/* Title - Required */}
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter a title for this item"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-background text-foreground w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">Description</label>
              <textarea
                placeholder="Optional description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="bg-background text-foreground resize-vertical w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">Tags</label>
              <input
                type="text"
                placeholder="Enter tags separated by commas"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="bg-background text-foreground w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
              <p className="text-muted-foreground text-xs">
                Separate multiple tags with commas (e.g., design, ui, mockup)
              </p>
            </div>

            {/* External Link */}
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">External Link</label>
              <input
                type="url"
                placeholder="https://... (optional)"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                className="bg-background text-foreground w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Type-Specific Content */}
          {renderContentInput()}

          {/* Upload Button */}
          <div className="border-border pt-4 border-t">
            <button
              onClick={handleUpload}
              disabled={
                !title ||
                (!textContent.trim() && type === 'text') ||
                (type === 'table' && tableData.length === 0) ||
                (['image', 'video', 'document', 'chart'].includes(type) && !file)
              }
              className="bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground disabled:cursor-not-allowed w-full px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
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
              className={`text-sm p-3 rounded-lg ${
                status.includes('✅')
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : status.includes('⚠️') || status.includes('🚨')
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
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
