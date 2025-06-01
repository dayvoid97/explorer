'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, AlertTriangle, CheckCircle, X, Eye } from 'lucide-react'

interface DocumentUploaderProps {
  onFileSelect?: (file: File) => void
  onFileRemove?: () => void
  maxSizeInMB?: number
  acceptedTypes?: string[]
}

interface FilePreview {
  name: string
  size: string
  type: string
  icon: JSX.Element
}

export default function DocumentUploader({
  onFileSelect,
  onFileRemove,
  maxSizeInMB = 10,
  acceptedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
  ],
}: DocumentUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (mimeType: string): JSX.Element => {
    if (mimeType.includes('pdf')) {
      return (
        <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
          <FileText className="w-5 h-5 text-red-600" />
        </div>
      )
    }
    if (mimeType.includes('word') || mimeType.includes('document')) {
      return (
        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
      )
    }
    if (mimeType.includes('excel') || mimeType.includes('sheet')) {
      return (
        <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
          <FileText className="w-5 h-5 text-green-600" />
        </div>
      )
    }
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) {
      return (
        <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
          <FileText className="w-5 h-5 text-orange-600" />
        </div>
      )
    }
    return (
      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
        <FileText className="w-5 h-5 text-gray-600" />
      </div>
    )
  }

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeInMB}MB`
    }

    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return 'File type not supported'
    }

    return null
  }

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setSelectedFile(file)
    onFileSelect?.(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setError(null)
    onFileRemove?.()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const getAcceptAttribute = () => {
    return acceptedTypes.join(',')
  }

  const getSupportedFormats = () => {
    const formats = []
    if (acceptedTypes.includes('application/pdf')) formats.push('PDF')
    if (acceptedTypes.some((type) => type.includes('word') || type.includes('document')))
      formats.push('Word')
    if (acceptedTypes.some((type) => type.includes('excel') || type.includes('sheet')))
      formats.push('Excel')
    if (acceptedTypes.some((type) => type.includes('powerpoint') || type.includes('presentation')))
      formats.push('PowerPoint')
    if (acceptedTypes.includes('text/plain')) formats.push('Text')
    if (acceptedTypes.includes('text/csv')) formats.push('CSV')
    return formats
  }

  return (
    <div className="w-full space-y-4">
      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : error
            ? 'border-red-300 bg-red-50'
            : selectedFile
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!selectedFile ? openFileDialog : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={getAcceptAttribute()}
          onChange={handleInputChange}
        />

        {!selectedFile ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Upload className={`w-12 h-12 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                {dragActive ? 'Drop your document here' : 'Choose file or drag and drop'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Supports: {getSupportedFormats().join(', ')}
              </p>
              <p className="text-xs text-gray-400 mt-1">Maximum file size: {maxSizeInMB}MB</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={openFileDialog}
            >
              <Upload className="w-4 h-4 mr-2" />
              Browse Files
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <p className="text-lg font-medium text-green-700">File Selected Successfully</p>
          </div>
        )}
      </div>

      {/* Selected File Preview */}
      {selectedFile && (
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFileIcon(selectedFile.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedFile.size)} •{' '}
                  {selectedFile.type.split('/')[1]?.toUpperCase()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  // In a real app, you'd implement file preview
                  console.log('Preview file:', selectedFile.name)
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                title="Preview file"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={removeFile}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Upload Progress (if needed) */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Uploading...</span>
            <span>45%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: '45%' }}
            ></div>
          </div>
        </div>
      )}

      {/* Supported Formats Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <p className="font-medium">Supported document formats:</p>
        <ul className="grid grid-cols-2 gap-1 text-gray-400">
          <li>• PDF Documents</li>
          <li>• Word Documents (.doc, .docx)</li>
          <li>• Excel Spreadsheets (.xls, .xlsx)</li>
          <li>• PowerPoint Presentations (.ppt, .pptx)</li>
          <li>• Plain Text Files (.txt)</li>
          <li>• CSV Files (.csv)</li>
        </ul>
      </div>
    </div>
  )
}
