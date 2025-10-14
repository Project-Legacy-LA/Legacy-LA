import React, { useRef, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { gsap } from 'gsap'

export default function Breadcrumb() {
  const location = useLocation()
  const breadcrumbRef = useRef(null)
  const itemsRef = useRef([])

  useEffect(() => {
    const tl = gsap.timeline()
    
    // Simple fade-in animation
    tl.fromTo(breadcrumbRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "none" }
    )
  }, [location.pathname])

  const addToRefs = (el) => {
    if (el && !itemsRef.current.includes(el)) {
      itemsRef.current.push(el)
    }
  }

  const getBreadcrumbItems = () => {
    const path = location.pathname
    
    // Define the estate planning flow order
    const estatePlanningFlow = [
      { name: 'Home', path: '/' },
      { name: 'About You', path: '/about-you' },
      { name: 'Estate Planning Wizard', path: '/estate-wizard' },
      { name: 'Spouse Access', path: '/spouse-access' }
    ]
    
    // Find the current step in the flow
    const currentStepIndex = estatePlanningFlow.findIndex(step => step.path === path)
    
    if (currentStepIndex !== -1) {
      // Return all steps up to and including the current step
      return estatePlanningFlow.slice(0, currentStepIndex + 1).map((step, index) => ({
        name: step.name,
        path: step.path,
        current: index === currentStepIndex
      }))
    }
    
    // Handle non-estate planning pages
    switch (path) {
      case '/login':
        return [
          { name: 'Home', path: '/', current: false },
          { name: 'Client Login', path: '/login', current: true }
        ]
      case '/attorney-login':
        return [
          { name: 'Home', path: '/', current: false },
          { name: 'Attorney Login', path: '/attorney-login', current: true }
        ]
      case '/client-signup':
        return [
          { name: 'Home', path: '/', current: false },
          { name: 'Client Registration', path: '/client-signup', current: true }
        ]
      case '/attorney-signup':
        return [
          { name: 'Home', path: '/', current: false },
          { name: 'Attorney Registration', path: '/attorney-signup', current: true }
        ]
      default:
        return [
          { name: 'Home', path: '/', current: true }
        ]
    }
  }

  const breadcrumbItems = getBreadcrumbItems()

  return (
        <nav ref={breadcrumbRef} className="border-b border-gray-200 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#E0E0DC' }} aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-2 py-4">
          {/* Home Icon */}
          <li className="flex items-center">
            <svg
              className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                clipRule="evenodd"
              />
            </svg>
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={item.path}>
                {index > 0 && (
                  <svg
                    className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {item.current ? (
                  <span className="text-sm font-medium text-gray-900" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </li>
        </ol>
      </div>
    </nav>
  )
}
