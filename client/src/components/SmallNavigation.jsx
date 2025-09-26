import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'

export default function SmallNavigation() {
  const navRef = useRef(null)
  const linksRef = useRef([])

  useEffect(() => {
    const tl = gsap.timeline()
    
    // Simple fade-in animation
    tl.fromTo(navRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "none" }
    )
  }, [])

  const addToRefs = (el) => {
    if (el && !linksRef.current.includes(el)) {
      linksRef.current.push(el)
    }
  }
  return (
    <nav ref={navRef} className="border-b border-gray-200" style={{ backgroundColor: '#E0E0DC' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 py-4">
          <Link 
            ref={addToRefs}
            to="/" 
            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Home
          </Link>
          <Link 
            ref={addToRefs}
            to="/about-you" 
            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            About You
          </Link>
          <Link 
            ref={addToRefs}
            to="/login" 
            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Login
          </Link>
          <Link 
            ref={addToRefs}
            to="/attorney-login" 
            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Attorney Login
          </Link>
          <Link 
            ref={addToRefs}
            to="/client-signup" 
            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Client Signup
          </Link>
          <Link 
            ref={addToRefs}
            to="/attorney-signup" 
            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Attorney Signup
          </Link>
        </div>
      </div>
    </nav>
  )
}
