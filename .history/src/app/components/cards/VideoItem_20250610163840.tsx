interface VideoItemProps {
  url: string
  mimeType: string
  title: string
}

export default function VideoItem({ url, mimeType, title }: VideoItemProps) {
  return (
    <video controls autoPlay loop>
      <source src={url} type={'video/mp4'} />
      Your browser does not support the video tag.
    </video>
  )
}
