import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import ClientSignUp from './components/ClientSignUp'
import AttorneySignUp from './components/AttorneySignUp'
import AttorneyLogin from './components/AttorneyLogin'
import HomePage from './components/HomePage'
import AboutYou from './components/AboutYouComprehensive'
import SpouseAccessManager from './components/SpouseAccessManager'
import EstatePlanningWizard from './components/EstatePlanningWizard'
import Navigation from './components/Navigation'
import Breadcrumb from './components/Breadcrumb'

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navigation />
        <Routes>
          <Route path="/" element={<><Breadcrumb /><HomePage /></>} />
          <Route path="/estate-wizard" element={<><Breadcrumb /><EstatePlanningWizard /></>} />
          <Route path="/spouse-access" element={<><Breadcrumb /><SpouseAccessManager /></>} />
          <Route path="/about-you" element={<><Breadcrumb /><AboutYou /></>} />
          <Route path="/login" element={<><Breadcrumb /><Login /></>} />
          <Route path="/attorney-login" element={<><Breadcrumb /><AttorneyLogin /></>} />
          <Route path="/client-signup" element={<><Breadcrumb /><ClientSignUp /></>} />
          <Route path="/attorney-signup" element={<><Breadcrumb /><AttorneySignUp /></>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
