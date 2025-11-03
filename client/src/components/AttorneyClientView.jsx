import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePeople } from '../contexts/PeopleContext'

export default function AttorneyClientView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getPersonById, getPersonDisplayName } = usePeople()
  const personId = parseInt(id, 10)
  const person = getPersonById(personId)

  if (!person) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold">Client not found</h2>
          <p className="text-gray-600 mt-2">The selected client could not be located. They may have been removed.</p>
          <div className="mt-4">
            <button className="px-4 py-2 bg-gray-200 rounded-lg" onClick={() => navigate('/attorney')}>Back to list</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Attorney view — {getPersonDisplayName(personId)}</h1>
        <p className="text-sm text-gray-600 mt-1">This is a read-only view for attorneys. For now it shows basic info and a navigation point to client pages.</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Contact</h3>
            <p className="text-sm text-gray-800">Phone: {person.contactInfo?.phone || '—'}</p>
            <p className="text-sm text-gray-800">Email: {person.contactInfo?.email || '—'}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Demographics</h3>
            <p className="text-sm text-gray-800">DOB: {person.dateOfBirth?.month}/{person.dateOfBirth?.day}/{person.dateOfBirth?.year}</p>
            <p className="text-sm text-gray-800">SSN: {person.ssn || '—'}</p>
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <button className="px-4 py-2 bg-gray-200 rounded-lg" onClick={() => navigate('/attorney')}>Back to list</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={() => alert('Future: navigate to detailed client dashboard')}>Open client dashboard</button>
        </div>
      </div>
    </div>
  )
}
