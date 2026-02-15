import { useTranslation } from 'react-i18next'
import { FaWeixin, FaWeibo, FaInstagram } from 'react-icons/fa'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'

function Footer() {
  const { t, i18n } = useTranslation()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              {i18n.language === 'zh' ? '五月的星期五手工坊' : 'May Friday Handicraft'}
            </h3>
            <p className="text-sm leading-relaxed">
              {i18n.language === 'zh'
                ? '传承传统编织艺术，创造温暖手作生活。每一件作品都倾注心意，每一次编织都是美好时光。'
                : 'Preserving traditional weaving arts, creating warm handmade life. Every piece is crafted with care, every stitch is a beautiful moment.'}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              {t('studio.contact.title')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MdEmail className="text-primary" />
                <span className="text-sm">contact@mayfriday.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MdPhone className="text-primary" />
                <span className="text-sm">+86 138 0000 0000</span>
              </div>
              <div className="flex items-center space-x-2">
                <MdLocationOn className="text-primary" />
                <span className="text-sm">
                  {i18n.language === 'zh' ? '中国 · 北京' : 'Beijing, China'}
                </span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              {i18n.language === 'zh' ? '关注我们' : 'Follow Us'}
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="WeChat"
              >
                <FaWeixin size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Weibo"
              >
                <FaWeibo size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          <p>
            © {new Date().getFullYear()}{' '}
            {i18n.language === 'zh' ? '五月的星期五手工坊' : 'May Friday Handicraft'}.
            {i18n.language === 'zh' ? ' 版权所有' : ' All rights reserved'}.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
