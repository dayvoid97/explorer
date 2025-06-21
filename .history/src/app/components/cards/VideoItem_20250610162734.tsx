import { MediaRenderer } from '@/app/components/MediaRender'

export default function VideoItem({
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
