import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function AttorneyClientView() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
                Client Summary
              </h1>
              <p className="text-sm text-gray-600">Comprehensive client information summary</p>
            </div>
            <button
              onClick={() => navigate('/attorney')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Client List
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Assets</h3>
            <p className="text-2xl font-bold text-gray-900">—</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Liabilities</h3>
            <p className="text-2xl font-bold text-gray-900">—</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Net Worth</h3>
            <p className="text-2xl font-bold text-gray-900">—</p>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Legal Name</label>
                <p className="text-sm text-gray-900">—</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Preferred Name</label>
                <p className="text-sm text-gray-900">—</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                <p className="text-sm text-gray-900">—</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Social Security Number</label>
                <p className="text-sm text-gray-900">—</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Birth Place</label>
                <p className="text-sm text-gray-900">—</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                <p className="text-sm text-gray-900">—</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <p className="text-sm text-gray-900">—</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Residence Address</label>
                <p className="text-sm text-gray-900">—</p>
              </div>
            </div>
          </div>
        </div>

        {/* Spouse Information Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Spouse Information</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Spouse 1</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">SSN</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Children Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Children</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Child 1</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assets Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Assets</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Asset 1</h3>
                  <span className="text-lg font-semibold text-gray-900">—</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Institution</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Account Number</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Title Form</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Current Value</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Valuation Date</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Ownership Percentage</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Marital Character</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Probate Class</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Property Address</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Notes</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liabilities Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Liabilities & Debts</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Liability 1</h3>
                  <span className="text-lg font-semibold text-gray-900">—</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Type</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Amount</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Creditor</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Account Number</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Monthly Payment</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Debt Holder</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Marital Character</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Notes</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Beneficiaries Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Beneficiaries</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Beneficiary 1</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Relationship</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Inheritance Type</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Percentage</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decision Makers Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Decision Makers</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Decision Maker 1</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Person</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Roles</label>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">—</span>
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Important Information</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Notes</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advisors Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Advisors & Professionals</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Advisor 1</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Type</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Firm/Company</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Specializations</label>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">—</span>
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Notes</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Documents</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Document 1</h3>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">Current</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Document Type</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Title</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Date Created</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Attorney</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Files</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Notes</label>
                    <p className="text-sm text-gray-900">—</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spouse Access Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Spouse Access Settings</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Spouse Has Access</label>
                <p className="text-sm text-gray-900">—</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Spouse Email</label>
                <p className="text-sm text-gray-900">—</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                <p className="text-sm text-gray-900">—</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Print Summary
            </button>
            <button
              onClick={() => navigate('/attorney')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Client List
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
