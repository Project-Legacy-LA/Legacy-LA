import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import LL_Logo from '../assets/images/LL_Logo.webp'
import { useAuth } from '../contexts/AuthContext'

export default function Navigation() {
  const navigate = useNavigate()
  const navRef = useRef(null)
  const logoRef = useRef(null)
  const { user, logout, initializing } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    const tl = gsap.timeline()
    
    // Navigation entrance animation
    tl.fromTo(navRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "none" }
    )
  }, [])

  const handleLogoClick = () => {
    navigate('/')
  }

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await logout()
      navigate('/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const homePath = '/'

  return (
    <div ref={navRef} className="shadow-lg border-b border-gray-200" style={{ backgroundColor: '#2A2829' }}>
      <div className="h-28 sm:h-32 md:h-36 lg:h-40 xl:h-44">
        <div className="max-w-7xl mx-auto px-5 sm:px-7 lg:px-9 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo Only - Clickable */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <button
                  ref={logoRef}
                  onClick={handleLogoClick}
                  className="focus:outline-none rounded-lg p-1.2 transition-all duration-200 hover:opacity-80"
                >
                  <img
                    src={LL_Logo}
                    alt="Legacy Louisiana"
                    className="h-14 w-auto sm:h-18 md:h-22 lg:h-26 xl:h-30 object-contain"
                  />
                </button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="hidden md:flex items-center space-x-2.5 lg:space-x-5">
              <button 
                onClick={() => navigate(homePath)}
                className="px-3.5 py-2.5 text-sm lg:text-base font-medium text-white hover:text-gray-300 focus:outline-none relative group transition-all duration-300"
              >
                <span className="relative">
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                </span>
              </button>
              <button 
                onClick={() => navigate('/superuser/invite-attorney')}
                className="px-3.5 py-2.5 text-sm lg:text-base font-medium text-white hover:text-gray-300 focus:outline-none relative group transition-all duration-300"
              >
                <span className="relative">
                  Invite Attorney
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                </span>
              </button>
              <button 
                onClick={() => navigate('/attorney/invite-client')}
                className="px-3.5 py-2.5 text-sm lg:text-base font-medium text-white hover:text-gray-300 focus:outline-none relative group transition-all duration-300"
              >
                <span className="relative">
                  Invite Client
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                </span>
              </button>
              <button 
                onClick={() => navigate('/attorney')}
                className="px-3.5 py-2.5 text-sm lg:text-base font-medium text-white hover:text-gray-300 focus:outline-none relative group transition-all duration-300"
              >
                <span className="relative">
                  Attorney View
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                </span>
              </button>
              {user ? (
                <div className="flex items-center space-x-3 text-white">
                  <span className="text-sm lg:text-base font-medium truncate max-w-[12rem]">
                    {user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut || initializing}
                    className="px-3.5 py-2.5 text-sm lg:text-base font-medium text-white hover:text-gray-300 focus:outline-none relative group transition-all duration-300 disabled:opacity-60"
                  >
                    <span className="relative">
                      {isLoggingOut ? 'Signing out…' : 'Logout'}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                    </span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => navigate('/login')}
                  className="px-3.5 py-2.5 text-sm lg:text-base font-medium text-white hover:text-gray-300 focus:outline-none relative group transition-all duration-300"
                >
                  <span className="relative">
                    {initializing ? 'Loading…' : 'Login'}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                  </span>
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
