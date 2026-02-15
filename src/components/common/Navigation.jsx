import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HiMenu, HiX } from 'react-icons/hi'

function Navigation() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/courses', label: t('nav.courses') },
    { path: '/tools', label: t('nav.tools') },
    { path: '/studio', label: t('nav.studio') },
    { path: '/gallery', label: t('nav.gallery') },
  ]

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
                `text-gray-700 hover:text-primary transition-colors pb-1 border-b-2 ${
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
        <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-lg md:hidden z-50">
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
          </ul>
        </div>
      )}
    </nav>
  )
}

export default Navigation
