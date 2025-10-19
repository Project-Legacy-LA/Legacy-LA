import React from 'react'
import { useNavigate } from 'react-router-dom'
import LL_Logo from '../assets/images/LL_Logo.webp'

export default function Navbar({ userEmail = "aryashrestha005@gmail.com" }) {
  const navigate = useNavigate()

  const handleLogoClick = () => {
    navigate('/')
  }

  return (
    <div className="shadow-lg border-b border-gray-200 bg-gray-200">
      <div className="h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo Only - Clickable */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <button 
                  onClick={handleLogoClick}
                  className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg p-1 transition-all duration-200 hover:opacity-80"
                >
                  <img 
                    src={LL_Logo} 
                    alt="Legacy Louisiana" 
                    className="h-12 w-auto sm:h-16 md:h-20 lg:h-24 xl:h-28 object-contain" 
                  />
                </button>
              </div>
            </div>

            {/* User Account / Login */}
            <div className="flex items-center">
              {userEmail ? (
                <div className="relative">
                  <button className="flex items-center text-sm sm:text-base lg:text-lg text-gray-800 hover:text-gray-600 focus:outline-none transition-colors duration-200">
                    <span className="mr-2 sm:mr-3 font-medium text-xs sm:text-sm lg:text-base truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-none">
                      {userEmail}
                    </span>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
