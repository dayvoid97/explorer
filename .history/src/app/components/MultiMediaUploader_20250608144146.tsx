'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Upload,
  Image,
  Video,
  AlertTriangle,
  CheckCircle,
  X,
  Eye,
  ZoomIn,
  ZoomOut,
  Download,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Crop,
  FileImage,
  Film,
} from 'lucide-react'

interface MediaUploaderProps {
  onFileSelect?: (file: File, metadata?: MediaMetadata) => void
  onFileRemove?: () => void
  maxSizeInMB?: number
  acceptedTypes?: 'image' | 'video' | 'both'
  enablePreview?: boolean
  enableMetadataExtraction?: boolean
}

export interface MediaMetadata {
  width?: number
  height?: number
  duration?: number
  size: number
  type: string
  aspectRatio?: string
  bitrate?: number
  fps?: number
}

interface VideoPlayerState {
  isPlaying: boolean
  isMuted: boolean
  currentTime: number
  duration: number
  volume: number
}

export default function MultiMediaUploader({
  onFileSelect,
  onFileRemove,
  maxSizeInMB = 100,
  acceptedTypes = 'both',
  enablePreview = true,
  enableMetadataExtraction = true,
}: MediaUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewContent, setPreviewContent] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [metadata, setMetadata] = useState<MediaMetadata | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Video player state
  const [videoState, setVideoState] = useState<VideoPlayerState>({
    isPlaying: false,
    isMuted: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Supported formats
  const supportedFormats = {
    image: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/bmp',
      'image/tiff',
      'image/ico',
      'image/heic',
      'image/heif',
    ],
    video: [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/avi',
      'video/quicktime',
      'video/mov',
      'video/wmv',
      'video/flv',
      'video/mkv',
      'video/m4v',
      'video/3gp',
      'video/quicktime',
    ],
  }

  const getAllowedTypes = () => {
    switch (acceptedTypes) {
      case 'image':
        return supportedFormats.image
      case 'video':
        return supportedFormats.video
      case 'both':
      default:
        return [...supportedFormats.image, ...supportedFormats.video]
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (file: File): JSX.Element => {
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    if (isImage) {
      return (
        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
          <Image className="w-5 h-5 text-blue-600" />
        </div>
      )
    }

    if (isVideo) {
      return (
        <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
          <Video className="w-5 h-5 text-purple-600" />
        </div>
      )
    }

    return (
      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
        <FileImage className="w-5 h-5 text-gray-600" />
      </div>
    )
  }

  const extractMetadata = async (file: File): Promise<MediaMetadata> => {
    return new Promise((resolve) => {
      const metadata: MediaMetadata = {
        size: file.size,
        type: file.type,
      }

      if (file.type.startsWith('image/')) {
        const img = document.createElement('img')
        img.onload = () => {
          metadata.width = img.width
          metadata.height = img.height
          metadata.aspectRatio = `${img.width}:${img.height}`
          resolve(metadata)
          URL.revokeObjectURL(img.src)
        }
        img.onerror = () => resolve(metadata)
        img.src = URL.createObjectURL(file)
      } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video')
        video.onloadedmetadata = () => {
          metadata.width = video.videoWidth
          metadata.height = video.videoHeight
          metadata.duration = video.duration
          metadata.aspectRatio = `${video.videoWidth}:${video.videoHeight}`
          resolve(metadata)
          URL.revokeObjectURL(video.src)
        }
        video.onerror = () => resolve(metadata)
        video.src = URL.createObjectURL(file)
      } else {
        resolve(metadata)
      }
    })
  }

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeInMB}MB`
    }

    // Check file type
    const allowedTypes = getAllowedTypes()
    if (!allowedTypes.includes(file.type)) {
      return `File type not supported. Allowed: ${
        acceptedTypes === 'both' ? 'Images & Videos' : acceptedTypes
      }`
    }

    // Additional validation for specific formats
    if (file.type.startsWith('image/')) {
      // Check if image file is corrupted (basic check)
      if (file.size < 100) {
        return 'Image file appears to be corrupted or too small'
      }
    }

    if (file.type.startsWith('video/')) {
      // Basic video validation
      if (file.size < 1000) {
        return 'Video file appears to be corrupted or too small'
      }
    }

    return null
  }

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true)

    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      setIsProcessing(false)
      return
    }

    setError(null)
    setSelectedFile(file)

    // Extract metadata if enabled
    if (enableMetadataExtraction) {
      try {
        const extractedMetadata = await extractMetadata(file)
        setMetadata(extractedMetadata)
        onFileSelect?.(file, extractedMetadata)
      } catch (error) {
        console.error('Error extracting metadata:', error)
        onFileSelect?.(file)
      }
    } else {
      onFileSelect?.(file)
    }

    setIsProcessing(false)
  }

  const generatePreview = (file: File) => {
    const url = URL.createObjectURL(file)
    setPreviewContent(url)
    setMediaType(file.type.startsWith('image/') ? 'image' : 'video')
  }

  const handlePreview = () => {
    if (selectedFile && enablePreview) {
      generatePreview(selectedFile)
      setShowPreview(true)
    }
  }

  const closePreview = () => {
    setShowPreview(false)
    setZoomLevel(100)
    setVideoState({
      isPlaying: false,
      isMuted: false,
      currentTime: 0,
      duration: 0,
      volume: 1,
    })

    if (previewContent) {
      URL.revokeObjectURL(previewContent)
      setPreviewContent(null)
    }
    setMediaType(null)
  }

  // Video controls
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoState.isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setVideoState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoState.isMuted
      setVideoState((prev) => ({ ...prev, isMuted: !prev.isMuted }))
    }
  }

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setVideoState((prev) => ({
        ...prev,
        currentTime: videoRef.current!.currentTime,
        duration: videoRef.current!.duration || 0,
      }))
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setVideoState((prev) => ({ ...prev, currentTime: time }))
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
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
    setMetadata(null)
    closePreview()
    onFileRemove?.()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const downloadFile = () => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile)
      const a = document.createElement('a')
      a.href = url
      a.download = selectedFile.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const getAcceptAttribute = () => {
    return getAllowedTypes().join(',')
  }

  const getSupportedFormats = () => {
    switch (acceptedTypes) {
      case 'image':
        return 'Images (JPEG, PNG, GIF, WebP, SVG, etc.)'
      case 'video':
        return 'Videos (MP4, WebM, AVI, MOV, etc.)'
      case 'both':
      default:
        return 'Images & Videos'
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewContent) {
        URL.revokeObjectURL(previewContent)
      }
    }
  }, [previewContent])

  return (
    <div className="w-full space-y-4">
      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
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
            <div className="flex justify-center space-x-4">
              {acceptedTypes !== 'video' && (
                <Image className={`w-12 h-12 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
              )}
              {acceptedTypes !== 'image' && (
                <Video
                  className={`w-12 h-12 ${dragActive ? 'text-purple-500' : 'text-gray-400'}`}
                />
              )}
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                {dragActive ? 'Drop your media here' : 'Choose file or drag and drop'}
              </p>
              <p className="text-sm text-gray-500 mt-1">Supports: {getSupportedFormats()}</p>
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
              {isProcessing ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              ) : (
                <CheckCircle className="w-12 h-12 text-green-500" />
              )}
            </div>
            <p className="text-lg font-medium text-green-700">
              {isProcessing ? 'Processing...' : 'Media Selected Successfully'}
            </p>
          </div>
        )}
      </div>

      {/* Selected File Preview */}
      {selectedFile && !isProcessing && (
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFileIcon(selectedFile)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>
                    {formatFileSize(selectedFile.size)} •{' '}
                    {selectedFile.type.split('/')[1]?.toUpperCase()}
                  </p>
                  {metadata && (
                    <div className="text-xs text-gray-400">
                      {metadata.width && metadata.height && (
                        <span>
                          {metadata.width} × {metadata.height}px
                        </span>
                      )}
                      {metadata.duration && <span> • {formatTime(metadata.duration)}</span>}
                      {metadata.aspectRatio && <span> • {metadata.aspectRatio}</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {enablePreview && (
                <button
                  type="button"
                  onClick={handlePreview}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-full"
                  title="Preview media"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={downloadFile}
                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-100 rounded-full"
                title="Download file"
              >
                <Download className="w-4 h-4" />
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

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Uploading...</span>
            <span>Processing...</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Media Preview Modal */}
      {showPreview && previewContent && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl max-h-[95vh] w-full flex flex-col">
            {/* Preview Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-lg">
              <div className="flex items-center space-x-3">
                {selectedFile && getFileIcon(selectedFile)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {selectedFile?.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedFile && formatFileSize(selectedFile.size)}
                    {metadata?.width && metadata?.height && (
                      <span>
                        {' '}
                        • {metadata.width} × {metadata.height}px
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {mediaType === 'image' && (
                  <>
                    <button
                      onClick={() => setZoomLevel((prev) => Math.max(25, prev - 25))}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                      title="Zoom out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-600 min-w-[60px] text-center">
                      {zoomLevel}%
                    </span>
                    <button
                      onClick={() => setZoomLevel((prev) => Math.min(300, prev + 25))}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                      title="Zoom in"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </>
                )}

                <button
                  onClick={downloadFile}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-100 rounded"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={closePreview}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded"
                  title="Close preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-hidden bg-black flex items-center justify-center">
              {mediaType === 'image' && (
                <div className="flex items-center justify-center w-full h-full p-4">
                  <img
                    ref={imageRef}
                    src={previewContent}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain"
                    style={{ transform: `scale(${zoomLevel / 100})` }}
                  />
                </div>
              )}

              {mediaType === 'video' && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    ref={videoRef}
                    src={previewContent}
                    className="max-w-full max-h-full object-contain"
                    onTimeUpdate={handleVideoTimeUpdate}
                    onLoadedMetadata={handleVideoTimeUpdate}
                  />

                  {/* Video Controls */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 rounded-lg p-3 text-white">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={togglePlayPause}
                        className="p-2 hover:bg-white hover:bg-opacity-20 rounded"
                      >
                        {videoState.isPlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </button>

                      <div className="flex-1">
                        <input
                          type="range"
                          min="0"
                          max={videoState.duration || 0}
                          value={videoState.currentTime}
                          onChange={handleSeek}
                          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <span className="text-sm whitespace-nowrap">
                        {formatTime(videoState.currentTime)} / {formatTime(videoState.duration)}
                      </span>

                      <button
                        onClick={toggleMute}
                        className="p-2 hover:bg-white hover:bg-opacity-20 rounded"
                      >
                        {videoState.isMuted ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Supported Formats Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <p className="font-medium">Supported media formats:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-400">
          {acceptedTypes !== 'video' && (
            <div>
              <p className="font-medium text-gray-500">Images:</p>
              <ul className="space-y-1">
                <li>• JPEG, PNG, GIF, WebP</li>
                <li>• SVG, BMP, TIFF, ICO</li>
                <li>• HEIC, HEIF</li>
              </ul>
            </div>
          )}
          {acceptedTypes !== 'image' && (
            <div>
              <p className="font-medium text-gray-500">Videos:</p>
              <ul className="space-y-1">
                <li>• MP4, WebM, OGG</li>
                <li>• AVI, MOV, WMV</li>
                <li>• FLV, MKV, 3GP</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
