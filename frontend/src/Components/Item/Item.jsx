import React from 'react';
import './Item.css';
import { Link } from 'react-router-dom'
import { CATEGORIES, discountOf, formatPrice } from '../../catalog'

// `category` is optional: pass it where a grid mixes categories.
const Item = (props) => {
  const discount = discountOf(props)
  const category = CATEGORIES.find((c) => c.key === props.category)

  return (
    <Link to={`/product/${props.id}`} className='item'>
      <div className='item-media'>
        <img src={props.image} alt='' loading='lazy' />
      </div>
      <h3 className='item-name'>{props.name}</h3>
      {category && <p className='item-category'>{category.label}</p>}
      <p className='price'>
        <span className='price-now'>{formatPrice(props.new_price)}</span>
        {discount > 0 && (
          <>
            <s className='price-was'>
              <span className='visually-hidden'>Was </span>
              {formatPrice(props.old_price)}
            </s>
            <span className='price-off'>−{discount}%</span>
          </>
        )}
      </p>
    </Link>
  );
};

export const ItemGridSkeleton = ({ count = 4, className = 'product-grid' }) => (
  <div className={className} aria-hidden='true'>
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className='item'>
        <div className='item-media skeleton' />
        <div className='item-skeleton-line skeleton' />
        <div className='item-skeleton-line item-skeleton-line--short skeleton' />
      </div>
    ))}
  </div>
)

export default Item;
