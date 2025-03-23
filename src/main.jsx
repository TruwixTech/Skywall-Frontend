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
import MyOrders from './Components/UsersComponents/MyOrders.jsx'
import UserProfile from './Components/UsersComponents/UserProfile.jsx'
import RaiseComplaint from './Components/UsersComponents/RaiseComplaint.jsx'
import CheckoutPage from './Pages/CheckoutPage.jsx'
import AllComplaintRaised from './Components/AdminDashboardComponents/ComplaintRaisedComponents/AllComplaintRaised.jsx'
import WholesaleProducts from './Components/AdminDashboardComponents/WholesaleProducts/WholesaleProducts.jsx'
import WholesaleBulkOrders from './Pages/WholesaleBulkOrders.jsx'
import WholesaleBulkProductsOrders from './Components/AdminDashboardComponents/WholesaleBulkOrders/WholesaleBulkOrders.jsx'
import AreaOfServices from './Components/AdminDashboardComponents/AreaOfServices/AreaOfServices.jsx'
import Invoice from './Components/AdminDashboardComponents/InvoiceComponents/Invoice.jsx'
import MyInvoices from './Components/UsersComponents/MyInvoices.jsx'
import ReturnRequest from './Components/AdminDashboardComponents/ReturnRequestComponents/ReturnRequest.jsx'
import ForgotPassword from './Pages/ForgotPassword.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path='/' element={<Homepage />} />
        <Route path='/about' element={<Aboutus />} />
        <Route path='/raise-complaint' element={<RaiseComplaint />} />
        <Route path='/user-profile' element={<UserProfile />} />
        <Route path='/myorders' element={<MyOrders />} />
        <Route path='/checkout' element={<CheckoutPage />} />
        <Route path='/unboxing-policy' element={<UnboxingPolicy />} />
        <Route path='/disclaimer' element={<Disclaimer />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/cart' element={<MyCart />} />
        <Route path='/televisions' element={<Television />} />
        <Route path="/television/:id" element={<TelevisionSinglePage />} />
        <Route path="/news-media" element={<News />} />
        <Route path="/news-media/:id" element={<SingleNews />} />
        <Route path="/terms-conditions" element={<TermsCondition />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/wholesale-bulk-products" element={<WholesaleBulkOrders />} />
        <Route path='/my-invoices' element={<MyInvoices />} />

        <Route path='/admin-login' element={<AdminLogin />} />
        {/* Admin Dashboard Route */}
        <Route path='/admin-dashboard' element={<Admin />}>
          <Route path='/admin-dashboard' element={<AdminDashboard />} />
          <Route path='/admin-dashboard/addproduct' element={<AddProduct />} />
          <Route path='/admin-dashboard/allproduct' element={<AllProducts />} />
          <Route path='/admin-dashboard/orders' element={<AllOrders />} />
          <Route path='/admin-dashboard/coupon' element={<DiscountCoupon />} />
          <Route path='/admin-dashboard/inventory' element={<InventoryManagement />} />
          <Route path='/admin-dashboard/complaints' element={<AllComplaintRaised />} />
          <Route path='/admin-dashboard/wholesale' element={<WholesaleProducts />} />
          <Route path='/admin-dashboard/wholesale-bulk-orders' element={<WholesaleBulkProductsOrders />} />
          <Route path='/admin-dashboard/invoices' element={<Invoice />} />
          <Route path='/admin-dashboard/return-requests' element={<ReturnRequest />} />
          <Route path='/admin-dashboard/area-of-services' element={<AreaOfServices />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />

    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
     />
    <RouterProvider router={router} />
  </StrictMode>,
)
