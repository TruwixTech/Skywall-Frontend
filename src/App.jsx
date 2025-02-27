import React from "react"
import Header from "./Components/Header"
import { Outlet } from "react-router-dom"
import Footer from "./Components/Footer"
import ScrollToTop from './Components/ScrollToTop.jsx'

function App() {

  return (
    <>
      <Header />
      <ScrollToTop/>
      <Outlet />
      <Footer />
    </>
  )
}

export default App
