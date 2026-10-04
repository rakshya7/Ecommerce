import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import './CSS/Shop.css'
import Hero from '../Components/Hero/Hero'
import Popular from '../Components/Popular/Popular'
import Offers from '../Components/Offers/Offers'
import NewCollection from '../Components/NewCollection/NewCollection'
import NewsLetter from '../Components/NewsLetter/NewsLetter'
import Icon from '../Components/Icon/Icon'
import { LoadError } from '../Components/EmptyState/EmptyState'
import { ShopContext } from '../Context/ShopContext'
import { CATEGORIES } from '../catalog'

const Shop = () => {
  const { all_product, productsStatus } = useContext(ShopContext)

  return (
    <div>
        <Hero/>

        <div className='container'>
          <nav className='category-index' aria-label='Shop by category'>
            {CATEGORIES.map((category) => {
              const count = all_product.filter((product) => product.category === category.key).length
              return (
                <Link key={category.key} to={category.path} className='category-index-link'>
                  <span className='category-index-name display'>{category.label}</span>
                  {count > 0 && (
                    <span className='category-index-count'>{count} {count === 1 ? 'style' : 'styles'}</span>
                  )}
                  <Icon name='arrow' size={22} />
                </Link>
              )
            })}
          </nav>
        </div>

        {productsStatus === 'error' && <LoadError heading='h2' />}
        <Popular />
        <Offers />
        <NewCollection />
        <NewsLetter />
    </div>
  )
}

export default Shop
