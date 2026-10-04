import React from 'react'
import './Hero.css'
import { Link } from 'react-router-dom'
import hero_image from '../Assets/hero_image.png'

const Hero = () => {
  return (
    <section className='hero'>
        <div className='container hero-inner'>
            <div className='hero-copy'>
                <h1 className='hero-title display'>Step into the new season</h1>
                <p className='hero-text'>
                    Footwear for men, women and kids, with free shipping and 30-day returns on every order.
                </p>
                <div className='hero-actions'>
                    <a href='#new-arrivals' className='btn btn--primary'>Shop new arrivals</a>
                    <Link to='/womens' className='btn btn--secondary'>Shop women</Link>
                </div>
            </div>
            <img src={hero_image} alt="Model wearing white slip-on sneakers" className='hero-image' />
        </div>
    </section>
  )
}

export default Hero
