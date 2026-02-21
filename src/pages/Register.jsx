import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useAuthStore from '../store/authStore'
import { generateDeviceId, getDeviceName } from '../utils/deviceFingerprint'
import { HiCheckCircle, HiXCircle } from 'react-icons/hi'

/**
 * 注册页面
 * Registration page
 */
function Register() {
  const [phone, setPhone] = useState('')
  const [smsCode, setSmsCode] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()
  const { login, isLoggedIn } = useAuthStore()
  const { i18n } = useTranslation()

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/my-courses')
    }
  }, [isLoggedIn])

  // Countdown timer for SMS button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  /**
   * 发送短信验证码
   * Send SMS verification code
   */
  const handleSendSMS = async () => {
    // Validate phone number
    if (!/^1\d{10}$/.test(phone)) {
      setError(i18n.language === 'zh' ? '手机号格式错误' : 'Invalid phone number format')
      return
    }

    setError('')

    try {
      const res = await fetch('/api/send-sms-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })

      const data = await res.json()

      if (data.success) {
        setCountdown(60)
        setError('')

        // 如果是测试模式，显示验证码
        if (data.devCode) {
          const message = data.testMode
            ? `【测试模式】验证码：${data.devCode}\n\n未配置短信服务，验证码仅显示在此处\n\nTest Mode - SMS not configured\nVerification Code: ${data.devCode}`
            : `[开发模式] 验证码: ${data.devCode}\n[Dev Mode] Code: ${data.devCode}`

          alert(message)

          console.log('='.repeat(50))
          console.log('验证码 / Verification Code:', data.devCode)
          console.log('='.repeat(50))
        } else {
          alert(i18n.language === 'zh'
            ? '验证码已发送到您的手机，请查看短信'
            : 'Verification code sent to your phone via SMS')
        }
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError(i18n.language === 'zh' ? '发送失败，请重试' : 'Failed to send, please try again')
    }
  }

  /**
   * 注册
   * Register
   */
  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const deviceId = generateDeviceId()
      const deviceName = getDeviceName()

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          smsCode,
          deviceId,
          deviceName
        })
      })

      const data = await res.json()

      if (data.success) {
        // Save login state
        login(data.token, phone)
        setSuccess(true)

        // Redirect to my courses after 1 second
        setTimeout(() => {
          navigate('/my-courses')
        }, 1000)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError(i18n.language === 'zh' ? '注册失败，请重试' : 'Registration failed, please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-light-gray flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {i18n.language === 'zh' ? '注册' : 'Register'}
            </h2>
            <p className="text-gray-600">
              {i18n.language === 'zh'
                ? '使用手机号和验证码注册'
                : 'Register with phone number and verification code'}
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <HiCheckCircle className="text-green-600 text-2xl mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-800 font-medium">
                  {i18n.language === 'zh' ? '注册成功！' : 'Registration Successful!'}
                </p>
                <p className="text-green-700 text-sm">
                  {i18n.language === 'zh' ? '正在跳转...' : 'Redirecting...'}
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <HiXCircle className="text-red-600 text-2xl mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {i18n.language === 'zh' ? '手机号' : 'Phone Number'}
              </label>
              <input
                type="tel"
                placeholder={i18n.language === 'zh' ? '请输入手机号' : 'Enter phone number'}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition"
                required
                disabled={success}
                maxLength={11}
              />
            </div>

            {/* SMS Code + Send Button */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {i18n.language === 'zh' ? '短信验证码' : 'SMS Verification Code'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={i18n.language === 'zh' ? '验证码' : 'Code'}
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  required
                  disabled={success}
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={handleSendSMS}
                  disabled={countdown > 0 || !phone || success}
                  className="px-6 py-3 bg-secondary text-white rounded-lg font-medium hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {countdown > 0
                    ? `${countdown}${i18n.language === 'zh' ? '秒' : 's'}`
                    : i18n.language === 'zh' ? '获取验证码' : 'Get Code'}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !phone || !smsCode || success}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {i18n.language === 'zh' ? '注册中...' : 'Registering...'}
                </>
              ) : (
                i18n.language === 'zh' ? '注册' : 'Register'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 text-center text-sm text-gray-600">
            {i18n.language === 'zh' ? '已有账号？' : 'Already have an account?'}
            {' '}
            <Link to="/login" className="text-primary hover:text-secondary font-medium">
              {i18n.language === 'zh' ? '去登录' : 'Login'}
            </Link>
          </div>

          {/* Activate Link */}
          <div className="mt-3 text-center text-sm text-gray-600">
            {i18n.language === 'zh' ? '有激活码？' : 'Have activation code?'}
            {' '}
            <Link to="/activate" className="text-primary hover:text-secondary font-medium">
              {i18n.language === 'zh' ? '直接激活' : 'Activate Course'}
            </Link>
          </div>
        </div>

        {/* Info Notice */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            {i18n.language === 'zh'
              ? '注册后可以浏览课程，购买课程后使用激活码即可学习'
              : 'Browse courses after registration. Activate with code after purchase to start learning'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
