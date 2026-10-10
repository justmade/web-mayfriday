import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HiX } from 'react-icons/hi'
import useAuthStore from '../../store/authStore'

/**
 * 域名迁移提示横幅。
 *
 * 背景:站点从 mayinfriday.icdiary.com 迁到 mayinfriday.com,旧域名整站
 * 301 跳过来。登录态用 zustand persist 存在 localStorage,按 origin 隔离,
 * 跳转不会带过来 —— 老用户落地时是未登录状态,需要重新登录一次。
 * 课程权限按手机号存在服务端,重新登录后原样都在,这条横幅就是讲清这件事。
 *
 * 临时组件。等老用户基本完成一轮重新登录后(建议 2027-04 前后)就可以
 * 连同 MainLayout 里的引用一起删掉。
 */

const DISMISS_KEY = 'domain-notice-dismissed'

// 只在新域名显示。旧域名上只剩 301,用户根本看不到页面;
// localhost 保留是为了本地能预览这条横幅。
const SHOW_ON_HOSTS = ['mayinfriday.com', 'www.mayinfriday.com', 'localhost', '127.0.0.1']

function DomainNoticeBanner() {
  const { i18n } = useTranslation()
  const zh = i18n.language === 'zh'
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === '1'
    } catch {
      // 隐私模式下 localStorage 可能直接抛错,此时当作没关过
      return false
    }
  })

  const handleDismiss = () => {
    setDismissed(true)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // 存不下就算了,下次刷新再提示一遍,不值得为此报错
    }
  }

  // 已登录说明这一轮迁移对他已经结束了,不用再打扰
  if (isLoggedIn || dismissed) return null
  if (!SHOW_ON_HOSTS.includes(window.location.hostname)) return null

  return (
    <div className="bg-ink text-white">
      <div className="container-custom px-4 md:px-8 lg:px-16 py-2.5 flex items-start gap-3">
        <p className="flex-1 text-sm leading-5">
          {zh ? (
            <>
              我们的网址已更新为 <strong className="font-semibold">mayinfriday.com</strong>
              ，旧网址会自动跳转到这里。换了域名后需要重新登录一次，
              <strong className="font-semibold">已购课程不受影响</strong>，用原手机号登录即可继续学习。
            </>
          ) : (
            <>
              Our address is now <strong className="font-semibold">mayinfriday.com</strong>. The old
              address redirects here automatically. You will need to sign in again after the move —{' '}
              <strong className="font-semibold">your purchased courses are unaffected</strong>; just
              sign in with the same phone number.
            </>
          )}
        </p>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 -m-1 text-white/70 hover:text-white transition-colors"
          aria-label={zh ? '关闭提示' : 'Dismiss notice'}
        >
          <HiX size={18} />
        </button>
      </div>
    </div>
  )
}

export default DomainNoticeBanner
