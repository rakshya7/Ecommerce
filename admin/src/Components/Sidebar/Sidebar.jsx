import './Sidebar.css'
import {Link,NavLink} from 'react-router-dom'
import logo from '../../assets/logo.png'
import Icon from '../Icon/Icon'
import { STORE_URL } from '../../lib'

const Sidebar = () => {
  return (
    <aside className='sidebar'>
      <Link to='/listproduct' className='brand sidebar-brand' aria-label='StepStyle admin, products'>
        <img src={logo} alt="" className='brand-mark' />
        <span className='brand-name'>
          StepStyle <span className='brand-tag'>Admin</span>
        </span>
      </Link>

      <nav className='sidebar-nav' aria-label='Admin'>
        <NavLink to='/listproduct' className='sidebar-item'>
          <Icon name='box' />
          Products
        </NavLink>
        <NavLink to='/addproduct' className='sidebar-item'>
          <Icon name='plus' />
          Add product
        </NavLink>
      </nav>

      <a href={STORE_URL} target='_blank' rel='noreferrer' className='sidebar-item sidebar-store'>
        <Icon name='external' />
        View store
      </a>
    </aside>
  )
}

export default Sidebar
