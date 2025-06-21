export default function AudioItem({ url }: { url: string }) {
  return (
    <audio controls className="w-full">
      <source src={url} />
      Your browser does not support the audio element.
    </audio>
  )
}
