export interface WinImageOptions {
  width?: number
  height?: number
  backgroundColor?: string
  textColor?: string
  brandColor?: string
}

export function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = words[0]

  for (let i = 1; i < words.length; i++) {
    const word = words[i]
    const width = ctx.measureText(currentLine + ' ' + word).width
    if (width < maxWidth) {
      currentLine += ' ' + word
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  }
  lines.push(currentLine)
  return lines
}

export async function generateWinImageBlob(win: any, options: WinImageOptions = {}): Promise<Blob> {
  const {
    width = 1080,
    height = 1080,
    backgroundColor = '#1a1a1a',
    textColor = '#ffffff',
    brandColor = '#fbbf24',
  } = options

  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('Could not get canvas context')
      }

      canvas.width = width
      canvas.height = height

      // Background
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Get win image if available
      const getWinImage = (winData: any): string | null => {
        if (winData.previewImageUrl) return winData.previewImageUrl
        if (winData.externalLink?.previewImage) return winData.externalLink.previewImage
        if (winData.mediaUrls?.length > 0) {
          for (let i = 0; i < winData.mediaUrls.length; i++) {
            const url = winData.mediaUrls[i]
            const mimeType = winData.mimeTypes?.[i]
            if (mimeType && mimeType.startsWith('image/')) return url
            if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return url
          }
        }
        return null
      }

      const winImageUrl = getWinImage(win)

      if (winImageUrl) {
        // Load and draw the win image
        const winImage = new Image()
        winImage.crossOrigin = 'anonymous' // Handle CORS

        winImage.onload = () => {
          try {
            // Brand header (reduced space since we have an image)
            ctx.fillStyle = textColor
            ctx.font = 'bold 28px Arial, sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText('FINANCIAL GURKHA', canvas.width / 2, 50)

            ctx.fillStyle = brandColor
            ctx.font = '20px Arial, sans-serif'
            ctx.fillText('Only Ws in the Chat', canvas.width / 2, 80)

            // Calculate image dimensions (maintain aspect ratio)
            const imageAreaWidth = canvas.width - 100 // 50px margin on each side
            const imageAreaHeight = 300 // Fixed height for image area
            const imageX = 50
            const imageY = 100

            // Calculate scaling to fit the area while maintaining aspect ratio
            const scaleX = imageAreaWidth / winImage.width
            const scaleY = imageAreaHeight / winImage.height
            const scale = Math.min(scaleX, scaleY)

            const scaledWidth = winImage.width * scale
            const scaledHeight = winImage.height * scale

            // Center the image in the allocated area
            const drawX = imageX + (imageAreaWidth - scaledWidth) / 2
            const drawY = imageY + (imageAreaHeight - scaledHeight) / 2

            // Draw rounded rectangle background for image
            const radius = 15
            ctx.fillStyle = '#333333'
            roundRect(ctx, drawX - 10, drawY - 10, scaledWidth + 20, scaledHeight + 20, radius)
            ctx.fill()

            // Draw the image
            ctx.save()
            roundRect(ctx, drawX, drawY, scaledWidth, scaledHeight, radius - 5)
            ctx.clip()
            ctx.drawImage(winImage, drawX, drawY, scaledWidth, scaledHeight)
            ctx.restore()

            // Win title (below image)
            let yPos = imageY + imageAreaHeight + 50
            ctx.fillStyle = textColor
            ctx.font = 'bold 36px Arial, sans-serif'
            const wrappedTitle = wrapText(ctx, win.title, canvas.width - 100)

            wrappedTitle.slice(0, 2).forEach((line) => {
              // Max 2 lines for title
              ctx.fillText(line, canvas.width / 2, yPos)
              yPos += 45
            })

            // Content preview (reduced space)
            if (win.paragraphs?.length > 0) {
              yPos += 20
              ctx.fillStyle = '#cccccc'
              ctx.font = '24px Arial, sans-serif' // Smaller font to fit more

              const paragraphsToShow = win.paragraphs.slice(0, 2) // Fewer paragraphs
              let combinedContent = paragraphsToShow.join(' ')

              if (combinedContent.length > 200) {
                // Shorter content
                combinedContent = combinedContent.substring(0, 200) + '...'
              }

              const wrappedContent = wrapText(ctx, combinedContent, canvas.width - 100)
              const maxContentLines = Math.min(4, wrappedContent.length) // Max 4 lines

              wrappedContent.slice(0, maxContentLines).forEach((line) => {
                ctx.fillText(line, canvas.width / 2, yPos)
                yPos += 30
              })
            }

            // Author and date
            ctx.fillStyle = brandColor
            ctx.font = 'bold 28px Arial, sans-serif'
            ctx.fillText(`Redub @${win.username}`, canvas.width / 2, canvas.height - 80)

            ctx.fillStyle = '#888888'
            ctx.font = '18px Arial, sans-serif'
            const date = new Date(win.createdAt).toLocaleDateString()
            ctx.fillText(date, canvas.width / 2, canvas.height - 50)

            // Convert to blob
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(blob)
                } else {
                  reject(new Error('Failed to generate image blob'))
                }
              },
              'image/png',
              0.9
            )
          } catch (error) {
            reject(error)
          }
        }

        winImage.onerror = () => {
          // If image fails to load, fall back to text-only version
          generateTextOnlyImage()
        }

        winImage.src = winImageUrl
      } else {
        // No image available, create text-only version
        generateTextOnlyImage()
      }

      function generateTextOnlyImage() {
        if (!ctx) return // This shouldn't happen since we already checked, but satisfies TypeScript

        // Brand header
        ctx.fillStyle = textColor
        ctx.font = 'bold 32px Arial, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('FINANCIAL GURKHA', canvas.width / 2, 80)

        ctx.fillStyle = brandColor
        ctx.font = '24px Arial, sans-serif'
        ctx.fillText('Only Ws in the Chat', canvas.width / 2, 120)

        // Win title
        let yPos = 250
        ctx.fillStyle = textColor
        ctx.font = 'bold 40px Arial, sans-serif'
        const wrappedTitle = wrapText(ctx, win.title, canvas.width - 100)

        wrappedTitle.slice(0, 3).forEach((line) => {
          ctx.fillText(line, canvas.width / 2, yPos)
          yPos += 50
        })

        // Content preview
        if (win.paragraphs?.length > 0) {
          yPos += 40
          ctx.fillStyle = '#cccccc'
          ctx.font = '28px Arial, sans-serif'

          const paragraphsToShow = win.paragraphs.slice(0, 3)
          let combinedContent = paragraphsToShow.join(' ')

          if (combinedContent.length > 300) {
            combinedContent = combinedContent.substring(0, 300) + '...'
          }

          const wrappedContent = wrapText(ctx, combinedContent, canvas.width - 100)
          const maxContentLines = Math.min(6, wrappedContent.length)

          wrappedContent.slice(0, maxContentLines).forEach((line) => {
            ctx.fillText(line, canvas.width / 2, yPos)
            yPos += 35
          })
        }

        // Author and date
        ctx.fillStyle = brandColor
        ctx.font = 'bold 32px Arial, sans-serif'
        ctx.fillText(`Redub @${win.username}`, canvas.width / 2, canvas.height - 100)

        ctx.fillStyle = '#888888'
        ctx.font = '20px Arial, sans-serif'
        const date = new Date(win.createdAt).toLocaleDateString()
        ctx.fillText(date, canvas.width / 2, canvas.height - 60)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to generate image blob'))
            }
          },
          'image/png',
          0.9
        )
      }
    } catch (error) {
      reject(error)
    }
  })
}

// Helper function to draw rounded rectangles
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}
