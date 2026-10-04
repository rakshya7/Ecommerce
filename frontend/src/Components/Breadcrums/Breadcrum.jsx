import React from 'react'
import { Link } from 'react-router-dom'
import "./Breadcrum.css"
import { CATEGORIES } from '../../catalog'

const Breadcrum = (props) => {
    const {product} = props
    const category = CATEGORIES.find((c) => c.key === product.category)
  return (
    <nav className='breadcrum' aria-label='Breadcrumb'>
      <ol>
        <li><Link to='/'>Home</Link></li>
        {category && <li><Link to={category.path}>{category.label}</Link></li>}
        <li aria-current='page'>{product.name}</li>
      </ol>
    </nav>
  )
}

export default Breadcrum
