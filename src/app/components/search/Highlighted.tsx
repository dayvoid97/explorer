import { highlight } from '@/app/lib/search/engine'

/** Text with the query words in bold. */
export default function Highlighted({ text, words }: { text: string; words: string[] }) {
  return (
    <>
      {highlight(text, words).map((part, i) =>
        part.hit ? (
          <mark key={i} className="bg-transparent font-bold text-inherit">
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </>
  )
}
