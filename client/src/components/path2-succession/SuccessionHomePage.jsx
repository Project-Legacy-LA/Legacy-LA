import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'

export default function SuccessionHomePage() {
  const navigate = useNavigate()
  const [selectedSegment, setSelectedSegment] = useState(null)
  const pageRef = useRef(null)
  const headerRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const tl = gsap.timeline()
    
    // Page entrance animation
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
      id: 'succession-about-you', 
      title: 'About You & Decedent', 
      time: '20 min', 
      completed: false,
      totalItems: 25,
      completedItems: 0,
      description: 'Brief introduction and detailed information about yourself (the executor) and details about the decedent(s), including family relationships and heirs.',
      featured: false
    },
    { 
      id: 'succession-assets', 
      title: 'Assets at Date of Death', 
      time: '25 min', 
      completed: false,
      totalItems: 15,
      completedItems: 0,
      description: 'List all property the decedent owned at the time of death. Provide both date of death values and current values.',
      featured: false
    },
    { 
      id: 'succession-liabilities', 
      title: 'Liabilities & Debts', 
      time: '20 min', 
      completed: false,
      totalItems: 12,
      completedItems: 0,
      description: 'List all known debts and obligations of the decedent, including mortgages, loans, credit cards, and funeral expenses.',
      featured: false
    },
    { 
      id: 'succession-roles', 
      title: 'Succession Estate Representative', 
      time: '15 min', 
      completed: false,
      totalItems: 10,
      completedItems: 0,
      description: 'Designate who will serve as executor or administrator of the estate, including qualification questions and bond requirements.',
      featured: false
    },
    { 
      id: 'succession-advisors', 
      title: 'Professional Advisors', 
      time: '10 min', 
      completed: false,
      totalItems: 8,
      completedItems: 0,
      description: 'List any professionals or advisors who may have worked with the decedent or have information helpful in completing the succession.',
      featured: false
    },
    { 
      id: 'succession-documents', 
      title: 'Documents', 
      time: '15 min', 
      completed: false,
      totalItems: 10,
      completedItems: 0,
      description: 'Upload important documents such as death certificates, wills, and other relevant paperwork needed for the succession.',
      featured: false
    },
    { 
      id: 'succession-co-executor-access', 
      title: 'Co-Executor Access', 
      time: '5 min', 
      completed: false,
      totalItems: 5,
      completedItems: 0,
      description: 'Manage access permissions for co-executors if applicable.',
      featured: false
    },
    { 
      id: 'succession-concerns', 
      title: 'Concerns', 
      time: '5 min', 
      completed: false,
      totalItems: 3,
      completedItems: 0,
      description: 'Share any concerns you have regarding the succession process, such as family disputes or other issues.',
      featured: false
    }
  ]

  const handleSegmentClick = (segmentId) => {
    setSelectedSegment(segmentId)
    // Navigate to the specific form or component
    switch (segmentId) {
      case 'succession-about-you':
        navigate('/succession/about-you')
        break
      case 'succession-assets':
        navigate('/succession/assets')
        break
      case 'succession-liabilities':
        navigate('/succession/liabilities')
        break
      case 'succession-roles':
        navigate('/succession/roles')
        break
      case 'succession-advisors':
        navigate('/succession/advisors')
        break
      case 'succession-documents':
        navigate('/succession/documents')
        break
      case 'succession-co-executor-access':
        navigate('/succession/co-executor-access')
        break
      case 'succession-concerns':
        navigate('/succession/concerns')
        break
      default:
        console.log(`Selected segment: ${segmentId}`)
    }
  }

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      {/* Header Section */}
      <div ref={headerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--ll-font)' }}>
            Succession Questionnaire
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Thank you for taking the time to complete this questionnaire. The information you provide will help us gather the key details needed to settle your loved one's estate and prepare the necessary succession documents.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {menuSegments.map((segment, index) => {
            // Position the last three cards properly aligned in the same row
            let colClass = ''
            if (segment.id === 'succession-documents') {
              // Documents in first column of last row
              colClass = 'lg:col-span-1'
            } else if (segment.id === 'succession-co-executor-access') {
              // Co-Executor Access in second column of last row
              colClass = 'lg:col-span-1'
            } else if (segment.id === 'succession-concerns') {
              // Concerns in third column of last row
              colClass = 'lg:col-span-1'
            }
            
            return (
            <div
              key={segment.id}
              ref={addToRefs}
              className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 flex flex-col ${colClass}`}
              style={{ 
                backdropFilter: 'blur(10px)',
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-6 rounded-full text-white shadow-lg" style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}>
                {segment.completed ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="text-center flex-grow flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--ll-font)' }}>
                  {segment.title}
                </h3>
                
                <div className="flex items-center justify-center mb-4">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-500">{segment.time}</span>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">{segment.description}</p>
                
                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-medium">
                      {segment.completedItems}/{segment.totalItems} completed
                    </span>
                    <span className="text-gray-500 font-semibold">
                      {Math.round((segment.completedItems / segment.totalItems) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${(segment.completedItems / segment.totalItems) * 100}%`,
                      background: segment.completed 
                        ? 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' 
                        : 'linear-gradient(90deg, #e5e7eb, #d1d5db)'
                    }}
                  ></div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-auto pt-6">
                  <div 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSegmentClick(segment.id)
                    }}
                    className="group inline-flex items-center px-6 py-3 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer" 
                    style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
                  >
                    Get Started
                    <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            )
          })}
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

