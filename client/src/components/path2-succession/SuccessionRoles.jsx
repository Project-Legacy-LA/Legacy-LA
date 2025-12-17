import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { usePeople } from '../../contexts/PeopleContext'

export default function SuccessionRoles() {
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const formRef = useRef(null)
  const headerRef = useRef(null)
  const { people, addPerson } = usePeople()

  useEffect(() => {
    window.scrollTo(0, 0)
    const tl = gsap.timeline()
    tl.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "none" })
  }, [])

  const [estateRepresentatives, setEstateRepresentatives] = useState([
    {
      id: 1,
      // (1) Appointment Status
      hasBeenAppointed: null, // yes, no, not sure
      appointmentName: '',
      appointmentDate: '',
      appointmentParish: '',
      courtOrderAttached: false,
      
      // (2) Executor Named in Will
      executorNamedInWill: null, // yes, no, not sure
      executorName: '',
      executorWillingToServe: null,
      alternativeExecutor: '',
      
      // (3) Proposed Executor or Administrator
      proposedName: '',
      proposedRelationship: '',
      proposedAddress: {
        line1: '',
        city: '',
        state: '',
        zipCode: ''
      },
      proposedPhone: '',
      proposedEmail: '',
      
      // (4) Basic Qualification Questions
      isAtLeast18: null,
      isLouisianaResident: null,
      hasLouisianaCoRepresentative: null,
      hasFelonyConviction: null,
      felonyExplanation: '',
      isMentallyCompetent: null,
      isCreditorOfEstate: null,
      hasServedBefore: null,
      priorServiceDetails: '',
      
      // (5) Alternate or Backup
      willNamesBackup: null, // 'yes' | 'no' | 'not_sure'
      willAlternateName: '', // name listed in will as backup
      alternateName: '',
      alternateRelationship: '',
      
      // (6) Bond Requirement
      willWaivesBond: null,
      heirsAgreeToWaiveBond: null
    }
  ])

  const addEstateRepresentative = () => {
    const newId = Math.max(...estateRepresentatives.map(e => e.id), 0) + 1
    setEstateRepresentatives([...estateRepresentatives, {
      id: newId,
      hasBeenAppointed: null,
      appointmentName: '',
      appointmentDate: '',
      appointmentParish: '',
      courtOrderAttached: false,
      executorNamedInWill: null,
      executorName: '',
      executorWillingToServe: null,
      alternativeExecutor: '',
      proposedName: '',
      proposedRelationship: '',
      proposedAddress: { line1: '', city: '', state: '', zipCode: '' },
      proposedPhone: '',
      proposedEmail: '',
      isAtLeast18: null,
      isLouisianaResident: null,
      hasLouisianaCoRepresentative: null,
      hasFelonyConviction: null,
      felonyExplanation: '',
      isMentallyCompetent: null,
      isCreditorOfEstate: null,
      hasServedBefore: null,
      priorServiceDetails: '',
      alternateName: '',
      willNamesBackup: null,
      willAlternateName: '',
      alternateName: '',
      alternateRelationship: '',
      willWaivesBond: null,
      heirsAgreeToWaiveBond: null
    }])
  }

  const removeEstateRepresentative = (id) => {
    if (estateRepresentatives.length <= 1) return
    setEstateRepresentatives(estateRepresentatives.filter(e => e.id !== id))
  }

  const handleChange = (id, field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setEstateRepresentatives(prev => prev.map(e => 
        e.id === id ? { ...e, [parent]: { ...e[parent], [child]: value } } : e
      ))
    } else {
      setEstateRepresentatives(prev => prev.map(e => 
        e.id === id ? { ...e, [field]: value } : e
      ))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Succession Roles submitted:', estateRepresentatives)
    navigate('/succession/advisors')
  }

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
            Succession - Estate Representative
          </h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-gray-700">
              In Louisiana, the person responsible for handling the succession is called the "Executor" (if there is a valid will naming one) or the "Administrator" (if there is no will). Both roles serve the same general purpose - gathering the decedent's assets, paying debts, and distributing property to heirs or legatees.
            </p>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={addEstateRepresentative}
              className="px-4 py-2 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
              style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
            >
              + Add Another Estate Representative
            </button>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="space-y-8">
            {estateRepresentatives.map((rep, index) => (
              <div key={rep.id} className="p-6 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Estate Representative {index + 1}
                  </h3>
                  {estateRepresentatives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEstateRepresentative(rep.id)}
                      className="px-4 py-2 text-white rounded-lg transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95"
                      style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)' }}
                    >
                      Remove Representative
                    </button>
                  )}
                </div>

                {/* (1) Appointment Status */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">(1) Appointment Status</h4>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Has a court already appointed an executor or administrator for this estate? *
                    </label>
                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <input type="radio" name={`appointed-${rep.id}`} value="yes" checked={rep.hasBeenAppointed === 'yes'} onChange={(e) => handleChange(rep.id, 'hasBeenAppointed', 'yes')} className="mr-2" />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name={`appointed-${rep.id}`} value="no" checked={rep.hasBeenAppointed === 'no'} onChange={(e) => handleChange(rep.id, 'hasBeenAppointed', 'no')} className="mr-2" />
                        <span>No</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name={`appointed-${rep.id}`} value="not_sure" checked={rep.hasBeenAppointed === 'not_sure'} onChange={(e) => handleChange(rep.id, 'hasBeenAppointed', 'not_sure')} className="mr-2" />
                        <span>Not Sure</span>
                      </label>
                    </div>
                  </div>
                  {rep.hasBeenAppointed === 'yes' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input type="text" value={rep.appointmentName} onChange={(e) => handleChange(rep.id, 'appointmentName', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Appointment</label>
                        <input type="date" value={rep.appointmentDate} onChange={(e) => handleChange(rep.id, 'appointmentDate', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Parish of Appointment</label>
                        <input type="text" value={rep.appointmentParish} onChange={(e) => handleChange(rep.id, 'appointmentParish', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label className="flex items-center mt-6">
                          <input type="checkbox" checked={rep.courtOrderAttached} onChange={(e) => handleChange(rep.id, 'courtOrderAttached', e.target.checked)} className="mr-2" />
                          <span className="text-sm text-gray-700">Court order attached</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* (2) Executor Named in Will */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">(2) Executor Named in Will</h4>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Did the will name an executor? *
                    </label>
                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <input type="radio" name={`executor-named-${rep.id}`} value="yes" checked={rep.executorNamedInWill === 'yes'} onChange={(e) => handleChange(rep.id, 'executorNamedInWill', 'yes')} className="mr-2" />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name={`executor-named-${rep.id}`} value="no" checked={rep.executorNamedInWill === 'no'} onChange={(e) => handleChange(rep.id, 'executorNamedInWill', 'no')} className="mr-2" />
                        <span>No</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name={`executor-named-${rep.id}`} value="not_sure" checked={rep.executorNamedInWill === 'not_sure'} onChange={(e) => handleChange(rep.id, 'executorNamedInWill', 'not_sure')} className="mr-2" />
                        <span>Not Sure</span>
                      </label>
                    </div>
                  </div>
                  {rep.executorNamedInWill === 'yes' && (
                    <div className="space-y-4 ml-7">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name of Executor named in the will</label>
                        <input type="text" value={rep.executorName} onChange={(e) => handleChange(rep.id, 'executorName', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Is that person willing and able to serve? *</label>
                        <div className="flex space-x-6">
                          <label className="flex items-center">
                            <input type="radio" name={`willing-${rep.id}`} value="yes" checked={rep.executorWillingToServe === 'yes'} onChange={(e) => handleChange(rep.id, 'executorWillingToServe', 'yes')} className="mr-2" />
                            <span>Yes</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" name={`willing-${rep.id}`} value="no" checked={rep.executorWillingToServe === 'no'} onChange={(e) => handleChange(rep.id, 'executorWillingToServe', 'no')} className="mr-2" />
                            <span>No</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" name={`willing-${rep.id}`} value="not_sure" checked={rep.executorWillingToServe === 'not_sure'} onChange={(e) => handleChange(rep.id, 'executorWillingToServe', 'not_sure')} className="mr-2" />
                            <span>Not Sure</span>
                          </label>
                        </div>
                      </div>
                      {(rep.executorWillingToServe === 'no' || rep.executorWillingToServe === 'not_sure') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Who do you believe should serve instead?</label>
                          <input type="text" value={rep.alternativeExecutor} onChange={(e) => handleChange(rep.id, 'alternativeExecutor', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* (3) Proposed Executor or Administrator */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">(3) Proposed Executor or Administrator (if none appointed yet)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Proposed Name *</label>
                      <input type="text" value={rep.proposedName} onChange={(e) => handleChange(rep.id, 'proposedName', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Relationship to Decedent *</label>
                      <input type="text" value={rep.proposedRelationship} onChange={(e) => handleChange(rep.id, 'proposedRelationship', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mailing Address - Street *</label>
                      <input type="text" value={rep.proposedAddress.line1} onChange={(e) => handleChange(rep.id, 'proposedAddress.line1', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                        <input type="text" value={rep.proposedAddress.city} onChange={(e) => handleChange(rep.id, 'proposedAddress.city', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                        <input type="text" value={rep.proposedAddress.state} onChange={(e) => handleChange(rep.id, 'proposedAddress.state', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code *</label>
                      <input type="text" value={rep.proposedAddress.zipCode} onChange={(e) => handleChange(rep.id, 'proposedAddress.zipCode', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                      <input type="tel" value={rep.proposedPhone} onChange={(e) => handleChange(rep.id, 'proposedPhone', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input type="email" value={rep.proposedEmail} onChange={(e) => handleChange(rep.id, 'proposedEmail', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                    </div>
                  </div>
                </div>

                {/* (4) Basic Qualification Questions */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">(4) Basic Qualification Questions (Louisiana Requirements)</h4>
                  <div className="space-y-4">
                    {[
                      { field: 'isAtLeast18', label: 'Is the proposed person at least 18 years old? *' },
                      { field: 'isLouisianaResident', label: 'Is the proposed person a Louisiana resident? *' },
                      { field: 'hasFelonyConviction', label: 'Has the proposed person ever been convicted of a felony? *' },
                      { field: 'isMentallyCompetent', label: 'Is the proposed person mentally competent and able to manage financial matters? *' },
                      { field: 'isCreditorOfEstate', label: 'Is the proposed person a creditor of the estate (someone the estate owes money to)? *' },
                      { field: 'hasServedBefore', label: 'Has this person ever served as an executor or administrator before? *' }
                    ].map(({ field, label }) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                        <div className="flex space-x-6">
                          <label className="flex items-center">
                            <input type="radio" name={`${field}-${rep.id}`} value="yes" checked={rep[field] === 'yes'} onChange={(e) => handleChange(rep.id, field, 'yes')} className="mr-2" />
                            <span>Yes</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" name={`${field}-${rep.id}`} value="no" checked={rep[field] === 'no'} onChange={(e) => handleChange(rep.id, field, 'no')} className="mr-2" />
                            <span>No</span>
                          </label>
                        </div>
                        {field === 'hasFelonyConviction' && rep.hasFelonyConviction === 'yes' && (
                          <div className="mt-2 ml-7">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Please explain</label>
                            <textarea value={rep.felonyExplanation} onChange={(e) => handleChange(rep.id, 'felonyExplanation', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" rows="3" />
                          </div>
                        )}
                        {field === 'isLouisianaResident' && rep.isLouisianaResident === 'no' && (
                          <div className="mt-2 ml-7">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Do they have a Louisiana co-representative who can serve with them? *</label>
                            <div className="flex space-x-6">
                              <label className="flex items-center">
                                <input type="radio" name={`co-rep-${rep.id}`} value="yes" checked={rep.hasLouisianaCoRepresentative === 'yes'} onChange={(e) => handleChange(rep.id, 'hasLouisianaCoRepresentative', 'yes')} className="mr-2" />
                                <span>Yes</span>
                              </label>
                              <label className="flex items-center">
                                <input type="radio" name={`co-rep-${rep.id}`} value="no" checked={rep.hasLouisianaCoRepresentative === 'no'} onChange={(e) => handleChange(rep.id, 'hasLouisianaCoRepresentative', 'no')} className="mr-2" />
                                <span>No</span>
                              </label>
                            </div>
                          </div>
                        )}
                        {field === 'hasServedBefore' && rep.hasServedBefore === 'yes' && (
                          <div className="mt-2 ml-7">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Please note where and when if known</label>
                            <input type="text" value={rep.priorServiceDetails} onChange={(e) => handleChange(rep.id, 'priorServiceDetails', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* (5) Alternate or Backup */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">(5) Alternate or Backup</h4>
                  <p className="text-sm text-gray-600 mb-4">If the person named above is unable or unwilling to serve, is an alternate or backup identified in the will?</p>
                  <div className="mb-4">
                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <input type="radio" name={`will-backup-${rep.id}`} value="yes" checked={rep.willNamesBackup === 'yes'} onChange={(e) => handleChange(rep.id, 'willNamesBackup', 'yes')} className="mr-2" />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name={`will-backup-${rep.id}`} value="no" checked={rep.willNamesBackup === 'no'} onChange={(e) => handleChange(rep.id, 'willNamesBackup', 'no')} className="mr-2" />
                        <span>No</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name={`will-backup-${rep.id}`} value="not_sure" checked={rep.willNamesBackup === 'not_sure'} onChange={(e) => handleChange(rep.id, 'willNamesBackup', 'not_sure')} className="mr-2" />
                        <span>Not Sure</span>
                      </label>
                    </div>
                  </div>

                  {/* If the will names a backup, show the name field from the will */}
                  {rep.willNamesBackup === 'yes' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name listed in the will (backup)</label>
                        <input type="text" value={rep.willAlternateName} onChange={(e) => handleChange(rep.id, 'willAlternateName', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Name as written in will" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mt-6">This name is taken from the will. If the will provides additional identifying information (relationship, contact), add it below.</p>
                      </div>
                    </div>
                  )}

                  {/* If the will does not name a backup, allow suggestion of an alternate (existing fields) */}
                  {(rep.willNamesBackup === 'no' || rep.willNamesBackup === 'not_sure') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Suggested Alternate Name</label>
                        <input type="text" value={rep.alternateName} onChange={(e) => handleChange(rep.id, 'alternateName', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                        <input type="text" value={rep.alternateRelationship} onChange={(e) => handleChange(rep.id, 'alternateRelationship', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Relationship" />
                      </div>
                    </div>
                  )}
                </div>

                {/* (6) Bond Requirement */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">(6) Bond Requirement</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Does the will waive bond for the executor? *</label>
                      <div className="flex space-x-6">
                        <label className="flex items-center">
                          <input type="radio" name={`bond-waived-${rep.id}`} value="yes" checked={rep.willWaivesBond === 'yes'} onChange={(e) => handleChange(rep.id, 'willWaivesBond', 'yes')} className="mr-2" />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name={`bond-waived-${rep.id}`} value="no" checked={rep.willWaivesBond === 'no'} onChange={(e) => handleChange(rep.id, 'willWaivesBond', 'no')} className="mr-2" />
                          <span>No</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name={`bond-waived-${rep.id}`} value="not_sure" checked={rep.willWaivesBond === 'not_sure'} onChange={(e) => handleChange(rep.id, 'willWaivesBond', 'not_sure')} className="mr-2" />
                          <span>Not Sure</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Would the heirs likely agree to waive bond if allowed? *</label>
                      <div className="flex space-x-6">
                        <label className="flex items-center">
                          <input type="radio" name={`heirs-waive-${rep.id}`} value="yes" checked={rep.heirsAgreeToWaiveBond === 'yes'} onChange={(e) => handleChange(rep.id, 'heirsAgreeToWaiveBond', 'yes')} className="mr-2" />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name={`heirs-waive-${rep.id}`} value="no" checked={rep.heirsAgreeToWaiveBond === 'no'} onChange={(e) => handleChange(rep.id, 'heirsAgreeToWaiveBond', 'no')} className="mr-2" />
                          <span>No</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name={`heirs-waive-${rep.id}`} value="not_sure" checked={rep.heirsAgreeToWaiveBond === 'not_sure'} onChange={(e) => handleChange(rep.id, 'heirsAgreeToWaiveBond', 'not_sure')} className="mr-2" />
                          <span>Not Sure</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/succession/liabilities')}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
            >
              Back to Liabilities
            </button>
            <button
              type="submit"
              className="px-8 py-3 text-white rounded-lg transition-colors duration-200 font-medium"
              style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
            >
              Continue to Advisors
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

