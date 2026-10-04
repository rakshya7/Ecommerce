import React, { useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext'
import Breadcrum from '../Components/Breadcrums/Breadcrum'
import ProductDisplay, { ProductDisplaySkeleton } from '../Components/ProductDisplay/ProductDisplay'
import EmptyState, { LoadError } from '../Components/EmptyState/EmptyState'


const Product = () => {
  const { all_product, productsStatus } = useContext(ShopContext)
  const { productId } = useParams()
  const product = all_product.find((e) => e.id === Number(productId))

  // Products arrive after first render; don't report "not found" before they have.
  if (productsStatus === 'loading') return <ProductDisplaySkeleton />
  if (productsStatus === 'error') return <LoadError />

  if (!product) {
    return (
      <EmptyState
        title='Product not found'
        text="This product doesn’t exist or is no longer available."
      >
        <Link to='/' className='btn btn--primary'>Back to home</Link>
      </EmptyState>
    )
  }

  return (
    <div className='container'>
      <Breadcrum product={product}/>
      {/* keyed so the size selection resets when moving between products */}
      <ProductDisplay key={product.id} product={product}/>
    </div>
  )
}

export default Product
