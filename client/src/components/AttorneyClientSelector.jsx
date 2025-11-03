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
        <p className="text-sm text-gray-600 mt-1">Choose the client whose data you want to view. This view is read-only for now.</p>
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
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-3 py-6 text-center text-gray-500">No clients found.</td>
                </tr>
              ) : (
                filtered.map(opt => {
                  const p = opt.person
                  return (
                    <tr key={opt.value} className="border-t">
                      <td className="px-3 py-3 align-top">{opt.label}</td>
                      <td className="px-3 py-3 align-top text-sm text-gray-600">{p.contactInfo?.email || '—'}</td>
                      <td className="px-3 py-3 align-top text-sm text-gray-600">{(p.roles || []).join(', ') || '—'}</td>
                      <td className="px-3 py-3 align-top text-right">
                        <button
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                          onClick={() => navigate(`/attorney/client/${opt.value}`)}
                        >
                          View
                        </button>
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
