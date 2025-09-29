import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import ClientSignUp from './components/ClientSignUp'
import AttorneySignUp from './components/AttorneySignUp'
import AttorneyLogin from './components/AttorneyLogin'
import HomePage from './components/HomePage'
import AboutYou from './components/AboutYouComprehensive'
import Children from './components/Children'
import Advisors from './components/Advisors'
import Assets from './components/Assets'
import Beneficiaries from './components/Beneficiaries'
import DecisionMakers from './components/DecisionMakers'
import ContactDetails from './components/ContactDetails'
import Documents from './components/Documents'
import Navigation from './components/Navigation'
import SmallNavigation from './components/SmallNavigation'
import Breadcrumb from './components/Breadcrumb'

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <SmallNavigation />
        <Navigation />
        <Routes>
          <Route path="/" element={<><Breadcrumb /><HomePage /></>} />
          <Route path="/about-you" element={<><Breadcrumb /><AboutYou /></>} />
          <Route path="/children" element={<><Breadcrumb /><Children /></>} />
          <Route path="/advisors" element={<><Breadcrumb /><Advisors /></>} />
          <Route path="/assets" element={<><Breadcrumb /><Assets /></>} />
          <Route path="/beneficiaries" element={<><Breadcrumb /><Beneficiaries /></>} />
          <Route path="/decisionmakers" element={<><Breadcrumb /><DecisionMakers /></>} />
          <Route path="/contact-details" element={<><Breadcrumb /><ContactDetails /></>} />
          <Route path="/documents" element={<><Breadcrumb /><Documents /></>} />
          <Route path="/login" element={<><Breadcrumb /><Login /></>} />
          <Route path="/attorney-login" element={<><Breadcrumb /><AttorneyLogin /></>} />
          <Route path="/client-signup" element={<><Breadcrumb /><ClientSignUp /></>} />
          <Route path="/attorney-signup" element={<><Breadcrumb /><AttorneySignUp /></>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;