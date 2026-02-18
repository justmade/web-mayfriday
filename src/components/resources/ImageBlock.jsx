import { useTranslation } from 'react-i18next'

function ImageBlock({ block }) {
  const { i18n } = useTranslation()
  const alt = i18n.language === 'zh' ? block.alt : (block.altEn || block.alt)
  const caption = block.caption && (i18n.language === 'zh' ? block.caption : (block.captionEn || block.caption))

  return (
    <figure className="my-8">
      <div className="rounded-lg overflow-hidden shadow-md">
        <img
          src={block.src}
          alt={alt}
          className="w-full h-auto object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />
      </div>
      {caption && (
        <figcaption className="text-sm text-gray-600 text-center mt-3 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export default ImageBlock
