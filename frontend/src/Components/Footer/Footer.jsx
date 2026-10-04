import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom'
import footer_logo from '../Assets/logo_big.png'
import { CATEGORIES } from '../../catalog'

const Footer = () => {
  return (
    <footer className='footer'>
        <div className='container footer-inner'>
          <div className='footer-brand'>
            <Link to='/' className='brand' aria-label='StepStyle home'>
                <img src={footer_logo} alt='' className='brand-mark' />
                <span className='brand-name'>StepStyle</span>
            </Link>
            <p className='footer-tagline'>Step into style, walk in comfort.</p>
          </div>

          <nav className='footer-nav' aria-label='Footer'>
            <div>
              <h2 className='footer-heading'>Shop</h2>
              <ul className='footer-links'>
                {CATEGORIES.map((category) => (
                  <li key={category.key}>
                    <Link to={category.path}>{category.title}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className='footer-heading'>Help</h2>
              <ul className='footer-links'>
                  <li><a href='mailto:support@stepstyle.com'>support@stepstyle.com</a></li>
              </ul>
            </div>
          </nav>
        </div>

        <div className='container'>
            <p className='footer-copyright'>© {new Date().getFullYear()} StepStyle Footwear. All rights reserved.</p>
        </div>
    </footer>
  )
}

export default Footer
