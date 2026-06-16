import { getProductCatalog, getProductCategories } from './_products.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const products = await getProductCatalog()
    return res.json({ success: true, products, categories: getProductCategories() })
  } catch (error) {
    console.error('Products API error:', error)
    return res.status(500).json({ success: false, error: '商品加载失败 / Failed to load products' })
  }
}
