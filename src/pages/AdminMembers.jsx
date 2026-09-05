import { useState } from 'react'
import { HiCheckCircle, HiRefresh, HiUserAdd, HiXCircle } from 'react-icons/hi'

const initialForm = {
  phone: '',
  tier: 'standard',
  period: 'monthly',
  expiresAt: '',
  note: '',
}

const tierLabels = {
  standard: '标准会员',
  premium: '尊享会员',
}

const statusLabels = {
  active: '有效',
  expired: '已过期',
  cancelled: '已取消',
  none: '无会员',
}

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString('zh-CN')
}

function AdminMembers() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [members, setMembers] = useState([])
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const updateForm = (field, value) => {
    const nextValue = field === 'phone' ? value.replace(/[^\d]/g, '').slice(0, 11) : value
    setForm((current) => ({ ...current, [field]: nextValue }))
  }

  const fetchMembers = async (pwd = password) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin?action=listMembers', {
        headers: { 'x-admin-password': pwd },
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.error)
      setMembers(data.members)
      setAuthenticated(true)
    } catch (err) {
      setError(err.message || '会员加载失败')
      setAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (event) => {
    event.preventDefault()
    fetchMembers(password)
  }

  const grantMembership = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({
          action: 'grantMembership',
          phone: form.phone,
          membership: {
            tier: form.tier,
            period: form.period,
            expiresAt: form.expiresAt || undefined,
            note: form.note,
          },
        }),
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.error)

      setMembers((current) => {
        const exists = current.some((member) => member.phone === data.member.phone)
        return exists ? current.map((member) => member.phone === data.member.phone ? data.member : member) : [data.member, ...current]
      })
      setSuccess(`${data.member.phone} 已开通${tierLabels[data.member.membership.tier]}`)
      setForm(initialForm)
    } catch (err) {
      setError(err.message || '开通失败')
    } finally {
      setLoading(false)
    }
  }

  const cancelMembership = async (phone) => {
    if (!confirm(`确定取消 ${phone} 的会员吗？`)) return
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ action: 'cancelMembership', phone }),
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.error)
      setMembers((current) => current.map((member) => member.phone === phone ? data.member : member))
      setSuccess(`${phone} 的会员已取消`)
    } catch (err) {
      setError(err.message || '取消失败')
    } finally {
      setLoading(false)
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="max-w-md w-full bg-white border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">会员管理</h1>
          <p className="text-sm text-gray-600 mb-6">Member Management</p>
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
            <h1 className="text-2xl font-bold text-gray-900">会员管理 / Members</h1>
            <p className="text-sm text-gray-600 mt-1">共 {members.length} 个会员记录</p>
          </div>
          <button onClick={() => fetchMembers()} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200" disabled={loading}>
            <HiRefresh className={loading ? 'animate-spin' : ''} /> 刷新
          </button>
        </div>

        {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 flex items-start gap-3"><HiCheckCircle className="text-green-600 text-xl" /><p className="text-green-800">{success}</p></div>}
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 flex items-start gap-3"><HiXCircle className="text-red-600 text-xl" /><p className="text-red-800">{error}</p></div>}

        <form onSubmit={grantMembership} className="bg-white border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5">开通 / 续费会员</h2>
          <div className="grid md:grid-cols-5 gap-4">
            <label className="text-sm font-medium text-gray-700">手机号
              <input value={form.phone} onChange={(event) => updateForm('phone', event.target.value)} className="mt-2 w-full border border-gray-300 px-3 py-2.5" placeholder="13564415492" required />
            </label>
            <label className="text-sm font-medium text-gray-700">会员档次
              <select value={form.tier} onChange={(event) => updateForm('tier', event.target.value)} className="mt-2 w-full border border-gray-300 px-3 py-2.5">
                <option value="standard">标准会员</option>
                <option value="premium">尊享会员</option>
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">周期
              <select value={form.period} onChange={(event) => updateForm('period', event.target.value)} className="mt-2 w-full border border-gray-300 px-3 py-2.5">
                <option value="monthly">月付</option>
                <option value="yearly">年付</option>
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">自定义到期日
              <input type="date" value={form.expiresAt} onChange={(event) => updateForm('expiresAt', event.target.value)} className="mt-2 w-full border border-gray-300 px-3 py-2.5" />
            </label>
            <label className="text-sm font-medium text-gray-700">备注
              <input value={form.note} onChange={(event) => updateForm('note', event.target.value)} className="mt-2 w-full border border-gray-300 px-3 py-2.5" placeholder="付款方式/来源" />
            </label>
          </div>
          <button className="btn-primary mt-6 inline-flex items-center gap-2 disabled:opacity-50" disabled={loading || form.phone.length !== 11}>
            <HiUserAdd /> 开通会员
          </button>
        </form>

        <div className="bg-white border border-gray-200 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">手机号</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">档次</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">到期时间</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">备注</th>
                <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member.phone}>
                  <td className="px-4 py-3 font-mono text-sm text-gray-900">{member.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{tierLabels[member.membership?.tier] || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{statusLabels[member.membershipStatus] || member.membershipStatus}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatDate(member.membership?.expiresAt)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{member.membership?.note || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => cancelMembership(member.phone)} className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50" disabled={member.membershipStatus !== 'active'}>
                      取消会员
                    </button>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-10 text-center text-gray-500">暂无会员记录</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminMembers
