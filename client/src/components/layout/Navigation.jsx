import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import LL_Logo from '../../assets/images/LL_Logo.webp'
import { useAuth } from '../../contexts/AuthContext'

export default function Navigation() {
  const navigate = useNavigate()
  const navRef = useRef(null)
  const menuRef = useRef(null)
  const { user, logout, initializing } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "none" }
    )
  }, [])

  // Animate menu open/close
  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, x: 400 },
        { opacity: 1, x: 0, duration: 0.35, ease: "power3.out" }
      )
    } else if (!isMenuOpen && menuRef.current) {
      gsap.to(menuRef.current, {
        opacity: 0,
        x: 400,
        duration: 0.25,
        ease: "power2.in"
      })
    }
  }, [isMenuOpen])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest('[data-menu-button]')
      ) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const handleLogoClick = () => {
    navigate('/')
    setIsMenuOpen(false)
  }

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await logout()
      navigate('/login')
      setIsMenuOpen(false)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleNavigation = (path) => {
    navigate(path)
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const menuItems = [
    { label: 'Path 1', path: '/' },
    { label: 'Path 2', path: '/succession' },
    { label: 'Invite Attorney', path: '/superuser/invite-attorney' },
    { label: 'Invite Client', path: '/attorney/invite-client' },
    { label: 'Attorney View', path: '/attorney' },
    { label: 'Generate Report', path: '/report' },
    { label: 'Accept Invite', path: '/accept-invite' },
  ]

  return (
    <>
      {/* Navbar Wrapper */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 shadow-lg border-b border-gray-700/30 h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36"
        style={{ backgroundColor: '#2A2829' }}
      >
        <nav ref={navRef} className="h-full">
          <div className="h-full w-full px-4 sm:px-7 lg:max-w-7xl lg:mx-auto lg:px-9">
            <div className="flex justify-between items-center h-full">

              {/* Logo */}
              <button
                onClick={handleLogoClick}
                type="button"
                className="flex items-center focus:outline-none hover:opacity-80 transition-opacity"
                style={{ backgroundColor: 'transparent', border: 'none', padding: '0.5rem' }}
              >
                <img
                  src={LL_Logo}
                  alt="Legacy Louisiana"
                  className="h-12 w-auto sm:h-14 md:h-18 lg:h-22 xl:h-26 object-contain"
                />
              </button>

              {/* Hamburger Menu Button */}
              <button
                data-menu-button
                onClick={toggleMenu}
                type="button"
                className="flex items-center justify-center focus:outline-none hover:bg-gray-700/30 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  width: '44px',
                  height: '44px',
                  border: 'none',
                  padding: '0.5rem',
                }}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1.5">
                  <span
                    className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                      isMenuOpen ? 'rotate-45 translate-y-2' : ''
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                      isMenuOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                      isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                    }`}
                  />
                </div>
              </button>

            </div>
          </div>
        </nav>
      </div>

      {/* Transparent click-outside overlay (NO BLACK BACKGROUND) */}
      {isMenuOpen && (
        <div
          className="menu-overlay fixed left-0 right-0 bottom-0 top-20 sm:top-24 md:top-28 lg:top-32 xl:top-36 bg-transparent z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Slide-out Menu */}
      <div
        ref={menuRef}
        className={`fixed right-0 top-20 sm:top-24 md:top-28 lg:top-32 xl:top-36 w-72 sm:w-80 md:w-96 h-[calc(100vh-5rem)] sm:h-[calc(100vh-6rem)] md:h-[calc(100vh-7rem)] lg:h-[calc(100vh-8rem)] xl:h-[calc(100vh-9rem)] shadow-2xl z-50 transform overflow-y-auto ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          backgroundColor: '#2A2829',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="flex flex-col h-full">

          {/* Menu Header */}
          <div className="p-6 border-b border-gray-700/50">
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--ll-font)' }}>
              Menu
            </h2>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-1.5">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full text-left px-4 py-3.5 text-sm sm:text-base font-medium text-gray-200 hover:text-white hover:bg-gray-700/40 rounded-xl transition-all duration-200 focus:outline-none group relative"
                >
                  <span className="relative z-10 flex items-center">
                    <span className="mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-700/50 space-y-3">
            {user ? (
              <>
                <div className="px-4 py-3 bg-gray-800/50 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-semibold">
                    Logged in as
                  </p>
                  <p className="text-sm font-medium text-white truncate">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut || initializing}
                  className="w-full px-4 py-3 text-sm sm:text-base font-semibold text-white bg-gray-800 hover:bg-gray-700 rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none shadow-lg hover:shadow-xl"
                >
                  {isLoggingOut ? 'Signing out…' : 'Logout'}
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavigation('/login')}
                className="w-full px-6 py-3 text-sm sm:text-base font-semibold text-white rounded-lg transition-all duration-200 hover:opacity-90 focus:outline-none disabled:opacity-50"
                style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
              >
                {initializing ? 'Loading…' : 'Login'}
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Spacer */}
      <div className="h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36"></div>
    </>
  )
}
