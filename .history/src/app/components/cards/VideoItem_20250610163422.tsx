interface VideoItemProps {
  url: string
  mimeType: string
  title: string
}

export default function VideoItem({ url, mimeType, title }: VideoItemProps) {
  return (
    <video controls autoPlay>
      <source src={url} type={mimeType} />
      Your browser does not support the video tag.
    </video>
  )
}
