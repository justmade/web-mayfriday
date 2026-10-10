import { Outlet } from 'react-router-dom'
import Header from '../common/Header'
import Footer from '../common/Footer'
import CartDrawer from '../cart/CartDrawer'
import DomainNoticeBanner from '../common/DomainNoticeBanner'

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 域名迁移说明,放在 sticky Header 之上,滚动后随页面移出视口 */}
      <DomainNoticeBanner />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}

export default MainLayout
