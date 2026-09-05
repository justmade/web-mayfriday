import { useState } from 'react'
import { HiClipboardList, HiRefresh } from 'react-icons/hi'

const statuses = {
  pending_confirmation: '待确认',
  contacted: '已联系',
  paid: '已付款',
  shipped: '已发货',
  cancelled: '已取消',
}

function AdminOrders() {
  const [password, setPassword] = useState('')
  const [orders, setOrders] = useState([])
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadOrders = async (pwd = password) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/orders', {
        headers: { 'x-admin-password': pwd },
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.error)
      setOrders(data.orders)
      setAuthenticated(true)
    } catch (err) {
      setError(err.message || '获取订单失败')
      setAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId, status) => {
    setLoading(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ action: 'updateStatus', orderId, status }),
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.error)
      setOrders((current) => current.map((order) => order.id === orderId ? data.order : order))
    } catch (err) {
      setError(err.message || '更新失败')
    } finally {
      setLoading(false)
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form onSubmit={(e) => { e.preventDefault(); loadOrders(password) }} className="w-full max-w-md bg-white border border-gray-200 p-7">
          <HiClipboardList className="w-10 h-10 text-primary mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-5">订单管理</h1>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="管理员密码" className="w-full border border-gray-300 px-3 py-2.5 mb-3" />
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          <button disabled={loading} className="btn-primary w-full">{loading ? '验证中...' : '进入订单管理'}</button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom px-4 md:px-8 lg:px-16 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
            <p className="text-sm text-gray-500 mt-1">最近 {orders.length} 个订单</p>
          </div>
          <button onClick={() => loadOrders()} className="flex items-center gap-2 border border-gray-300 px-3 py-2 text-sm"><HiRefresh /> 刷新</button>
        </div>
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="bg-white border border-gray-200 p-5">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-gray-200 pb-4 mb-4">
                <div>
                  <p className="font-mono font-bold text-gray-900">{order.id}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString('zh-CN')}</p>
                </div>
                <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} className="border border-gray-300 px-3 py-2 text-sm">
                  {Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </div>
              <div className="grid md:grid-cols-[220px_1fr_auto] gap-5 text-sm">
                <div className="space-y-1 text-gray-700">
                  <p className="font-semibold text-gray-900">{order.customer.name} · {order.customer.phone}</p>
                  <p>{order.customer.address}</p>
                  {order.customer.note && <p className="text-gray-500">备注：{order.customer.note}</p>}
                </div>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={`${item.productId}-${index}`} className="flex justify-between gap-4">
                      <span>{item.name} · {item.selectedOptions.map((option) => option.valueName).join(' / ')} × {item.quantity}</span>
                      <span>¥{item.subtotal}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xl font-bold text-primary">¥{order.total}</p>
              </div>
            </article>
          ))}
          {orders.length === 0 && <div className="bg-white border border-gray-200 p-12 text-center text-gray-500">暂无订单</div>}
        </div>
      </div>
    </div>
  )
}

export default AdminOrders
