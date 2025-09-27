import React, { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import LL_Logo from '../assets/images/LL_Logo.webp'

export default function Navigation({ userEmail = "aryashrestha005@gmail.com" }) {
  const navigate = useNavigate()
  const navRef = useRef(null)
  const logoRef = useRef(null)
  const userRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline()
    
    // Simple fade-in animation
    tl.fromTo(navRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "none" }
    )
  }, [])

  const handleLogoClick = () => {
    navigate('/')
  }

  return (
    <div ref={navRef} className="shadow-lg border-b border-gray-200" style={{ backgroundColor: '#2A2829' }}>
      <div className="h-24 sm:h-28 md:h-32 lg:h-36 xl:h-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo Only - Clickable */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <button
                  ref={logoRef}
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

            {/* User Account */}
            <div ref={userRef} className="flex items-center">
              <div className="relative">
                <button className="flex items-center text-sm sm:text-base lg:text-lg text-white hover:text-gray-300 focus:outline-none transition-colors duration-200">
                  <span className="mr-2 sm:mr-3 font-medium text-xs sm:text-sm lg:text-base truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-none">
                    {userEmail}
                  </span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
