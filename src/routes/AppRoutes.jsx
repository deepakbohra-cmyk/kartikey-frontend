import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Test from '../components/Test'
import Login from '../components/login/Login'
import Dashboard from '../components/qcteam/Dashboard'
import Home from '../components/home/Home'
import Kartikey from '../components/qcteam/Kartikey'
import L1Form from '../components/l1team/L1Form'
import SheetData from '../components/qcteam/SheetData'

function AppRoutes() {
  return (
    <>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kartikey" element={<Kartikey />} />
        <Route path="/l1form" element={<L1Form />} />
        <Route path="/sheetdata" element={<SheetData />} />
    </Routes>
    </>
  )
}

export default AppRoutes