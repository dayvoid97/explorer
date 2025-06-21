export default function DocumentItem({ url, fileName }: { url: string; fileName?: string }) {
  return (
    <a
      href={url}
      className="inline-block text-sm text-blue-600 hover:underline break-all"
      target="_blank"
      rel="noreferrer"
    >
      📄 {fileName || 'View Document'}
    </a>
  )
}
