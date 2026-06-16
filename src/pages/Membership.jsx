import { useTranslation } from 'react-i18next'
import { membershipPlans, memberBenefits } from '../data/membership'
import { HiCheck, HiSparkles } from 'react-icons/hi'

function Membership() {
  const { i18n } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-200 py-14 md:py-18">
        <div className="container-custom px-4 md:px-8 lg:px-16">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-primary mb-2">
              {i18n.language === 'zh' ? 'MAYIN FRIDAY 课程会员' : 'MAYIN FRIDAY COURSE MEMBERSHIP'}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
              {i18n.language === 'zh' ? '系统学习编织课程' : 'Learn Weaving with a Membership'}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {i18n.language === 'zh'
                ? '会员期内解锁全部课程和图解资料。需要老师指导、作品点评和会员礼盒时，可选择尊享会员。'
                : 'Unlock all courses and pattern resources during your membership. Choose Premium for teacher guidance, project critique, and member gift boxes.'}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-200">
            {[
              ['全部课程', 'All courses'],
              ['图解下载', 'Pattern downloads'],
              ['老师指导', 'Teacher guidance'],
              ['线下优先', 'Event priority'],
            ].map(([cn, en]) => (
              <div key={cn} className="flex items-center gap-2 text-sm text-gray-700">
                <HiCheck className="text-primary w-5 h-5" />
                <span>{i18n.language === 'zh' ? cn : en}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom px-4 md:px-8 lg:px-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {i18n.language === 'zh' ? '选择会员方案' : 'Choose Your Plan'}
          </h2>
          <p className="text-center text-gray-600 mb-10">
            {i18n.language === 'zh' ? '本阶段为人工开通会员，付款后由后台按手机号开通。' : 'Membership is manually activated by phone number after payment confirmation.'}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {membershipPlans.map((plan) => {
              const name = i18n.language === 'zh' ? plan.name : plan.nameEn
              const description = i18n.language === 'zh' ? plan.description : plan.descriptionEn
              const features = i18n.language === 'zh' ? plan.features : plan.featuresEn

              return (
                <div
                  key={plan.id}
                  className={`bg-white border border-gray-200 overflow-hidden ${
                    plan.popular ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="bg-primary text-white text-center py-2 text-sm font-medium flex items-center justify-center gap-2">
                      <HiSparkles /> {i18n.language === 'zh' ? '包含老师指导' : 'Includes teacher guidance'}
                    </div>
                  )}
                  <div className="p-6 md:p-8">
                    <h3 className="text-2xl font-bold mb-2 text-gray-900">{name}</h3>
                    <p className="text-gray-600 mb-6 min-h-[3rem]">{description}</p>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="border border-gray-200 p-4">
                        <p className="text-xs text-gray-500 mb-1">{i18n.language === 'zh' ? '月付' : 'Monthly'}</p>
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold text-primary">¥{plan.price}</span>
                          <span className="text-gray-500 ml-1">/ {i18n.language === 'zh' ? '月' : 'mo'}</span>
                        </div>
                      </div>
                      <div className="border border-gray-200 p-4 bg-soft-pink">
                        <p className="text-xs text-gray-500 mb-1">{i18n.language === 'zh' ? '年付' : 'Yearly'}</p>
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold text-primary">¥{plan.annualPrice}</span>
                          <span className="text-gray-500 ml-1">/ {i18n.language === 'zh' ? '年' : 'yr'}</span>
                        </div>
                      </div>
                    </div>

                    <a href="/studio" className="btn-primary w-full mb-6 inline-block text-center">
                      {i18n.language === 'zh' ? '咨询开通会员' : 'Contact to activate'}
                    </a>

                    <div className="space-y-3">
                      {features.map((feature) => (
                        <div key={feature} className="flex items-start">
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

      <section className="section-padding bg-white">
        <div className="container-custom px-4 md:px-8 lg:px-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {i18n.language === 'zh' ? '会员权益' : 'Member Benefits'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {memberBenefits.map((benefit) => (
              <div key={benefit.id} className="border border-gray-200 bg-white p-6">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-bold mb-3 text-gray-900">
                  {i18n.language === 'zh' ? benefit.title : benefit.titleEn}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {i18n.language === 'zh' ? benefit.description : benefit.descriptionEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-custom max-w-4xl px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {i18n.language === 'zh' ? '常见问题' : 'FAQ'}
          </h2>
          <div className="space-y-5">
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="font-bold text-lg mb-2 text-gray-900">
                {i18n.language === 'zh' ? '会员如何开通？' : 'How is membership activated?'}
              </h3>
              <p className="text-gray-700">
                {i18n.language === 'zh'
                  ? '本阶段由客服确认付款后，在后台按手机号直接开通会员。'
                  : 'At this stage, membership is activated manually by phone number after payment confirmation.'}
              </p>
            </div>
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="font-bold text-lg mb-2 text-gray-900">
                {i18n.language === 'zh' ? '会员能看哪些课程？' : 'Which courses are included?'}
              </h3>
              <p className="text-gray-700">
                {i18n.language === 'zh'
                  ? '有效会员可以学习全部已上线课程，会员期内新增课程也会自动解锁。'
                  : 'Active members can access all published courses and newly added courses during the membership period.'}
              </p>
            </div>
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="font-bold text-lg mb-2 text-gray-900">
                {i18n.language === 'zh' ? '标准会员有购物折扣吗？' : 'Does Standard include shopping discounts?'}
              </h3>
              <p className="text-gray-700">
                {i18n.language === 'zh'
                  ? '标准会员不包含购物折扣。尊享会员可享受 9 折购物优惠。'
                  : 'Standard does not include shopping discounts. Premium members receive a 10% shopping discount.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Membership
