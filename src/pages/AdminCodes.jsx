import { useState, useEffect } from 'react'
import { HiKey, HiTrash, HiRefresh, HiPlus, HiCheckCircle, HiXCircle } from 'react-icons/hi'

/**
 * 激活码管理页面
 * Admin page for managing activation codes
 */
function AdminCodes() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [codes, setCodes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // 创建新激活码的表单
  const [newCode, setNewCode] = useState('')
  const [courseId, setCourseId] = useState('1')

  /**
   * 登录验证
   */
  const handleLogin = (e) => {
    e.preventDefault()
    // 先尝试获取激活码列表来验证密码
    fetchCodes(password)
  }

  /**
   * 获取所有激活码
   */
  const fetchCodes = async (pwd = password) => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/admin/list-codes?adminPassword=${encodeURIComponent(pwd)}`)
      const data = await res.json()

      if (data.success) {
        setCodes(data.codes)
        setIsAuthenticated(true)
        setSuccess('')
      } else {
        setError(data.error)
        setIsAuthenticated(false)
      }
    } catch (err) {
      setError('获取失败 / Failed to fetch codes')
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  /**
   * 创建新激活码
   */
  const handleCreateCode = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/admin/create-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCode.toUpperCase(),
          courseId: parseInt(courseId),
          adminPassword: password
        })
      })

      const data = await res.json()

      if (data.success) {
        setSuccess(`激活码 ${data.code} 创建成功！`)
        setNewCode('')
        // 刷新列表
        fetchCodes()
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('创建失败 / Failed to create code')
    } finally {
      setLoading(false)
    }
  }

  /**
   * 删除激活码
   */
  const handleDeleteCode = async (code) => {
    if (!confirm(`确定要删除激活码 ${code} 吗？`)) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/delete-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          adminPassword: password
        })
      })

      const data = await res.json()

      if (data.success) {
        setSuccess(`激活码 ${code} 已删除`)
        // 刷新列表
        fetchCodes()
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('删除失败 / Failed to delete code')
    } finally {
      setLoading(false)
    }
  }

  /**
   * 生成随机激活码
   */
  const generateRandomCode = () => {
    const prefix = 'KNIT2024'
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    setNewCode(`${prefix}-${random}`)
  }

  // 登录界面
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <HiKey className="text-3xl text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              激活码管理
            </h2>
            <p className="text-gray-600 text-sm">
              Activation Code Management
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <HiXCircle className="text-red-600 text-xl mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                管理员密码 / Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="请输入管理员密码"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                默认密码：admin123 (请在环境变量中修改)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? '验证中...' : '登录 / Login'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // 管理界面
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8 px-4">
        {/* 头部 */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                激活码管理 / Code Management
              </h1>
              <p className="text-gray-600 text-sm">
                共 {codes.length} 个激活码
              </p>
            </div>
            <button
              onClick={() => fetchCodes()}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              <HiRefresh className={loading ? 'animate-spin' : ''} />
              刷新
            </button>
          </div>
        </div>

        {/* 成功/错误提示 */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
            <HiCheckCircle className="text-green-600 text-xl mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <HiXCircle className="text-red-600 text-xl mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* 创建新激活码 */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            创建新激活码 / Create New Code
          </h2>

          <form onSubmit={handleCreateCode} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  激活码 / Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
                    placeholder="KNIT2024-XXXXX"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition whitespace-nowrap"
                  >
                    随机生成
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  课程 ID / Course ID
                </label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                >
                  <option value="1">1 - 基础编织入门</option>
                  <option value="2">2 - 围巾编织专项</option>
                  <option value="3">3 - 帽子编织课程</option>
                  <option value="4">4 - 手套编织课程</option>
                  <option value="5">5 - 毛衣编织进阶</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !newCode}
              className="btn-primary disabled:opacity-50 flex items-center gap-2"
            >
              <HiPlus />
              创建激活码
            </button>
          </form>
        </div>

        {/* 激活码列表 */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              激活码列表 / Code List
            </h2>
          </div>

          {codes.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              暂无激活码，请先创建
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      激活码
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      课程 ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      使用者
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      创建时间
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {codes.map((item) => (
                    <tr key={item.code} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {item.code}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.courseId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.used ? (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                            已使用
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                            未使用
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.usedBy || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleString('zh-CN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => handleDeleteCode(item.code)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="删除"
                        >
                          <HiTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminCodes
