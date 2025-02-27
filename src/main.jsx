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
        <Route path='/televisions' element={<Television/>} />
        <Route path="/news-media" element={<News />} />
        <Route path="/news-media/:id" element={<SingleNews />} />
      </Route>
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
