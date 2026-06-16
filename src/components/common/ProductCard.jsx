/* eslint-disable react/prop-types */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HiCheck, HiShoppingCart, HiX } from 'react-icons/hi'
import useCartStore from '../../store/cartStore'
import { getConfiguredPrice, getDefaultSelections } from '../../data/products'

function ProductCard({ product }) {
  const { i18n, t } = useTranslation()
  const zh = i18n.language === 'zh'
  const addItem = useCartStore((state) => state.addItem)
  const [isConfiguring, setIsConfiguring] = useState(false)
  const [selections, setSelections] = useState(() => getDefaultSelections(product))

  const name = zh ? product.name : product.nameEn
  const description = zh ? product.description : product.descriptionEn
  const price = getConfiguredPrice(product, selections)

  const handleAddToCart = () => {
    const selectedOptions = (product.options || []).map((option) => {
      const selected = option.values.find((value) => value.id === selections[option.id]) || option.values[0]
      return {
        optionId: option.id,
        optionName: option.name,
        optionNameEn: option.nameEn,
        valueId: selected.id,
        valueName: selected.name,
        valueNameEn: selected.nameEn,
      }
    })
    const selectionKey = selectedOptions.map((option) => `${option.optionId}:${option.valueId}`).join('|')

    addItem({
      ...product,
      price,
      selectedOptions,
      cartItemId: `${product.id}::${selectionKey || 'default'}`,
    })
    setIsConfiguring(false)
    useCartStore.setState({ isDrawerOpen: true })
  }

  return (
    <>
      <article className="bg-white border border-gray-200 overflow-hidden h-full flex flex-col card-hover">
        <button
          type="button"
          onClick={() => setIsConfiguring(true)}
          className="relative aspect-[4/3] bg-gray-100 overflow-hidden text-left"
          aria-label={name}
        >
          <img src={product.image} alt={name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
          {product.badge && (
            <span className="absolute top-3 left-3 bg-white/95 text-gray-900 px-2.5 py-1 text-xs font-medium shadow-sm">
              {zh ? product.badge : product.badgeEn}
            </span>
          )}
        </button>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-bold text-lg text-gray-900 leading-snug">{name}</h3>
            <span className="font-bold text-primary whitespace-nowrap">
              ¥{product.price} {zh ? '起' : 'from'}
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">{description}</p>

          <div className="mt-auto flex items-center justify-between gap-3">
            <span className="text-xs text-gray-500">
              {zh ? `库存 ${product.stock} 件` : `${product.stock} in stock`}
            </span>
            <button
              type="button"
              onClick={() => setIsConfiguring(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-opacity-90 transition-colors"
            >
              <HiShoppingCart size={17} />
              {zh ? '选择规格' : 'Configure'}
            </button>
          </div>
        </div>
      </article>

      {isConfiguring && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsConfiguring(false)}
            aria-label="Close"
          />
          <div className="relative bg-white w-full md:max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <button
              type="button"
              onClick={() => setIsConfiguring(false)}
              className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 flex items-center justify-center text-gray-600 hover:text-gray-900"
              aria-label="Close"
            >
              <HiX size={22} />
            </button>

            <div className="grid md:grid-cols-2">
              <div className="aspect-[4/3] md:aspect-auto bg-gray-100">
                <img src={product.image} alt={name} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 md:p-7">
                <p className="text-xs font-medium uppercase text-primary mb-2">
                  {zh ? '配置商品' : 'Configure product'}
                </p>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{name}</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">{description}</p>

                <div className="space-y-5">
                  {(product.options || []).map((option) => (
                    <fieldset key={option.id}>
                      <legend className="text-sm font-semibold text-gray-900 mb-2">
                        {zh ? option.name : option.nameEn}
                      </legend>
                      <div className="grid grid-cols-1 gap-2">
                        {option.values.map((value) => {
                          const selected = selections[option.id] === value.id
                          return (
                            <button
                              type="button"
                              key={value.id}
                              onClick={() => setSelections((current) => ({ ...current, [option.id]: value.id }))}
                              className={`min-h-11 px-3 py-2 border flex items-center justify-between text-left text-sm transition-colors ${
                                selected ? 'border-primary bg-soft-pink text-primary' : 'border-gray-200 hover:border-gray-400'
                              }`}
                            >
                              <span>{zh ? value.name : value.nameEn}</span>
                              <span className="flex items-center gap-2">
                                {value.priceDelta > 0 && <span>+¥{value.priceDelta}</span>}
                                {selected && <HiCheck />}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </fieldset>
                  ))}
                </div>

                <div className="mt-7 pt-5 border-t border-gray-200 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-500">{zh ? '当前配置' : 'Configured price'}</p>
                    <p className="text-2xl font-bold text-primary">¥{price}</p>
                  </div>
                  <button type="button" onClick={handleAddToCart} className="btn-primary flex items-center gap-2">
                    <HiShoppingCart size={18} />
                    {t('tools.addToCart')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductCard
