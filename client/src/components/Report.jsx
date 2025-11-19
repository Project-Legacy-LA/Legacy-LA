import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'

// Import report files
const reportFiles = [
  {
    id: 1,
    name: 'John and Jane Estate Plan Review',
    fileName: 'SAMPLE 2024 Annual Report.pdf',
    date: '11-18-2025',
    type: 'Annual Report'
  },
  {
    id: 2,
    name: 'The A Family Estate Plan Review',
    fileName: 'Sample_ 2024 Annual Report (1) SAMPLE 2.pdf',
    date: '11-18-2025',
    type: 'Annual Report'
  }
]

export default function Report() {
  const pageRef = useRef(null)
  const [selectedReport, setSelectedReport] = useState(reportFiles[0])

  useEffect(() => {
    const tl = gsap.timeline()
    
    // Page entrance animation
    tl.fromTo(pageRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "none" }
    )
  }, [])

  const getPdfUrl = () => {
    return `/reports/${encodeURIComponent(selectedReport.fileName)}`
  }

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'var(--ll-font)' }}>
            Generate Report
          </h1>
          <p className="text-gray-600 text-lg">
            View your generated reports
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Report List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--ll-font)' }}>
                Available Reports
              </h2>
              <div className="space-y-2">
                {reportFiles.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                      selectedReport.id === report.id
                        ? 'text-white shadow-lg'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200'
                    }`}
                    style={selectedReport.id === report.id ? {
                      background: 'linear-gradient(90deg, #2d5a61, #1e3a3e)'
                    } : {}}
                  >
                    <div className="font-semibold text-sm mb-1">{report.name}</div>
                    <div className={`text-xs ${selectedReport.id === report.id ? 'text-white/90' : 'text-gray-500'}`}>
                      {report.type} • {report.date}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Report View */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              {/* Report Preview Area - Simple PDF Viewer */}
              <div className="mb-6 bg-gray-100 rounded-xl border border-gray-300 p-4 flex flex-col items-center overflow-auto relative" style={{ minHeight: '900px' }}>
                <div className="w-full h-full" style={{ minHeight: '900px' }}>
                  <iframe
                    src={`${getPdfUrl()}#toolbar=1&navpanes=1&scrollbar=1`}
                    className="w-full h-full border-0 rounded-lg shadow-lg"
                    style={{
                      minHeight: '900px',
                      width: '100%'
                    }}
                    title="PDF Preview"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


