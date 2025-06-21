export default function TextItem({
  content,
  paragraphs,
}: {
  content?: string
  paragraphs?: string[]
}) {
  if (Array.isArray(paragraphs) && paragraphs.length > 0) {
    return (
      <div className="space-y-3 text-base leading-relaxed text-gray-800 dark:text-gray-100">
        {paragraphs.map((para, i) => (
          <p key={i} className="whitespace-pre-line">
            {para}
          </p>
        ))}
      </div>
    )
  }

  return content ? (
    <p className="whitespace-pre-line text-base text-gray-800 dark:text-gray-100">{content}</p>
  ) : null
}
