import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HiArrowLeft, HiCheckCircle, HiLockClosed } from 'react-icons/hi'
import useCartStore from '../store/cartStore'

function Checkout() {
  const { i18n } = useTranslation()
  const zh = i18n.language === 'zh'
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [form, setForm] = useState({ name: '', phone: '', address: '', contactMethod: 'phone', note: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState(null)

  const updateField = (field, value) => {
    const nextValue = field === 'phone' ? value.replace(/[^\d]/g, '').slice(0, 11) : value
    setForm((current) => ({ ...current, [field]: nextValue }))
  }

  const submitOrder = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            selections: Object.fromEntries((item.selectedOptions || []).map((option) => [option.optionId, option.valueId])),
          })),
        }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.error || 'Order submission failed')
      setOrder(data.order)
      clearCart()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (order) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="max-w-xl mx-auto bg-white border border-gray-200 p-7 md:p-10 text-center">
          <HiCheckCircle className="w-14 h-14 text-green-600 mx-auto mb-5" />
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{zh ? '订单已提交' : 'Order submitted'}</h1>
          <p className="text-gray-600 mb-6">
            {zh ? '客服将根据你填写的联系方式确认库存、运费和付款方式。' : 'We will contact you to confirm stock, shipping, and payment.'}
          </p>
          <div className="bg-gray-50 border border-gray-200 p-4 text-left mb-7">
            <p className="text-xs text-gray-500 mb-1">{zh ? '订单号' : 'Order number'}</p>
            <p className="font-mono font-bold text-lg text-gray-900">{order.id}</p>
            <p className="text-sm text-gray-600 mt-3">{zh ? '订单金额' : 'Order total'}：¥{order.total}</p>
          </div>
          <Link to="/tools" className="btn-primary inline-block">{zh ? '返回工具页' : 'Back to tools'}</Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{zh ? '购物车为空' : 'Your cart is empty'}</h1>
          <Link to="/tools" className="btn-primary inline-block">{zh ? '挑选工具' : 'Browse tools'}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom px-4 md:px-8 lg:px-16 py-8 md:py-12">
        <Link to="/tools" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary mb-7">
          <HiArrowLeft /> {zh ? '继续选购' : 'Continue shopping'}
        </Link>
        <div className="grid lg:grid-cols-[1fr_380px] gap-7 items-start">
          <form onSubmit={submitOrder} className="bg-white border border-gray-200 p-5 md:p-7">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{zh ? '提交购买订单' : 'Submit order'}</h1>
            <p className="text-sm text-gray-600 mb-7">
              {zh ? '提交后客服会联系你确认库存、运费与付款方式。' : 'We will contact you to confirm stock, shipping, and payment.'}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="text-sm font-medium text-gray-700">
                {zh ? '收货人姓名' : 'Name'}
                <input required value={form.name} onChange={(e) => updateField('name', e.target.value)} className="mt-2 w-full border border-gray-300 px-3 py-2.5 focus:outline-none focus:border-primary" />
              </label>
              <label className="text-sm font-medium text-gray-700">
                {zh ? '手机号码' : 'Phone'}
                <input required type="tel" inputMode="numeric" autoComplete="tel" pattern="1[0-9]{10}" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className="mt-2 w-full border border-gray-300 px-3 py-2.5 focus:outline-none focus:border-primary" />
              </label>
            </div>
            <label className="block text-sm font-medium text-gray-700 mt-4">
              {zh ? '收货地址' : 'Shipping address'}
              <textarea required rows="3" value={form.address} onChange={(e) => updateField('address', e.target.value)} className="mt-2 w-full border border-gray-300 px-3 py-2.5 focus:outline-none focus:border-primary" />
            </label>
            <fieldset className="mt-4">
              <legend className="text-sm font-medium text-gray-700 mb-2">{zh ? '优先联系渠道' : 'Preferred contact'}</legend>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['phone', zh ? '电话 / 短信' : 'Phone / SMS'],
                  ['wechat', zh ? '微信' : 'WeChat'],
                ].map(([value, label]) => (
                  <label key={value} className={`border px-3 py-2.5 text-sm cursor-pointer ${form.contactMethod === value ? 'border-primary bg-soft-pink text-primary' : 'border-gray-200'}`}>
                    <input type="radio" className="sr-only" checked={form.contactMethod === value} onChange={() => updateField('contactMethod', value)} />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="block text-sm font-medium text-gray-700 mt-4">
              {zh ? '订单备注（选填）' : 'Order note (optional)'}
              <textarea rows="2" value={form.note} onChange={(e) => updateField('note', e.target.value)} className="mt-2 w-full border border-gray-300 px-3 py-2.5 focus:outline-none focus:border-primary" />
            </label>
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            <button disabled={submitting} className="btn-primary w-full mt-6 disabled:opacity-50">
              {submitting ? (zh ? '提交中...' : 'Submitting...') : (zh ? '提交订单' : 'Submit order')}
            </button>
            <p className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-3">
              <HiLockClosed /> {zh ? '联系方式仅用于本次订单确认' : 'Contact details are used only for this order'}
            </p>
          </form>

          <aside className="bg-white border border-gray-200 p-5 lg:sticky lg:top-28">
            <h2 className="font-bold text-lg text-gray-900 mb-4">{zh ? '订单明细' : 'Order summary'}</h2>
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.cartItemId || item.id} className="py-3 flex gap-3">
                  <img src={item.image} alt="" className="w-14 h-14 object-cover bg-gray-100" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{zh ? item.name : item.nameEn}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(item.selectedOptions || []).map((option) => zh ? option.valueName : option.valueNameEn).join(' · ')}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">¥{item.price} × {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold text-lg">
              <span>{zh ? '商品合计' : 'Subtotal'}</span>
              <span className="text-primary">¥{getTotalPrice()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">{zh ? '运费将在客服确认订单时计算。' : 'Shipping will be confirmed before payment.'}</p>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Checkout
