import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navigation from './Navigation'
import CartIcon from '../cart/CartIcon'
import { MdLanguage } from 'react-icons/md'

function Header() {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh'
    i18n.changeLanguage(newLang)
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
