import React, { createContext, useContext, useState } from 'react'

const PeopleContext = createContext()

export const usePeople = () => {
  const context = useContext(PeopleContext)
  if (!context) {
    throw new Error('usePeople must be used within a PeopleProvider')
  }
  return context
}

export const PeopleProvider = ({ children }) => {
  const [people, setPeople] = useState([])

  const addPerson = (personData) => {
    const newId = people.length > 0 ? Math.max(...people.map(p => p.id)) + 1 : 1
    const newPerson = {
      id: newId,
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      preferredName: '',
      ssn: '',
      dateOfBirth: { month: '', day: '', year: '' },
      birthCountry: '',
      birthState: '',
      birthCity: '',
      lifeStatus: 'alive',
      dateOfDeath: '',
      placeOfDeath: '',
      isDecedent: false,
      roles: [],
      maritalHistory: {
        marriedAtDeath: false,
        spouseAtDeath: { legalName: '', dateOfMarriage: '' },
        divorces: [],
        widowedAtDeath: false,
        deceasedSpouse: { legalName: '', dateOfDeath: '' }
      },
      contactInfo: {
        phone: '',
        email: '',
        address: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'US'
        }
      },
      notes: '',
      ...personData
    }
    setPeople(prev => [...prev, newPerson])
    return newId
  }

  const updatePerson = (personId, updates) => {
    setPeople(prev => prev.map(p => 
      p.id === personId ? { ...p, ...updates } : p
    ))
  }

  const removePerson = (personId) => {
    setPeople(prev => prev.filter(p => p.id !== personId))
  }

  const getPersonById = (personId) => {
    return people.find(p => p.id === personId)
  }

  const getPersonDisplayName = (personId) => {
    const person = getPersonById(personId)
    if (!person) return 'Select person...'
    return `${person.firstName} ${person.lastName}`.trim() || 'Unnamed Person'
  }

  const getPeopleByRole = (role) => {
    return people.filter(p => p.roles.includes(role))
  }

  const getPeopleOptions = () => {
    return people
      .map(person => ({
        value: person.id,
        label: getPersonDisplayName(person.id),
        person
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }

  const value = {
    people,
    addPerson,
    updatePerson,
    removePerson,
    getPersonById,
    getPersonDisplayName,
    getPeopleByRole,
    getPeopleOptions
  }

  return (
    <PeopleContext.Provider value={value}>
      {children}
    </PeopleContext.Provider>
  )
}
