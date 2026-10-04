import React from 'react'

// Shared block for empty, not-found and error states.
// Pass heading='h2' when the page already has its own h1.
const EmptyState = ({ title, text, children, heading: Heading = 'h1' }) => (
  <div className='empty'>
    <Heading className='empty-title'>{title}</Heading>
    {text && <p className='empty-text'>{text}</p>}
    {children && <div className='empty-actions'>{children}</div>}
  </div>
)

export const LoadError = ({ heading }) => (
  <EmptyState
    heading={heading}
    title="We couldn’t load products"
    text='Check your connection and try again.'
  >
    <button type='button' className='btn btn--secondary' onClick={() => window.location.reload()}>
      Try again
    </button>
  </EmptyState>
)

export default EmptyState
