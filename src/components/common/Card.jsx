function Card({ children, className = '', hover = true }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-soft overflow-hidden ${
        hover ? 'card-hover' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
