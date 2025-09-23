import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from '../components/login/Login'
import Dashboard from '../components/qcteam/Dashboard'
import L1Form from '../components/l1team/L1Form'
import SheetData from '../components/qcteam/SheetData'
import FeedbackForm from '../components/l1team/FeedbackForm' 
import GidSearch from '../components/qcteam/GidSearch'
import Team from '../components/qcteam/Team'
import OAuth2Redirect from '../components/login/OAuth2Redirect'
import FeedbackTable from '../components/l1team/FeedbackTable'

function AppRoutes() {
  return (
    <>
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gid" element={<GidSearch />} />
        <Route path="/l1form" element={<L1Form />} />
        <Route path="/sheetdata" element={<SheetData />} />
        <Route path="/feedbackform" element={<FeedbackForm />} />
        <Route path="/feedback" element={<FeedbackTable />} />
        <Route path="/team" element={<Team />} />
        <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
    </Routes>
    </>
  )
}

export default AppRoutes