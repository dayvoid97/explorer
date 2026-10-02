// Shared MDX rendering for long-form articles (the blog and Spotlight Books).
// Kept in one place so every article section renders headings, anchors, links
// and tables identically, and the FAQ schema extraction behaves the same.
import SectionHeading from '@/app/components/article/SectionHeading'

// Pull the plain text out of arbitrary React children so headings can be
// slugified. MDX gives us nested elements (bold, links, code) inside headings.
export function nodeToText(node: any): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(nodeToText).join('')
  if (node?.props?.children) return nodeToText(node.props.children)
  return ''
}

// GitHub-flavoured slug rules: lowercase, drop punctuation, spaces -> hyphens.
// Consecutive hyphens are deliberately NOT collapsed — GitHub keeps them, so
// "Power & Energy" becomes "power--energy". Editors that auto-generate a table
// of contents (VS Code's Markdown All in One, remark-toc, etc.) follow the same
// rule, so matching it exactly means generated TOCs link correctly with no
// hand-written anchor tags.
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s/g, '-')
}

// Headings are built by a factory so the "back to contents" arrow can be
// switched on only when the article actually has a table of contents. Older
// posts have no TOC, and an arrow linking to a section that does not exist is
// worse than no arrow.
export function makeComponents(hasToc: boolean) {
  return {
    h1: ({ children, ...props }: any) => (
      <SectionHeading as="h1" id={slugify(nodeToText(children))} {...props}>
        {children}
      </SectionHeading>
    ),
    h2: ({ children, ...props }: any) => (
      <SectionHeading
        as="h2"
        id={slugify(nodeToText(children))}
        showContentsLink={hasToc}
        {...props}
      >
        {children}
      </SectionHeading>
    ),
    h3: ({ children, ...props }: any) => (
      <SectionHeading as="h3" id={slugify(nodeToText(children))} {...props}>
        {children}
      </SectionHeading>
    ),
    p: (props: any) => (
      <p
        className="mb-3"
        style={{
          fontFamily: 'Times New Roman',
          fontSize: 20,
          fontStyle: 'normal',
        }}
        {...props}
      />
    ),
    // Links: anchor jumps (#section) and internal routes (/blog/...) stay in this
    // tab — opening them in a new tab breaks in-page navigation and leaks readers
    // out of the session. Only genuinely external links open in a new tab.
    a: ({ href = '', ...props }: any) => {
      const isAnchor = href.startsWith('#')
      const isInternal =
        href.startsWith('/') || href.startsWith('./') || href.includes('financialgurkha.com')
      const isExternal = !isAnchor && !isInternal

      return (
        <a
          href={href}
          className="text-[#000] font-semibold underline decoration-1 underline-offset-4 hover:text-green-600 transition"
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          {...props}
        />
      )
    },
    ul: (props: any) => <ul className="list-disc  mb-4 space-y-2" {...props} />,
    ol: (props: any) => <ol className="list-decimal  mb-4 space-y-2" {...props} />,
    li: (props: any) => <li className="ml-2" {...props} />,
    blockquote: (props: any) => (
      <blockquote className="border-l-4 border-gray-800 pl-4 italic  my-4" {...props} />
    ),
    img: (props: any) => <img className="rounded-lg my-6 w-full" {...props} />,
    code: (props: any) => <code className=" px-2 py-1 rounded text-sm font-mono" {...props} />,
    pre: (props: any) => <pre className=" p-4 rounded-lg overflow-x-auto mb-4" {...props} />,
    table: (props: any) => (
      <table className="min-w-full border-collapse border border-gray-300 my-6" {...props} />
    ),
    thead: (props: any) => <thead {...props} />,
    tbody: (props: any) => <tbody {...props} />,
    tr: (props: any) => <tr className="border-b border-gray-300" {...props} />,
    th: (props: any) => (
      <th className="border border-gray-300 px-4 py-2 text-left font-bold" {...props} />
    ),
    td: (props: any) => <td className="border border-gray-300 px-4 py-2" {...props} />,
  }
}

// Posts are plain markdown, but MDXRemote parses them as MDX where `{...}`
// is a JS expression — unescaped braces crash the page at render time
// (e.g. "\text{ billion}" -> ReferenceError: billion is not defined).
// Escape braces everywhere except inside code fences / inline code.
export function sanitizeMarkdownForMdx(content: string) {
  const parts = content.split(/(```[\s\S]*?```|`[^`\n]*`)/g)
  return parts
    .map((part, i) => (i % 2 === 1 ? part : part.replace(/\{/g, '\\{').replace(/\}/g, '\\}')))
    .join('')
}

// Pull Q&A pairs out of the "Frequently Asked Questions" section so we can emit
// FAQPage structured data. Answer engines (Google AI Overviews, Perplexity,
// ChatGPT browsing) lean heavily on this schema when deciding what to quote,
// so it is the highest-leverage markup on an article page.
// Expected markdown shape:  **Question?**\nAnswer text.
export function extractFaqs(content: string): { question: string; answer: string }[] {
  const section = content.split(/^##\s+Frequently Asked Questions\s*$/m)[1]
  if (!section) return []

  // Stop at the next H2 so we don't swallow the closing sections.
  const body = section.split(/^##\s+/m)[0]
  const faqs: { question: string; answer: string }[] = []
  const re = /^\*\*(.+?\?)\*\*\s*\n([\s\S]*?)(?=\n\*\*|\n---|\s*$)/gm

  let match: RegExpExecArray | null
  while ((match = re.exec(body)) !== null) {
    const question = match[1].trim()
    const answer = match[2]
      .replace(/\*\*/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\s+/g, ' ')
      .trim()
    if (question && answer) faqs.push({ question, answer })
  }
  return faqs
}

export function toIsoDate(date: string): string {
  const parsed = new Date(date)
  return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString()
}
