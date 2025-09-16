import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Test from '../components/Test'

function AppRoutes() {
  return (
    <>
    <Routes>
        <Route path="/" element={<Test />} />
    </Routes>
    </>
  )
}

export default AppRoutes