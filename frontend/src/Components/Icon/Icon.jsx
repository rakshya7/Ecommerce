import React from 'react'

// 24px line icons. Colour follows the surrounding text.
const paths = {
  cart: (
    <>
      <path d="M3 4h2.3l2.2 11.1a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20.5 8H6.4" />
      <circle cx="9.5" cy="19.6" r="1.2" />
      <circle cx="17.5" cy="19.6" r="1.2" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.4v.1" />
    </>
  ),
  minus: <path d="M5 12h14" />,
  plus: <path d="M12 5v14M5 12h14" />,
}

const Icon = ({ name, size = 20 }) => (
  <svg
    className='icon'
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {paths[name]}
  </svg>
)

export default Icon
