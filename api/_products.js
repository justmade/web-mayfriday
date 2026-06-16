import { categories, products as defaultProducts } from '../shared/products.js'
import { get, set } from './_redis.js'

const catalogKey = 'products:catalog'

function normalizeOptionValue(value) {
  return {
    id: String(value.id || '').trim(),
    name: String(value.name || '').trim(),
    nameEn: String(value.nameEn || value.name || '').trim(),
    priceDelta: Number(value.priceDelta || 0),
  }
}

function normalizeOption(option) {
  return {
    id: String(option.id || '').trim(),
    name: String(option.name || '').trim(),
    nameEn: String(option.nameEn || option.name || '').trim(),
    values: (option.values || []).map(normalizeOptionValue).filter((value) => value.id && value.name),
  }
}

export function normalizeProduct(product) {
  const id = String(product.id || '').trim()
  const normalized = {
    id,
    name: String(product.name || '').trim(),
    nameEn: String(product.nameEn || product.name || '').trim(),
    description: String(product.description || '').trim(),
    descriptionEn: String(product.descriptionEn || product.description || '').trim(),
    price: Number(product.price || 0),
    image: String(product.image || '').trim(),
    category: String(product.category || 'tools').trim(),
    stock: Number(product.stock || 0),
    badge: String(product.badge || '').trim(),
    badgeEn: String(product.badgeEn || product.badge || '').trim(),
    options: (product.options || []).map(normalizeOption).filter((option) => option.id && option.name && option.values.length),
    active: product.active !== false,
  }

  if (!normalized.id || !/^[a-z0-9-]+$/.test(normalized.id)) {
    throw new Error('商品 ID 只能包含小写字母、数字和横杠 / Invalid product ID')
  }
  if (!normalized.name || !normalized.description || !normalized.image) {
    throw new Error('请填写商品名称、描述和图片 / Missing product details')
  }
  if (!Number.isFinite(normalized.price) || normalized.price < 0) {
    throw new Error('商品价格无效 / Invalid product price')
  }
  if (!Number.isInteger(normalized.stock) || normalized.stock < 0) {
    throw new Error('商品库存无效 / Invalid product stock')
  }

  return normalized
}

export async function getProductCatalog({ includeInactive = false } = {}) {
  const stored = await get(catalogKey)
  const catalog = Array.isArray(stored) && stored.length > 0 ? stored : defaultProducts.map((product) => ({ ...product, active: product.active !== false }))
  return includeInactive ? catalog : catalog.filter((product) => product.active !== false)
}

export async function saveProductCatalog(products) {
  await set(catalogKey, products)
}

export function getProductCategories() {
  return categories
}
