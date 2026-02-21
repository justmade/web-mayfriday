import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navigation from './Navigation'
import CartIcon from '../cart/CartIcon'
import useAuthStore from '../../store/authStore'
import { MdLanguage } from 'react-icons/md'
import { HiUser, HiLogout } from 'react-icons/hi'

function Header() {
  const { i18n } = useTranslation()
  const { isLoggedIn, phone, logout } = useAuthStore()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh'
    i18n.changeLanguage(newLang)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="bg-white shadow-soft sticky top-0 z-40">
      <div className="container-custom px-4 md:px-8 lg:px-16 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl md:text-3xl font-bold text-primary">
              {i18n.language === 'zh' ? '五月的星期五' : 'May Friday'}
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <div className="hidden md:block flex-1 mx-8">
            <div className="flex justify-center">
              <Navigation />
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Language switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors"
              aria-label="Toggle language"
            >
              <MdLanguage size={20} />
              <span className="text-sm hidden sm:inline">
                {i18n.language === 'zh' ? 'EN' : '中文'}
              </span>
            </button>

            {/* Cart icon */}
            <CartIcon />

            {/* Authentication */}
            {isLoggedIn ? (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/my-courses"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors"
                >
                  <HiUser size={20} />
                  <span className="text-sm">
                    {phone ? phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : ''}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                  title={i18n.language === 'zh' ? '退出登录' : 'Logout'}
                >
                  <HiLogout size={20} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  {i18n.language === 'zh' ? '登录' : 'Login'}
                </Link>
                <Link
                  to="/register"
                  className="text-sm text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  {i18n.language === 'zh' ? '注册' : 'Register'}
                </Link>
                <Link
                  to="/activate"
                  className="text-sm px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition font-medium"
                >
                  {i18n.language === 'zh' ? '激活课程' : 'Activate'}
                </Link>
              </div>
            )}

            {/* Mobile navigation */}
            <div className="md:hidden">
              <Navigation />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
