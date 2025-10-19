// Data transformation utilities for API integration
// These functions help transform frontend data structures to match backend expectations

// Transform frontend person data to backend format
export const transformPersonData = (personData) => {
  return {
    // Core person data
    first_name: personData.firstName || personData.legalFirstName,
    middle_name: personData.middleName,
    last_name: personData.lastName || personData.legalLastName,
    suffix: personData.suffix,
    preferred_name: personData.preferredName,
    ssn: personData.ssn || personData.socialSecurityNumber,
    
    // Birth info
    date_of_birth: personData.dateOfBirth ? 
      `${personData.dateOfBirth.year}-${String(personData.dateOfBirth.month).padStart(2, '0')}-${String(personData.dateOfBirth.day).padStart(2, '0')}` : 
      null,
    birth_country: personData.birthCountry,
    birth_state: personData.birthState,
    birth_city: personData.birthCity,
    
    // Life status
    life_status: personData.lifeStatus || 'alive',
    date_of_death: personData.dateOfDeath,
    place_of_death: personData.placeOfDeath,
    is_decedent: personData.isDecedent || false,
    
    // Contact info
    phone: personData.phone,
    email: personData.email,
    address: personData.address ? {
      line1: personData.address.line1,
      line2: personData.address.line2,
      city: personData.address.city,
      state: personData.address.state,
      zip_code: personData.address.zipCode,
      country: personData.address.country || 'US'
    } : null,
    
    // Roles and relationships
    roles: personData.roles || [],
    marital_history: personData.maritalHistory || {},
    
    // Extended person data
    notes: personData.notes || '',
    relationship: personData.relationship || '',
    relationship_type: personData.relationshipType || 'other',
    parental_rights: personData.parentalRights || 'unknown',
    adoption_status: personData.adoptionStatus || 'none',
    incapacity_status: personData.incapacityStatus || 'none'
  }
}

// Transform frontend asset data to backend format
export const transformAssetData = (assetData) => {
  return {
    category: assetData.category,
    description: assetData.description,
    institution: assetData.institution,
    account_number: assetData.accountNumber,
    title_form: assetData.titleForm,
    valuation: {
      amount: parseFloat(assetData.valuation?.amount) || 0,
      currency: assetData.valuation?.currency || 'USD',
      valuation_date: assetData.valuation?.valuationDate
    },
    ownership_percentage: parseFloat(assetData.ownershipPercentage) || 100,
    is_louisiana_property: assetData.isLouisianaProperty,
    property_location: assetData.propertyLocation,
    probate_class: assetData.probateClass,
    beneficiary_designation_required: assetData.beneficiaryDesignationRequired,
    excluded_from_taxable_estate: assetData.excludedFromTaxableEstate,
    property_type: assetData.propertyType,
    annuity_qualified: assetData.annuityQualified,
    annuity_non_qualified: assetData.annuityNonQualified,
    property_address: assetData.propertyAddress ? {
      street: assetData.propertyAddress.street,
      city: assetData.propertyAddress.city,
      zip_code: assetData.propertyAddress.zipCode
    } : null,
    owners: assetData.owners || [],
    beneficiaries: assetData.beneficiaries || [],
    notes: assetData.notes || ''
  }
}

// Transform frontend liability data to backend format
export const transformLiabilityData = (liabilityData) => {
  return {
    type: liabilityData.type,
    description: liabilityData.description,
    amount: parseFloat(liabilityData.amount) || 0,
    monthly_payment: parseFloat(liabilityData.monthlyPayment) || 0,
    associated_asset_id: liabilityData.associatedAssetId,
    creditor: liabilityData.creditor,
    account_number: liabilityData.accountNumber,
    notes: liabilityData.notes || ''
  }
}

// Transform frontend decision maker data to backend format
export const transformDecisionMakerData = (decisionMakerData) => {
  return {
    person_id: decisionMakerData.personId,
    role: decisionMakerData.role,
    is_co_role: decisionMakerData.isCoRole,
    co_role_person_id: decisionMakerData.coRolePersonId,
    relationship: decisionMakerData.relationship,
    important_info: decisionMakerData.importantInfo,
    notes: decisionMakerData.notes || ''
  }
}

// Transform frontend advisor data to backend format
export const transformAdvisorData = (advisorData) => {
  return {
    person_id: advisorData.personId,
    advisor_type: advisorData.advisorType,
    firm_name: advisorData.firmName,
    specializations: advisorData.specializations || [],
    years_of_experience: advisorData.yearsOfExperience,
    notes: advisorData.notes || ''
  }
}

// Transform frontend document data to backend format
export const transformDocumentData = (documentData) => {
  return {
    document_type: documentData.documentType,
    title: documentData.title,
    date_created: documentData.dateCreated,
    date_last_updated: documentData.dateLastUpdated,
    location: documentData.location,
    attorney_id: documentData.attorneyId,
    witnesses: documentData.witnesses || [],
    is_current: documentData.isCurrent,
    notes: documentData.notes || '',
    files: documentData.files || []
  }
}

// Transform frontend spouse access data to backend format
export const transformSpouseAccessData = (accessData) => {
  return {
    spouse_has_access: accessData.spouseHasAccess,
    spouse_email: accessData.spouseEmail,
    spouse_password: accessData.spousePassword,
    spouse_status: accessData.spouseStatus,
    has_prenup: accessData.hasPrenup,
    has_divorce_decree: accessData.hasDivorceDecree,
    prenup_date: accessData.prenupDate,
    divorce_decree_date: accessData.divorceDecreeDate,
    
    // View permissions
    can_view_personal_info: accessData.canViewPersonalInfo,
    can_view_children: accessData.canViewChildren,
    can_view_assets: accessData.canViewAssets,
    can_view_beneficiaries: accessData.canViewBeneficiaries,
    can_view_decision_makers: accessData.canViewDecisionMakers,
    can_view_advisors: accessData.canViewAdvisors,
    
    // Edit permissions
    can_edit_personal_info: accessData.canEditPersonalInfo,
    can_edit_children: accessData.canEditChildren,
    can_edit_assets: accessData.canEditAssets,
    can_edit_beneficiaries: accessData.canEditBeneficiaries,
    can_edit_decision_makers: accessData.canEditDecisionMakers,
    can_edit_advisors: accessData.canEditAdvisors,
    
    // Delete permissions
    can_delete_personal_info: accessData.canDeletePersonalInfo,
    can_delete_children: accessData.canDeleteChildren,
    can_delete_assets: accessData.canDeleteAssets,
    can_delete_beneficiaries: accessData.canDeleteBeneficiaries,
    can_delete_decision_makers: accessData.canDeleteDecisionMakers,
    can_delete_advisors: accessData.canDeleteAdvisors
  }
}

// Transform frontend beneficiary data to backend format
export const transformBeneficiaryData = (beneficiaryData) => {
  return {
    person_id: beneficiaryData.personId,
    relationship: beneficiaryData.relationship,
    all_assets: beneficiaryData.allAssets,
    residual_assets: beneficiaryData.residualAssets,
    contingent_assets: beneficiaryData.contingentAssets,
    inheritance_type: beneficiaryData.inheritanceType,
    percentage: parseFloat(beneficiaryData.percentage) || 0,
    specific_assets: beneficiaryData.specificAssets || [],
    notes: beneficiaryData.notes || ''
  }
}

// Transform frontend child data to backend format
export const transformChildData = (childData) => {
  return {
    person_id: childData.personId,
    relationship: childData.relationship,
    relationship_type: childData.relationshipType,
    parental_rights: childData.parentalRights,
    adoption_status: childData.adoptionStatus,
    is_minor: childData.isMinor,
    guardian_info: childData.guardianInfo || {},
    notes: childData.notes || ''
  }
}

// Transform frontend spouse data to backend format
export const transformSpouseData = (spouseData) => {
  return {
    person_id: spouseData.personId,
    relationship: spouseData.relationship,
    marriage_date: spouseData.marriageDate ? 
      `${spouseData.marriageDate.year}-${String(spouseData.marriageDate.month).padStart(2, '0')}-${String(spouseData.marriageDate.day).padStart(2, '0')}` : 
      null,
    divorce_date: spouseData.divorceDate ? 
      `${spouseData.divorceDate.year}-${String(spouseData.divorceDate.month).padStart(2, '0')}-${String(spouseData.divorceDate.day).padStart(2, '0')}` : 
      null,
    death_date: spouseData.deathDate ? 
      `${spouseData.deathDate.year}-${String(spouseData.deathDate.month).padStart(2, '0')}-${String(spouseData.deathDate.day).padStart(2, '0')}` : 
      null,
    is_current: spouseData.isCurrent,
    notes: spouseData.notes || ''
  }
}

// Utility function to clean and validate data before sending to API
export const cleanDataForAPI = (data) => {
  const cleaned = { ...data }
  
  // Remove empty strings and convert to null
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === '') {
      cleaned[key] = null
    }
  })
  
  // Remove undefined values
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === undefined) {
      delete cleaned[key]
    }
  })
  
  return cleaned
}

// Utility function to handle date formatting consistently
export const formatDateForAPI = (dateObj) => {
  if (!dateObj || !dateObj.year || !dateObj.month || !dateObj.day) {
    return null
  }
  
  return `${dateObj.year}-${String(dateObj.month).padStart(2, '0')}-${String(dateObj.day).padStart(2, '0')}`
}

// Utility function to parse API date back to frontend format
export const parseDateFromAPI = (dateString) => {
  if (!dateString) return { month: '', day: '', year: '' }
  
  const [year, month, day] = dateString.split('-')
  return {
    year: year || '',
    month: month || '',
    day: day || ''
  }
}

