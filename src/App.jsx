import React from 'react'
import { useLocation } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import Navbar from './components/common/Navbar'

function App() {
  const location = useLocation()
  const hideNavbarRoutes = ['/l1form']

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <AppRoutes />
    </>
  )
}

export default App
