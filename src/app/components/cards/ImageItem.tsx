import { MediaRenderer } from '@/app/components/MediaRender'

export default function ImageItem({
  url,
  mimeType,
  title,
}: {
  url: string
  mimeType: string
  title: string
}) {
  return <MediaRenderer signedUrl={url} mimeType={mimeType} title={title} />
}
