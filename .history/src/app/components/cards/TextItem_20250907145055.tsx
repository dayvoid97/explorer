interface TextItemProps {
  content?: string
  paragraphs?: string[]
}

export default function TextItem({ content, paragraphs }: TextItemProps) {
  const baseClasses = 'text-base text-gray-800 dark:text-gray-100 whitespace-pre-line'

  if (paragraphs?.length) {
    return (
      <div className="space-y-4">
        {paragraphs.map((para, idx) => (
          <p key={idx} className={baseClasses}>
            {para}
          </p>
        ))}
      </div>
    )
  }

  return content ? <p className={baseClasses}>{content}</p> : null
}
