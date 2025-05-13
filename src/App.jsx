import React from "react"
import Header from "./Components/Header"
import { Outlet } from "react-router-dom"
import Footer from "./Components/Footer"
import ScrollToTop from './Components/ScrollToTop.jsx'
import { GoogleAnalytics } from "./utils/Ga4.jsx"

function App() {

  return (
    <>
      <GoogleAnalytics trackingId='G-5FW6Z2SZGF' />
      <Header />
      <ScrollToTop />
      <Outlet />
      <Footer />
    </>
  )
}

export default App
