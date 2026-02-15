import { useTranslation } from 'react-i18next'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'

function Studio() {
  const { t, i18n } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-cream to-white section-padding py-12">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('studio.title')}
          </h1>
        </div>
      </section>

      {/* Hero Image */}
      <section className="section-padding py-0">
        <div className="container-custom">
          <div className="aspect-[21/9] bg-gray-200 rounded-lg overflow-hidden shadow-lg">
            <img
              src="/images/studio/hero.jpg"
              alt="Studio"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            {t('studio.story.title')}
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="text-lg mb-6">{t('studio.story.content')}</p>
          </div>
        </div>
      </section>

      {/* Owner Section */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden shadow-lg">
              <img
                src="/images/studio/owner.jpg"
                alt="Studio Owner"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {i18n.language === 'zh' ? '创始人 - 李雅' : 'Founder - Li Ya'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {i18n.language === 'zh'
                  ? '从小就对编织艺术充满热情，在传统手工艺与现代设计之间找到了完美的平衡。拥有15年编织经验，曾在多个国家学习不同的编织技法，致力于将这门古老的艺术传承给更多人。'
                  : 'Passionate about weaving since childhood, finding the perfect balance between traditional crafts and modern design. With 15 years of weaving experience, having studied various techniques in multiple countries, dedicated to passing on this ancient art to more people.'}
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-gray-700">
                    {i18n.language === 'zh' ? '15年编织教学经验' : '15 years of teaching experience'}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-gray-700">
                    {i18n.language === 'zh' ? '国际编织协会认证讲师' : 'Certified International Weaving Instructor'}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-gray-700">
                    {i18n.language === 'zh' ? '作品曾在多个展览中展出' : 'Works exhibited in multiple exhibitions'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {t('studio.philosophy.title')}
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            {t('studio.philosophy.content')}
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="section-padding bg-gray-100">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t('studio.contact.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <MdEmail className="text-primary text-2xl" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{t('studio.contact.email')}</h3>
              <p className="text-gray-600">contact@mayfriday.com</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <MdPhone className="text-primary text-2xl" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{t('studio.contact.phone')}</h3>
              <p className="text-gray-600">+86 138 0000 0000</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <MdLocationOn className="text-primary text-2xl" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{t('studio.contact.address')}</h3>
              <p className="text-gray-600">
                {i18n.language === 'zh' ? '北京市朝阳区' : 'Chaoyang District, Beijing'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Studio
