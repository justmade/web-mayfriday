import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useAuthStore from '../../store/authStore'
import { HiMenu, HiX, HiUser, HiLogout } from 'react-icons/hi'

function Navigation() {
  const { t, i18n } = useTranslation()
  const { isLoggedIn, phone, logout } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/courses', label: t('nav.courses') },
    { path: '/patterns', label: t('nav.patterns') },
    { path: '/tools', label: t('nav.tools') },
    { path: '/resources', label: t('nav.resources') },
    { path: '/membership', label: t('nav.membership') },
    { path: '/gallery', label: t('nav.gallery') },
  ]

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <nav className="relative">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
      </button>

      {/* Desktop navigation */}
      <ul className="hidden md:flex space-x-8">
        {navLinks.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `text-gray-700 hover:text-primary transition-colors pb-1 border-b-2 font-medium ${
                  isActive ? 'border-primary text-primary' : 'border-transparent'
                }`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white shadow-lg rounded-lg md:hidden z-50">
          <ul className="py-2">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 hover:bg-cream transition-colors ${
                      isActive ? 'bg-cream text-primary font-medium' : 'text-gray-700'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}

            {/* Divider */}
            <li className="border-t border-gray-200 my-2"></li>

            {/* Authentication links */}
            {isLoggedIn ? (
              <>
                <li>
                  <NavLink
                    to="/my-courses"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 hover:bg-cream transition-colors text-gray-700"
                  >
                    <div className="flex items-center">
                      <HiUser className="mr-2" size={18} />
                      <span>{i18n.language === 'zh' ? '我的课程' : 'My Courses'}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 ml-6">
                      {phone ? phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : ''}
                    </div>
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors text-red-600 flex items-center"
                  >
                    <HiLogout className="mr-2" size={18} />
                    <span>{i18n.language === 'zh' ? '退出登录' : 'Logout'}</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 hover:bg-cream transition-colors text-gray-700"
                  >
                    {i18n.language === 'zh' ? '登录' : 'Login'}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 hover:bg-cream transition-colors text-gray-700"
                  >
                    {i18n.language === 'zh' ? '注册' : 'Register'}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/activate"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 bg-primary text-white hover:bg-opacity-90 transition-colors font-medium text-center rounded-lg mx-2 my-1"
                  >
                    {i18n.language === 'zh' ? '激活课程' : 'Activate Course'}
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  )
}

export default Navigation
