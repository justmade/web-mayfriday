import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HiX, HiChevronLeft, HiChevronRight } from 'react-icons/hi'

function ImageGallery({ items }) {
  const { i18n } = useTranslation()
  const [selectedIndex, setSelectedIndex] = useState(null)

  const openLightbox = (index) => {
    setSelectedIndex(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedIndex(null)
    document.body.style.overflow = 'unset'
  }

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => {
          const title = i18n.language === 'zh' ? item.title : item.titleEn
          const description = i18n.language === 'zh' ? item.description : item.descriptionEn

          return (
            <div
              key={item.id}
              className="group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
              onClick={() => openLightbox(index)}
            >
              <div className="aspect-square bg-gray-200 overflow-hidden">
                {item.image && (
                  <img
                    src={item.image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                )}
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Close"
          >
            <HiX size={32} />
          </button>

          {/* Previous button */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Previous"
          >
            <HiChevronLeft size={48} />
          </button>

          {/* Next button */}
          <button
            onClick={goToNext}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Next"
          >
            <HiChevronRight size={48} />
          </button>

          {/* Image */}
          <div className="max-w-5xl max-h-[90vh] p-8">
            <img
              src={items[selectedIndex].image}
              alt={
                i18n.language === 'zh'
                  ? items[selectedIndex].title
                  : items[selectedIndex].titleEn
              }
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg'
              }}
            />
            <div className="text-center mt-4 text-white">
              <h3 className="text-xl font-bold mb-2">
                {i18n.language === 'zh'
                  ? items[selectedIndex].title
                  : items[selectedIndex].titleEn}
              </h3>
              <p className="text-gray-300">
                {i18n.language === 'zh'
                  ? items[selectedIndex].description
                  : items[selectedIndex].descriptionEn}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ImageGallery
