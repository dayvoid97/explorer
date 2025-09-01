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

      // Brand header
      ctx.fillStyle = textColor
      ctx.font = 'bold 32px Arial, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('FINANCIAL GURKHA', canvas.width / 2, 80)

      ctx.fillStyle = brandColor
      ctx.font = '24px Arial, sans-serif'
      ctx.fillText('Only Ws in the Chat', canvas.width / 2, 120)

      // Win title (wrapped)
      ctx.fillStyle = textColor
      ctx.font = 'bold 40px Arial, sans-serif'
      const wrappedTitle = wrapText(ctx, win.title, canvas.width - 100)
      let yPos = 250

      wrappedTitle.slice(0, 3).forEach((line) => {
        // Max 3 lines for title
        ctx.fillText(line, canvas.width / 2, yPos)
        yPos += 50
      })

      // Content preview
      if (win.paragraphs?.length > 0) {
        yPos += 40
        ctx.fillStyle = '#cccccc'
        ctx.font = '28px Arial, sans-serif'

        // Combine first 2-3 paragraphs for better content representation
        const paragraphsToShow = win.paragraphs.slice(0, 3)
        let combinedContent = paragraphsToShow.join(' ')

        // Limit total content length for readability
        if (combinedContent.length > 300) {
          combinedContent = combinedContent.substring(0, 300) + '...'
        }

        const wrappedContent = wrapText(ctx, combinedContent, canvas.width - 100)
        const maxContentLines = Math.min(6, wrappedContent.length) // Max 6 lines for content

        wrappedContent.slice(0, maxContentLines).forEach((line) => {
          ctx.fillText(line, canvas.width / 2, yPos)
          yPos += 35 // Slightly tighter line spacing for content
        })
      }

      // Author info
      ctx.fillStyle = brandColor
      ctx.font = 'bold 32px Arial, sans-serif'
      ctx.fillText(`Redub @${win.username}`, canvas.width / 2, canvas.height - 100)

      // Date
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
    } catch (error) {
      reject(error)
    }
  })
}
