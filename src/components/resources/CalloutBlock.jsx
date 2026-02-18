import { useTranslation } from 'react-i18next'
import { HiInformationCircle, HiExclamation, HiLightBulb, HiCheckCircle } from 'react-icons/hi'

function CalloutBlock({ block }) {
  const { i18n } = useTranslation()
  const text = i18n.language === 'zh' ? block.content : block.contentEn

  // 根据style类型设置颜色和图标
  const styleConfig = {
    tip: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      icon: HiLightBulb,
      iconColor: 'text-blue-500'
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      icon: HiExclamation,
      iconColor: 'text-yellow-500'
    },
    info: {
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-800',
      icon: HiInformationCircle,
      iconColor: 'text-gray-500'
    },
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      icon: HiCheckCircle,
      iconColor: 'text-green-500'
    }
  }

  const config = styleConfig[block.style] || styleConfig.info
  const Icon = config.icon

  return (
    <div className={`${config.bgColor} ${config.borderColor} border-l-4 p-4 mb-6 rounded-r`}>
      <div className="flex items-start">
        <Icon className={`${config.iconColor} flex-shrink-0 w-6 h-6 mt-0.5 mr-3`} />
        <p className={`${config.textColor} leading-relaxed`}>
          {text}
        </p>
      </div>
    </div>
  )
}

export default CalloutBlock
