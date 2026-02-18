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
