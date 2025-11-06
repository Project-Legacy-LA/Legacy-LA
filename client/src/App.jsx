import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import ClientSignUp from './components/ClientSignUp'
import AttorneySignUp from './components/AttorneySignUp'
import AttorneyLogin from './components/AttorneyLogin'
import HomePage from './components/HomePage'
import AboutYou from './components/AboutYouComprehensive'
import Assets from './components/Assets'
import Liabilities from './components/Liabilities'
import DecisionMakers from './components/DecisionMakers'
import Advisors from './components/Advisors'
import Documents from './components/Documents'
import SpouseAccessManager from './components/SpouseAccessManager'
import AcceptInvite from './components/AcceptInvite'
import Navigation from './components/Navigation'
import Breadcrumb from './components/Breadcrumb'
import { PeopleProvider } from './contexts/PeopleContext'
import { AssetsProvider } from './contexts/AssetsContext'
import { AuthProvider } from './contexts/AuthContext'
import AttorneyClientSelector from './components/AttorneyClientSelector'
import AttorneyClientView from './components/AttorneyClientView'
import ProtectedRoute from './components/ProtectedRoute'
import RoleLanding from './components/RoleLanding'
import SuperuserInviteAttorney from './components/SuperuserInviteAttorney'
import AttorneyInviteClient from './components/AttorneyInviteClient'

const App = () => {
  return (
    <AuthProvider>
      <PeopleProvider>
        <AssetsProvider>
          <Router>
            <div className="min-h-screen bg-white">
              <Navigation />
              <Routes>
                <Route path="/" element={<ProtectedRoute><><Breadcrumb /><HomePage /></></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><RoleLanding /></ProtectedRoute>} />
                <Route path="/about-you" element={<ProtectedRoute><><Breadcrumb /><AboutYou /></></ProtectedRoute>} />
                <Route path="/assets" element={<ProtectedRoute><><Breadcrumb /><Assets /></></ProtectedRoute>} />
                <Route path="/liabilities" element={<ProtectedRoute><><Breadcrumb /><Liabilities /></></ProtectedRoute>} />
                <Route path="/decision-makers" element={<ProtectedRoute><><Breadcrumb /><DecisionMakers /></></ProtectedRoute>} />
                <Route path="/advisors" element={<ProtectedRoute><><Breadcrumb /><Advisors /></></ProtectedRoute>} />
                <Route path="/documents" element={<ProtectedRoute><><Breadcrumb /><Documents /></></ProtectedRoute>} />
                <Route path="/spouse-access" element={<ProtectedRoute><><Breadcrumb /><SpouseAccessManager /></></ProtectedRoute>} />
                <Route path="/login" element={<><Breadcrumb /><Login /></>} />
                <Route path="/attorney-login" element={<><Breadcrumb /><AttorneyLogin /></>} />
                <Route path="/client-signup" element={<><Breadcrumb /><ClientSignUp /></>} />
                <Route path="/attorney-signup" element={<><Breadcrumb /><AttorneySignUp /></>} />
                <Route path="/accept-invite" element={<AcceptInvite />} />
                <Route
                  path="/superuser/invite-attorney"
                  element={<ProtectedRoute requireSuperuser><><Breadcrumb /><SuperuserInviteAttorney /></></ProtectedRoute>}
                />
                <Route
                  path="/attorney/invite-client"
                  element={<ProtectedRoute requireRoles={['attorney_owner']}><><Breadcrumb /><AttorneyInviteClient /></></ProtectedRoute>}
                />
                <Route
                  path="/attorney"
                  element={<ProtectedRoute requireRoles={['attorney_owner']}><><Breadcrumb /><AttorneyClientSelector /></></ProtectedRoute>}
                />
                <Route
                  path="/attorney/client/:id"
                  element={<ProtectedRoute requireRoles={['attorney_owner']}><><Breadcrumb /><AttorneyClientView /></></ProtectedRoute>}
                />
              </Routes>
            </div>
          </Router>
        </AssetsProvider>
      </PeopleProvider>
    </AuthProvider>
  )
}

export default App
