import "./admin.css"
import Sidebar from '../../Components/Sidebar/Sidebar'
import {Routes,Route,Navigate} from 'react-router-dom'
import AddProduct from '../../Components/AddProduct/AddProduct'
import ListProduct from '../../Components/ListProduct/ListProduct'

const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar/>
      <main className='admin-main'>
        <Routes>
          <Route path='/addproduct' element={<AddProduct/>}/>
          <Route path='/listproduct' element={<ListProduct/>}/>
          {/* the product list is home; unknown URLs land there too */}
          <Route path='*' element={<Navigate to='/listproduct' replace />}/>
        </Routes>
      </main>
    </div>
  )
}

export default Admin
