import { useEffect, useState } from 'react'
import { HiCheckCircle, HiPencil, HiPlus, HiRefresh, HiTrash, HiXCircle } from 'react-icons/hi'

const emptyProduct = {
  id: '',
  name: '',
  nameEn: '',
  description: '',
  descriptionEn: '',
  price: 0,
  image: '',
  category: 'tools',
  stock: 0,
  badge: '',
  badgeEn: '',
  active: true,
  optionsText: '',
}

function productToForm(product) {
  return {
    ...emptyProduct,
    ...product,
    price: product.price || 0,
    stock: product.stock || 0,
    active: product.active !== false,
    optionsText: JSON.stringify(product.options || [], null, 2),
  }
}

function formToProduct(form) {
  return {
    id: form.id,
    name: form.name,
    nameEn: form.nameEn,
    description: form.description,
    descriptionEn: form.descriptionEn,
    price: Number(form.price),
    image: form.image,
    category: form.category,
    stock: Number(form.stock),
    badge: form.badge,
    badgeEn: form.badgeEn,
    active: form.active,
    options: form.optionsText.trim() ? JSON.parse(form.optionsText) : [],
  }
}

function AdminProducts() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyProduct)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const updateForm = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const fetchProducts = async (pwd = password) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/admin?action=listProducts&adminPassword=${encodeURIComponent(pwd)}`)
      const data = await response.json()
      if (!data.success) throw new Error(data.error)
      setProducts(data.products)
      setCategories(data.categories || [])
      setAuthenticated(true)
    } catch (err) {
      setError(err.message || '商品加载失败')
      setAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authenticated) fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (event) => {
    event.preventDefault()
    fetchProducts(password)
  }

  const editProduct = (product) => {
    setForm(productToForm(product))
    setSuccess('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => setForm(emptyProduct)

  const saveProduct = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const product = formToProduct(form)
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'upsertProduct', adminPassword: password, product }),
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.error)
      setProducts(data.products)
      setForm(productToForm(data.product))
      setSuccess(`商品 ${data.product.name} 已保存`)
    } catch (err) {
      setError(err.message || '保存失败')
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (productId) => {
    if (!confirm(`确定删除商品 ${productId} 吗？`)) return
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteProduct', adminPassword: password, productId }),
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.error)
      setProducts(data.products)
      resetForm()
      setSuccess(`商品 ${productId} 已删除`)
    } catch (err) {
      setError(err.message || '删除失败')
    } finally {
      setLoading(false)
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="max-w-md w-full bg-white border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">商品管理</h1>
          <p className="text-sm text-gray-600 mb-6">Product Management</p>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          <label className="block text-sm font-medium text-gray-700">
            管理员密码 / Admin Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full border border-gray-300 px-3 py-2.5" required />
          </label>
          <button className="btn-primary w-full mt-6 disabled:opacity-50" disabled={loading}>{loading ? '验证中...' : '登录 / Login'}</button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8 px-4">
        <div className="bg-white border border-gray-200 p-6 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">商品管理 / Products</h1>
            <p className="text-sm text-gray-600 mt-1">共 {products.length} 个商品</p>
          </div>
          <button onClick={() => fetchProducts()} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200" disabled={loading}>
            <HiRefresh className={loading ? 'animate-spin' : ''} /> 刷新
          </button>
        </div>

        {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 flex items-start gap-3"><HiCheckCircle className="text-green-600 text-xl" /><p className="text-green-800">{success}</p></div>}
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 flex items-start gap-3"><HiXCircle className="text-red-600 text-xl" /><p className="text-red-800">{error}</p></div>}

        <form onSubmit={saveProduct} className="bg-white border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">{form.id ? '编辑商品' : '新增商品'}</h2>
            <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-sm"><HiPlus /> 新商品</button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <label className="text-sm font-medium text-gray-700">商品 ID
              <input value={form.id} onChange={(event) => updateForm('id', event.target.value.toLowerCase())} className="mt-2 w-full border border-gray-300 px-3 py-2.5" placeholder="wood-shuttle" required />
            </label>
            <label className="text-sm font-medium text-gray-700">分类
              <select value={form.category} onChange={(event) => updateForm('category', event.target.value)} className="mt-2 w-full border border-gray-300 px-3 py-2.5">
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name} / {category.nameEn}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">上架
              <select value={form.active ? 'true' : 'false'} onChange={(event) => updateForm('active', event.target.value === 'true')} className="mt-2 w-full border border-gray-300 px-3 py-2.5">
                <option value="true">上架</option>
                <option value="false">下架</option>
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">中文名
              <input value={form.name} onChange={(event) => updateForm('name', event.target.value)} className="mt-2 w-full border border-gray-300 px-3 py-2.5" required />
            </label>
            <label className="text-sm font-medium text-gray-700">英文名
              <input value={form.nameEn} onChange={(event) => updateForm('nameEn', event.target.value)} className="mt-2 w-full border border-gray-300 px-3 py-2.5" />
            </label>
            <label className="text-sm font-medium text-gray-700">图片路径
              <input value={form.image} onChange={(event) => updateForm('image', event.target.value)} className="mt-2 w-full border border-gray-300 px-3 py-2.5" placeholder="/images/products/tool.jpg" required />
            </label>
            <label className="text-sm font-medium text-gray-700">价格
              <input type="number" min="0" value={form.price} onChange={(event) => updateForm('price', event.target.value)} className="mt-2 w-full border border-gray-300 px-3 py-2.5" required />
            </label>
            <label className="text-sm font-medium text-gray-700">库存
              <input type="number" min="0" value={form.stock} onChange={(event) => updateForm('stock', event.target.value)} className="mt-2 w-full border border-gray-300 px-3 py-2.5" required />
            </label>
            <label className="text-sm font-medium text-gray-700">角标
              <input value={form.badge} onChange={(event) => updateForm('badge', event.target.value)} className="mt-2 w-full border border-gray-300 px-3 py-2.5" />
            </label>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <label className="text-sm font-medium text-gray-700">中文描述
              <textarea rows="3" value={form.description} onChange={(event) => updateForm('description', event.target.value)} className="mt-2 w-full border border-gray-300 px-3 py-2.5" required />
            </label>
            <label className="text-sm font-medium text-gray-700">英文描述
              <textarea rows="3" value={form.descriptionEn} onChange={(event) => updateForm('descriptionEn', event.target.value)} className="mt-2 w-full border border-gray-300 px-3 py-2.5" />
            </label>
          </div>

          <label className="block text-sm font-medium text-gray-700 mt-4">规格 JSON
            <textarea rows="8" value={form.optionsText} onChange={(event) => updateForm('optionsText', event.target.value)} className="mt-2 w-full border border-gray-300 px-3 py-2.5 font-mono text-xs" placeholder='[{"id":"size","name":"规格","nameEn":"Size","values":[{"id":"small","name":"小号","nameEn":"Small","priceDelta":0}]}]' />
          </label>

          <button className="btn-primary mt-6 disabled:opacity-50" disabled={loading}>{loading ? '保存中...' : '保存商品'}</button>
        </form>

        <div className="bg-white border border-gray-200 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">商品</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">分类</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">价格</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">库存</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">状态</th>
                <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <code className="text-xs text-gray-500">{product.id}</code>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{product.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">¥{product.price}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{product.stock}</td>
                  <td className="px-4 py-3 text-sm">{product.active === false ? <span className="text-gray-500">下架</span> : <span className="text-green-700">上架</span>}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => editProduct(product)} className="inline-flex items-center justify-center p-2 text-gray-700 hover:text-primary" title="编辑"><HiPencil /></button>
                    <button onClick={() => deleteProduct(product.id)} className="inline-flex items-center justify-center p-2 text-red-600 hover:text-red-800" title="删除"><HiTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminProducts
