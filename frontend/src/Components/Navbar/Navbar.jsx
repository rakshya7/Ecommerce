import React, { useContext } from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
import { CATEGORIES } from '../../catalog'
import Icon from '../Icon/Icon'

const Navbar = () => {
    const { getTotalCartItems } = useContext(ShopContext)
    const cartCount = getTotalCartItems()

    return (
        <header className='navbar'>
            <div className='container navbar-inner'>
                <Link to='/' className='brand' aria-label='StepStyle home'>
                    <img src={logo} alt='' className='brand-mark' />
                    <span className='brand-name'>StepStyle</span>
                </Link>

                {/* NavLink marks the current page itself, so the highlight survives a refresh */}
                <nav className='navbar-links' aria-label='Shop'>
                    {CATEGORIES.map((category) => (
                        <NavLink key={category.key} to={category.path}>
                            {category.label}
                        </NavLink>
                    ))}
                </nav>

                <div className='navbar-actions'>
                    {localStorage.getItem('auth-token') ?
                        <button type='button' className='navbar-account' onClick={()=>{
                            localStorage.removeItem('auth-token');
                            window.location.replace('/')
                        }}>
                            Log out
                        </button>
                        :
                        <Link to='/login' className='navbar-account'>Log in</Link>
                    }

                    <Link
                        to='/cart'
                        className='navbar-cart'
                        aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
                    >
                        <Icon name='cart' size={22} />
                        {cartCount > 0 && <span className='navbar-cart-count'>{cartCount}</span>}
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default Navbar
