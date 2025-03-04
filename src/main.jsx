import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Homepage from './Pages/Homepage.jsx'
import Aboutus from './Pages/Aboutus.jsx'
import UnboxingPolicy from './Pages/UnboxingPolicy.jsx'
import Disclaimer from './Pages/Disclaimer.jsx'
import Contact from './Pages/Contact.jsx'
import SignIn from './Pages/Signin.jsx'
import SignUp from './Pages/Signup.jsx'
import Television from './Components/Television.jsx'
import News from './Components/News.jsx'
import SingleNews from './Components/SingleNews.jsx'
import TelevisionSinglePage from './Components/TelevisionSinglepage.jsx'
import TermsCondition from './Pages/TermsCondition.jsx'
import PrivacyPolicy from './Pages/PrivacyPolicy.jsx'
import ShippingPolicy from './Pages/ShippingPolicy.jsx'
import AdminLogin from './Components/AdminDashboardComponents/AdminLogin.jsx'
import AdminDashboard from './Components/AdminDashboardComponents/AdminDashboard.jsx'
import Admin from './Admin.jsx'
import AddProduct from './Components/AdminDashboardComponents/ProductsRelatedComponents/AddProduct.jsx'
import { ToastContainer } from 'react-toastify'
import NotFound from './Pages/ErrorPage.jsx'
import AllProducts from './Components/AdminDashboardComponents/ProductsRelatedComponents/AllProducts.jsx'
import AllOrders from './Components/AdminDashboardComponents/OrdersRelatedComponents/AllOrders.jsx'
import 'react-toastify/dist/ReactToastify.css';
import DiscountCoupon from './Components/AdminDashboardComponents/DiscountCoupan/DiscountCoupon.jsx'
import InventoryManagement from './Components/AdminDashboardComponents/InventoryManagement/Inventory.jsx'
import MyCart from './Pages/MyCart.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path='/' element={<Homepage />} />
        <Route path='/about' element={<Aboutus />} />
        <Route path='/unboxing-policy' element={<UnboxingPolicy />} />
        <Route path='/disclaimer' element={<Disclaimer />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/cart' element={<MyCart />} />
        <Route path='/televisions' element={<Television />} />
        <Route path="/television/:id" element={<TelevisionSinglePage />} />
        <Route path="/news-media" element={<News />} />
        <Route path="/news-media/:id" element={<SingleNews />} />
        <Route path="/terms-conditions" element={<TermsCondition />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path='/admin-login' element={<AdminLogin />} />
        {/* Admin Dashboard Route */}
        <Route path='/admin-dashboard' element={<Admin />}>
          <Route path='/admin-dashboard' element={<AdminDashboard />} />
          <Route path='/admin-dashboard/addproduct' element={<AddProduct />} />
          <Route path='/admin-dashboard/allproduct' element={<AllProducts />} />
          <Route path='/admin-dashboard/orders' element={<AllOrders />} />
          <Route path='/admin-dashboard/coupon' element={<DiscountCoupon />} />
          <Route path='/admin-dashboard/inventory' element={<InventoryManagement />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />

    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer />
    <RouterProvider router={router} />
  </StrictMode>,
)
