import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePeople } from '../contexts/PeopleContext'

export default function AttorneyClientSelector() {
  const navigate = useNavigate()
  const { people, getPeopleOptions } = usePeople()
  const [query, setQuery] = useState('')

  const options = useMemo(() => getPeopleOptions(), [people])

  const filtered = options.filter(opt => {
    if (!query) return true
    return opt.label.toLowerCase().includes(query.toLowerCase())
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--ll-font)' }}>Attorney — Select Client</h1>
        <p className="text-sm text-gray-600 mt-1">Choose a client to view their comprehensive summary. Click "View Summary" to see all client information including assets, liabilities, beneficiaries, and more.</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search clients</label>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
          />
        </div>

        <div className="overflow-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="text-sm text-gray-600">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Roles</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-3 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-gray-500 font-medium mb-1">No clients found</p>
                      <p className="text-sm text-gray-400 mb-4">
                        {options.length === 0 
                          ? "No clients have been added yet. Clients will appear here once they're added to the system."
                          : query ? "Try adjusting your search query." : "No clients match your search."}
                      </p>
                      <button
                        className="px-4 py-2 text-white rounded-lg text-sm transition-colors duration-200 font-medium flex items-center gap-2 mx-auto"
                        style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
                        onClick={() => navigate('/attorney/client/1')}
                        title="View client summary page (demo)"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View Client Summary Page (Demo)
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(opt => {
                  const p = opt.person
                  return (
                    <tr key={opt.value} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-4 align-top font-medium">{opt.label}</td>
                      <td className="px-3 py-4 align-top text-sm text-gray-600">{p.contactInfo?.email || '—'}</td>
                      <td className="px-3 py-4 align-top text-sm text-gray-600">{(p.roles || []).join(', ') || '—'}</td>
                      <td className="px-3 py-4 align-top">
                        <div className="flex justify-end">
                          <button
                            className="px-4 py-2 text-white rounded-lg text-sm transition-colors duration-200 font-medium flex items-center gap-2"
                            style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
                            onClick={() => navigate(`/attorney/client/${opt.value}`)}
                            title="View comprehensive client summary"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            View Summary
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg text-sm"
            onClick={() => navigate('/')}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )
}
