import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import "./ProductDisplay.css"
import { ShopContext } from '../../Context/ShopContext'
import DescriptionBox, { SIZE_CHARTS } from '../DescriptionBox/DescriptionBox'
import Icon from '../Icon/Icon'
import { discountOf, formatPrice } from '../../catalog'

const shoeSizes = ['US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12']

const openSizeGuide = () => {
    const guide = document.getElementById('size-guide')
    if (guide) guide.open = true
}

const ProductDisplay = (props) => {
    const { product } = props
    const { addToCart, cartItems } = useContext(ShopContext)
    const [selectedSize, setSelectedSize] = useState('')
    const [sizeMissing, setSizeMissing] = useState(false)
    const discount = discountOf(product)
    const inCart = cartItems[product.id] || 0

    const handleAddToCart = () => {
        if (!selectedSize) {
            setSizeMissing(true)
            return
        }
        addToCart(product.id, selectedSize)
    }

    return (
        <div className='productdisplay'>
            <div className="productdisplay-media">
                <img src={product.image} alt={product.name} />
            </div>

            <div className="productdisplay-info">
                <h1 className="productdisplay-name">{product.name}</h1>

                <p className="price productdisplay-price">
                    <span className="price-now">{formatPrice(product.new_price)}</span>
                    {discount > 0 && (
                        <>
                            <s className="price-was">
                                <span className="visually-hidden">Was </span>
                                {formatPrice(product.old_price)}
                            </s>
                            <span className="price-off">−{discount}%</span>
                        </>
                    )}
                </p>

                <div className="productdisplay-sizes-head">
                    <span id="size-label" className="label">Select size</span>
                    {SIZE_CHARTS[product.category] && (
                        <a href="#size-guide" className="link" onClick={openSizeGuide}>Size guide</a>
                    )}
                </div>
                {/* native radios: arrow keys move between sizes */}
                <div
                    className="size-grid"
                    role="radiogroup"
                    aria-labelledby="size-label"
                    aria-describedby={sizeMissing ? 'size-error' : undefined}
                >
                    {shoeSizes.map((size) => {
                        const [system, number] = size.split(' ')
                        return (
                            <label key={size} className="size-option">
                                <input
                                    type="radio"
                                    name="size"
                                    value={size}
                                    className="visually-hidden"
                                    checked={selectedSize === size}
                                    onChange={() => {
                                        setSelectedSize(size)
                                        setSizeMissing(false)
                                    }}
                                />
                                <span className="size-cell">
                                    <small>{system}</small> {number}
                                </span>
                            </label>
                        )
                    })}
                </div>
                {sizeMissing && (
                    <p id="size-error" className="field-error productdisplay-size-error" role="alert">
                        Select a size to add this to your cart.
                    </p>
                )}

                <button type="button" className="btn btn--primary btn--block productdisplay-add" onClick={handleAddToCart}>
                    Add to cart
                </button>

                {inCart > 0 && (
                    <p className="notice notice--success productdisplay-added" role="status">
                        <Icon name="check" />
                        <span>{inCart} in your cart. <Link to="/cart">View cart</Link></span>
                    </p>
                )}

                <p className="hint productdisplay-assurance">
                    Free shipping. 30-day returns. Free size exchange.
                </p>

                <DescriptionBox product={product} />
            </div>
        </div>
    )
}

export const ProductDisplaySkeleton = () => (
    <div className="container productdisplay productdisplay--loading" aria-busy="true" aria-label="Loading product">
        <div className="productdisplay-media skeleton" />
        <div className="productdisplay-info">
            <div className="skeleton productdisplay-skeleton-title" />
            <div className="skeleton productdisplay-skeleton-line" />
            <div className="skeleton productdisplay-skeleton-block" />
        </div>
    </div>
)

export default ProductDisplay
