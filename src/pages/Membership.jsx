import { useTranslation } from 'react-i18next'
import { membershipPlans, memberBenefits } from '../data/membership'
import { HiCheck } from 'react-icons/hi'

function Membership() {
  const { i18n } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="gradient-bg py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {i18n.language === 'zh' ? '加入会员' : 'Join Membership'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            {i18n.language === 'zh'
              ? '选择适合您的会员计划，开启专业编织学习之旅'
              : 'Choose the membership plan that suits you and start your professional weaving journey'}
          </p>
        </div>
      </section>

      {/* Membership Benefits */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {i18n.language === 'zh' ? '会员权益' : 'Member Benefits'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {memberBenefits.map((benefit) => (
              <div
                key={benefit.id}
                className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {i18n.language === 'zh' ? benefit.title : benefit.titleEn}
                </h3>
                <p className="text-gray-600">
                  {i18n.language === 'zh' ? benefit.description : benefit.descriptionEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {i18n.language === 'zh' ? '选择您的计划' : 'Choose Your Plan'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {membershipPlans.map((plan) => {
              const name = i18n.language === 'zh' ? plan.name : plan.nameEn
              const description = i18n.language === 'zh' ? plan.description : plan.descriptionEn
              const features = i18n.language === 'zh' ? plan.features : plan.featuresEn
              const period = i18n.language === 'zh' ? plan.period : plan.periodEn

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl shadow-soft overflow-hidden ${
                    plan.popular ? 'ring-2 ring-primary transform scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="bg-primary text-white text-center py-2 text-sm font-medium">
                      {i18n.language === 'zh' ? '最受欢迎' : 'Most Popular'}
                    </div>
                  )}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-2 text-gray-900">{name}</h3>
                    <p className="text-gray-600 mb-6 min-h-[3rem]">{description}</p>

                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-primary">¥{plan.price}</span>
                        <span className="text-gray-500 ml-2">/ {period}</span>
                      </div>
                    </div>

                    <button className="btn-primary w-full mb-6">
                      {i18n.language === 'zh' ? '立即加入' : 'Join Now'}
                    </button>

                    <div className="space-y-3">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <HiCheck className="text-primary mt-1 mr-2 flex-shrink-0" size={20} />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {i18n.language === 'zh' ? '常见问题' : 'FAQ'}
          </h2>
          <div className="space-y-6">
            <div className="bg-cream p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-2 text-gray-900">
                {i18n.language === 'zh' ? '如何取消会员？' : 'How to cancel membership?'}
              </h3>
              <p className="text-gray-700">
                {i18n.language === 'zh'
                  ? '您可以随时在账户设置中取消会员订阅，取消后仍可使用至当前付费周期结束。'
                  : 'You can cancel your membership anytime in account settings. After cancellation, you can still use it until the end of the current billing period.'}
              </p>
            </div>
            <div className="bg-cream p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-2 text-gray-900">
                {i18n.language === 'zh' ? '会员可以升级吗？' : 'Can I upgrade my membership?'}
              </h3>
              <p className="text-gray-700">
                {i18n.language === 'zh'
                  ? '可以！您可以随时升级到更高级别的会员，我们会按比例退还剩余时间的费用差额。'
                  : 'Yes! You can upgrade to a higher tier anytime, and we will credit the prorated difference.'}
              </p>
            </div>
            <div className="bg-cream p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-2 text-gray-900">
                {i18n.language === 'zh' ? '是否提供发票？' : 'Do you provide invoices?'}
              </h3>
              <p className="text-gray-700">
                {i18n.language === 'zh'
                  ? '是的，我们为所有会员提供正规发票，可在账户中心下载电子发票。'
                  : 'Yes, we provide official invoices for all members, downloadable from your account center.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Membership
