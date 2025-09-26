import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'

export default function HomePage() {
  const navigate = useNavigate()
  const [selectedSegment, setSelectedSegment] = useState(null)
  const pageRef = useRef(null)
  const headerRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const tl = gsap.timeline()
    
    // Simple fade-in animation
    tl.fromTo(pageRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "none" }
    )
  }, [])

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el)
    }
  }

  const menuSegments = [
    { 
      id: 'about-you', 
      title: 'About You', 
      time: '3 min', 
      completed: true,
      totalItems: 8,
      completedItems: 8
    },
    { 
      id: 'children', 
      title: 'Children', 
      time: '3 min', 
      completed: true,
      totalItems: 5,
      completedItems: 5
    },
    { 
      id: 'advisors', 
      title: 'Advisors', 
      time: '3 min', 
      completed: true,
      totalItems: 4,
      completedItems: 4
    },
    { 
      id: 'concerns', 
      title: 'Concerns', 
      time: '2 min', 
      completed: true,
      totalItems: 6,
      completedItems: 6
    },
    { 
      id: 'planning-questions', 
      title: 'Planning Questions', 
      time: '5 min', 
      completed: true,
      totalItems: 12,
      completedItems: 12
    },
    { 
      id: 'assets', 
      title: 'Assets', 
      time: '15 min', 
      completed: true,
      totalItems: 20,
      completedItems: 20
    },
    { 
      id: 'decisionmakers', 
      title: 'Decisionmakers', 
      time: '5 min', 
      completed: true,
      totalItems: 8,
      completedItems: 8
    },
    { 
      id: 'beneficiaries', 
      title: 'Beneficiaries', 
      time: '3 min', 
      completed: true,
      totalItems: 6,
      completedItems: 6
    },
    { 
      id: 'documents', 
      title: 'Documents', 
      time: '10 min', 
      completed: true,
      totalItems: 15,
      completedItems: 15
    },
    { 
      id: 'contact-details', 
      title: 'Contact Details', 
      time: '10 min', 
      completed: true,
      totalItems: 10,
      completedItems: 10
    },
    { 
      id: 'organ-donor', 
      title: 'Organ Donor/Cremation/Burial', 
      time: '2 min', 
      completed: true,
      totalItems: 4,
      completedItems: 4
    },
    { 
      id: 'gov-benefits', 
      title: "Conditional - Gov't Benefits", 
      time: '1 min', 
      completed: true,
      totalItems: 3,
      completedItems: 3
    }
  ]

  const handleSegmentClick = (segmentId) => {
    setSelectedSegment(segmentId)
    // Navigate to the specific form or component
    if (segmentId === 'about-you') {
      navigate('/about-you')
    } else {
      console.log(`Selected segment: ${segmentId}`)
    }
  }

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <div ref={headerRef} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4" style={{ fontFamily: 'var(--ll-font)' }}>
            Welcome to the next generation of generational planning.
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Legacy Louisiana is an estate planning subscription and marketing service for select attorneys, built by attorneys.
          </p>
        </div>

        {/* Horizontal Menu Segments */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuSegments.map((segment) => (
            <div
              key={segment.id}
              ref={addToRefs}
              onClick={() => handleSegmentClick(segment.id)}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer border border-gray-200 hover:border-gray-300"
              style={{ backdropFilter: 'blur(6px)' }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex-shrink-0 mb-4">
                  {segment.completed ? (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}>
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-10 h-10 border-2 border-gray-300 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
                    {segment.title}
                  </h3>
                  <p className="text-sm text-gray-500">{segment.time}</p>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-600 font-medium">
                      {segment.completedItems}/{segment.totalItems} completed
                    </span>
                    <span className="text-xs text-gray-500">
                      {Math.round((segment.completedItems / segment.totalItems) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(segment.completedItems / segment.totalItems) * 100}%`,
                        background: segment.completed ? 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' : '#d1d5db'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 flex justify-center">
          <div className="py-4 px-8 rounded-lg max-w-2xl" style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))', color: 'white' }}>
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-center">All data transmitted & stored securely encrypted. Learn more about our security.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
