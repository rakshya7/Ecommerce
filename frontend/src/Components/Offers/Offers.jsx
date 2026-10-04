import React, { useContext } from 'react'
import './Offers.css'
import { Link } from 'react-router-dom'
import exclusive_image from '../Assets/exclusive_image.png'
import { ShopContext } from '../../Context/ShopContext'
import { discountOf } from '../../catalog'

const Offers = () => {
  const { all_product } = useContext(ShopContext)

  // The headline is the real best discount in the women's range, so the band
  // only appears while there is an offer to shop.
  const bestDiscount = Math.max(
    0,
    ...all_product.filter((product) => product.category === 'women').map(discountOf)
  )
  if (bestDiscount === 0) return null

  return (
    <section className='offers'>
        <div className='container offers-inner'>
            <div className='offers-copy'>
                <h2 className='offers-title display'>Up to {bestDiscount}% off women’s styles</h2>
                <p className='offers-text'>Offer prices are already applied. No code needed.</p>
                <Link to='/womens?sort=discount' className='btn btn--inverse'>Shop women’s offers</Link>
            </div>
            <img src={exclusive_image} alt='' className='offers-image' loading='lazy' />
        </div>
    </section>
  )
}

export default Offers
