import React from 'react'
import { useLocation } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import Navbar from './components/common/Navbar'
import Login from './components/login/Login'

function App() {
  const location = useLocation()
  const hideNavbarRoutes = ['/l1form','/feedbackform', '/login']

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <AppRoutes />
    </>
  )
}

export default App
