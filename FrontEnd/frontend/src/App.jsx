import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from './components/Navbar'
import Signup from './routes/signup'
import Login from './routes/login'
import Home from './routes/home'
import AdminRoute from './routes/AdminRoute'
import AdminDashboard from './Admin/dashboard'
import AdminProductsList from './Admin/productlist'
import AdminOrderList from './Admin/orderList'
import Cart from './routes/cartRoute'
import Order from "./routes/order"

function App() {


  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/cart'element={<Cart/>}/>
        <Route path='/orders' element={<Order/>}/>

        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
          <Route path="/admin/products" element={<AdminProductsList/>}/>
          <Route path="/admin/orders" element={<AdminOrderList/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
