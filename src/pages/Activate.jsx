import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HiXCircle } from 'react-icons/hi'
import useAuthStore from '../store/authStore'

/**
 * 激活课程页面
 * Logged-in users only need to enter an activation code.
 */
function Activate() {
  const [activationCode, setActivationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { isLoggedIn, token } = useAuthStore()
  const { i18n } = useTranslation()

  if (!isLoggedIn || !token) {
    return <Navigate to="/login?redirect=/activate" replace />
  }

  const handleActivate = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/activate-course', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activationCode: activationCode.trim().toUpperCase() }),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || (i18n.language === 'zh' ? '激活失败，请重试' : 'Activation failed, please try again'))
        return
      }

      navigate('/my-courses')
    } catch {
      setError(i18n.language === 'zh' ? '激活失败，请重试' : 'Activation failed, please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-light-gray flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {i18n.language === 'zh' ? '激活课程' : 'Activate Course'}
            </h2>
            <p className="text-gray-600">
              {i18n.language === 'zh'
                ? '输入激活码即可开始学习'
                : 'Enter your activation code to start learning'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <HiXCircle className="text-red-600 text-2xl mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleActivate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {i18n.language === 'zh' ? '激活码' : 'Activation Code'}
              </label>
              <input
                type="text"
                placeholder={i18n.language === 'zh' ? '请输入激活码' : 'Enter activation code'}
                value={activationCode}
                onChange={(event) => setActivationCode(event.target.value.toUpperCase())}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                {i18n.language === 'zh'
                  ? '格式如：KNIT2024-ABC123'
                  : 'Format: KNIT2024-ABC123'}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !activationCode.trim()}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  {i18n.language === 'zh' ? '激活中...' : 'Activating...'}
                </>
              ) : (
                i18n.language === 'zh' ? '激活课程' : 'Activate Course'
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            {i18n.language === 'zh'
              ? '还没有激活码？请在淘宝购买课程后获取'
              : 'No activation code? Purchase a course on Taobao to get one'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Activate
