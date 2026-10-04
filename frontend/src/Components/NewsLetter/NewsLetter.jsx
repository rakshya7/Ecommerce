import React, { useState } from 'react'
import './NewsLetter.css'
import Icon from '../Icon/Icon'

const NewsLetter = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      // Simulate subscription success
      setIsSubscribed(true)
      setEmail('')
      // In real app, you would make an API call here
      console.log('Subscribed with email:', email)
    }
  }

  return (
    <section className='container'>
      <div className='newsletter'>
        <div>
          <h2 className='newsletter-title'>New arrivals and offers, by email</h2>
          <p className='newsletter-text'>Unsubscribe at any time.</p>
        </div>

        {isSubscribed ? (
          <p className='notice notice--success' role='status'>
            <Icon name='check' />
            Thanks, you’re on the list.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className='newsletter-form'>
            <label htmlFor='newsletter-email' className='visually-hidden'>Email address</label>
            <input
              id='newsletter-email'
              type="email"
              placeholder='Email address'
              autoComplete='email'
              className='input'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type='submit' className='btn btn--primary'>Subscribe</button>
          </form>
        )}
      </div>
    </section>
  )
}

export default NewsLetter
