import { useTranslation } from 'react-i18next'

function TextBlock({ block }) {
  const { i18n } = useTranslation()
  const text = i18n.language === 'zh' ? block.content : block.contentEn

  return (
    <p className="text-gray-700 leading-relaxed mb-6">
      {text}
    </p>
  )
}

export default TextBlock
