import { useTranslation } from 'react-i18next'

function ListBlock({ block }) {
  const { i18n } = useTranslation()
  const ListTag = block.ordered ? 'ol' : 'ul'
  const listClass = block.ordered
    ? 'list-decimal list-inside space-y-2 mb-6 ml-4'
    : 'list-disc list-inside space-y-2 mb-6 ml-4'

  return (
    <ListTag className={listClass}>
      {block.items.map((item, index) => {
        const text = i18n.language === 'zh' ? item.content : item.contentEn
        return (
          <li key={index} className="text-gray-700 leading-relaxed">
            {text}
          </li>
        )
      })}
    </ListTag>
  )
}

export default ListBlock
