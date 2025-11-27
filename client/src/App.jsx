import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Layout Components
import Navigation from './components/layout/Navigation'
import Breadcrumb from './components/layout/Breadcrumb'

// Auth Components
import Login from './components/auth/Login'
import ClientSignUp from './components/auth/ClientSignUp'
import AttorneySignUp from './components/auth/AttorneySignUp'
import AttorneyLogin from './components/auth/AttorneyLogin'
import AcceptInvite from './components/auth/AcceptInvite'

// Pages
import HomePage from './components/pages/HomePage'
import Report from './components/pages/Report'

// Estate Planning Components (Path 1)
import AboutYou from './components/path1-estate-planning/AboutYouComprehensive'
import Assets from './components/path1-estate-planning/Assets'
import Liabilities from './components/path1-estate-planning/Liabilities'
import DecisionMakers from './components/path1-estate-planning/DecisionMakers'
import Advisors from './components/path1-estate-planning/Advisors'
import Documents from './components/path1-estate-planning/Documents'
import SpouseAccessManager from './components/path1-estate-planning/SpouseAccessManager'

// Succession Components (Path 2)
import SuccessionHomePage from './components/path2-succession/SuccessionHomePage'
import SuccessionAboutYou from './components/path2-succession/SuccessionAboutYou'
import SuccessionAssets from './components/path2-succession/SuccessionAssets'
import SuccessionLiabilities from './components/path2-succession/SuccessionLiabilities'
import SuccessionRoles from './components/path2-succession/SuccessionRoles'
import SuccessionAdvisors from './components/path2-succession/SuccessionAdvisors'
import SuccessionDocuments from './components/path2-succession/SuccessionDocuments'
import SuccessionCoExecutorAccess from './components/path2-succession/SuccessionCoExecutorAccess'
import SuccessionConcerns from './components/path2-succession/SuccessionConcerns'

// Attorney Components
import AttorneyClientSelector from './components/attorney/AttorneyClientSelector'
import AttorneyClientView from './components/attorney/AttorneyClientView'
import AttorneyInviteClient from './components/attorney/AttorneyInviteClient'
import SuperuserInviteAttorney from './components/attorney/SuperuserInviteAttorney'

// Contexts
import { PeopleProvider } from './contexts/PeopleContext'
import { AssetsProvider } from './contexts/AssetsContext'
import { AuthProvider } from './contexts/AuthContext'

const App = () => {
  return (
    <AuthProvider>
      <PeopleProvider>
        <AssetsProvider>
          <Router>
            <div className="min-h-screen bg-white">
              <Navigation />
              <Routes>
            <Route path="/" element={<><Breadcrumb /><HomePage /></>} />
            <Route path="/about-you" element={<><Breadcrumb /><AboutYou /></>} />
            <Route path="/assets" element={<><Breadcrumb /><Assets /></>} />
            <Route path="/liabilities" element={<><Breadcrumb /><Liabilities /></>} />
            <Route path="/decision-makers" element={<><Breadcrumb /><DecisionMakers /></>} />
            <Route path="/advisors" element={<><Breadcrumb /><Advisors /></>} />
            <Route path="/documents" element={<><Breadcrumb /><Documents /></>} />
            <Route path="/spouse-access" element={<><Breadcrumb /><SpouseAccessManager /></>} />
            <Route path="/accept-invite" element={<AcceptInvite />} />
            <Route path="/login" element={<><Breadcrumb /><Login /></>} />
            <Route path="/attorney-login" element={<><Breadcrumb /><AttorneyLogin /></>} />
            <Route path="/client-signup" element={<><Breadcrumb /><ClientSignUp /></>} />
            <Route path="/attorney-signup" element={<><Breadcrumb /><AttorneySignUp /></>} />
            <Route path="/superuser/invite-attorney" element={<><Breadcrumb /><SuperuserInviteAttorney /></>} />
            <Route path="/attorney/invite-client" element={<><Breadcrumb /><AttorneyInviteClient /></>} />
            <Route path="/attorney" element={<><Breadcrumb /><AttorneyClientSelector /></>} />
            <Route path="/attorney/client/:id" element={<><Breadcrumb /><AttorneyClientView /></>} />
            <Route path="/report" element={<><Breadcrumb /><Report /></>} />
            {/* Succession Path Routes */}
            <Route path="/succession" element={<><Breadcrumb /><SuccessionHomePage /></>} />
            <Route path="/succession/about-you" element={<><Breadcrumb /><SuccessionAboutYou /></>} />
            <Route path="/succession/assets" element={<><Breadcrumb /><SuccessionAssets /></>} />
            <Route path="/succession/liabilities" element={<><Breadcrumb /><SuccessionLiabilities /></>} />
            <Route path="/succession/roles" element={<><Breadcrumb /><SuccessionRoles /></>} />
            <Route path="/succession/advisors" element={<><Breadcrumb /><SuccessionAdvisors /></>} />
            <Route path="/succession/documents" element={<><Breadcrumb /><SuccessionDocuments /></>} />
            <Route path="/succession/co-executor-access" element={<><Breadcrumb /><SuccessionCoExecutorAccess /></>} />
            <Route path="/succession/concerns" element={<><Breadcrumb /><SuccessionConcerns /></>} />
            </Routes>
            </div>
          </Router>
        </AssetsProvider>
      </PeopleProvider>
    </AuthProvider>
  )
}

export default App
