import { useTranslation } from 'react-i18next'
import TextBlock from './TextBlock'
import ListBlock from './ListBlock'
import CalloutBlock from './CalloutBlock'
import ImageBlock from './ImageBlock'
import VideoPlayer from './VideoPlayer'

function ContentRenderer({ blocks }) {
  const { i18n } = useTranslation()

  if (!blocks || blocks.length === 0) {
    return null
  }

  const renderBlock = (block, index) => {
    switch (block.type) {
      case 'text':
        return <TextBlock key={index} block={block} />

      case 'heading':
        const HeadingTag = `h${block.level || 2}`
        const headingText = i18n.language === 'zh' ? block.content : (block.contentEn || block.content)
        const headingClass = block.level === 2
          ? 'text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4'
          : 'text-xl md:text-2xl font-bold text-gray-900 mt-6 mb-3'
        return (
          <HeadingTag key={index} className={headingClass}>
            {headingText}
          </HeadingTag>
        )

      case 'image':
        return <ImageBlock key={index} block={block} />

      case 'video':
        return <VideoPlayer key={index} video={block} />

      case 'list':
        return <ListBlock key={index} block={block} />

      case 'callout':
        return <CalloutBlock key={index} block={block} />

      case 'attachment': {
        const attachLabel = i18n.language === 'zh' ? block.label : (block.labelEn || block.label)
        const attachDesc = i18n.language === 'zh' ? block.description : (block.descriptionEn || block.description)
        return (
          <div key={index} className="my-6">
            <a
              href={block.src}
              target="_blank"
              rel="noopener noreferrer"
              download={block.filename || true}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-primary/5 hover:border-primary transition-colors group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">{attachLabel}</p>
                {attachDesc && <p className="text-sm text-gray-500 mt-0.5">{attachDesc}</p>}
              </div>
              <div className="flex-shrink-0 text-gray-400 group-hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
            </a>
          </div>
        )
      }

      case 'videoLink': {
        const label = i18n.language === 'zh' ? block.label : (block.labelEn || block.label)
        return (
          <div key={index} className="my-8">
            <a
              href={block.href || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative rounded-lg overflow-hidden shadow-md group cursor-pointer"
              onClick={!block.href ? (e) => e.preventDefault() : undefined}
            >
              <img
                src={block.thumbnail}
                alt={label}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                <div className="bg-white/90 rounded-full p-4">
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </a>
            {label && (
              <p className="text-sm text-gray-600 text-center mt-3">{label}</p>
            )}
          </div>
        )
      }

      default:
        console.warn(`Unknown block type: ${block.type}`)
        return null
    }
  }

  return (
    <div className="prose prose-lg max-w-none">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  )
}

export default ContentRenderer
