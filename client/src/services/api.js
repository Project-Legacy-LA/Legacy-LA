// Centralized API Service
// Handles all backend communication and data management

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.token = localStorage.getItem('auth_token')
  }

  // Set authentication token
  setToken(token) {
    this.token = token
    localStorage.setItem('auth_token', token)
  }

  // Clear authentication token
  clearToken() {
    this.token = null
    localStorage.removeItem('auth_token')
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Authentication endpoints
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    })
  }

  // Client data endpoints
  async getClientData(clientId) {
    return this.request(`/clients/${clientId}`)
  }

  async updateClientData(clientId, data) {
    return this.request(`/clients/${clientId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Person management endpoints
  async getPeople(clientId) {
    return this.request(`/clients/${clientId}/people`)
  }

  async createPerson(clientId, personData) {
    return this.request(`/clients/${clientId}/people`, {
      method: 'POST',
      body: JSON.stringify(personData),
    })
  }

  async updatePerson(clientId, personId, personData) {
    return this.request(`/clients/${clientId}/people/${personId}`, {
      method: 'PUT',
      body: JSON.stringify(personData),
    })
  }

  async deletePerson(clientId, personId) {
    return this.request(`/clients/${clientId}/people/${personId}`, {
      method: 'DELETE',
    })
  }

  // Assets endpoints
  async getAssets(clientId) {
    return this.request(`/clients/${clientId}/assets`)
  }

  async createAsset(clientId, assetData) {
    return this.request(`/clients/${clientId}/assets`, {
      method: 'POST',
      body: JSON.stringify(assetData),
    })
  }

  async updateAsset(clientId, assetId, assetData) {
    return this.request(`/clients/${clientId}/assets/${assetId}`, {
      method: 'PUT',
      body: JSON.stringify(assetData),
    })
  }

  async deleteAsset(clientId, assetId) {
    return this.request(`/clients/${clientId}/assets/${assetId}`, {
      method: 'DELETE',
    })
  }

  // Liabilities endpoints
  async getLiabilities(clientId) {
    return this.request(`/clients/${clientId}/liabilities`)
  }

  async createLiability(clientId, liabilityData) {
    return this.request(`/clients/${clientId}/liabilities`, {
      method: 'POST',
      body: JSON.stringify(liabilityData),
    })
  }

  async updateLiability(clientId, liabilityId, liabilityData) {
    return this.request(`/clients/${clientId}/liabilities/${liabilityId}`, {
      method: 'PUT',
      body: JSON.stringify(liabilityData),
    })
  }

  async deleteLiability(clientId, liabilityId) {
    return this.request(`/clients/${clientId}/liabilities/${liabilityId}`, {
      method: 'DELETE',
    })
  }

  // Decision Makers endpoints
  async getDecisionMakers(clientId) {
    return this.request(`/clients/${clientId}/decision-makers`)
  }

  async createDecisionMaker(clientId, decisionMakerData) {
    return this.request(`/clients/${clientId}/decision-makers`, {
      method: 'POST',
      body: JSON.stringify(decisionMakerData),
    })
  }

  async updateDecisionMaker(clientId, decisionMakerId, decisionMakerData) {
    return this.request(`/clients/${clientId}/decision-makers/${decisionMakerId}`, {
      method: 'PUT',
      body: JSON.stringify(decisionMakerData),
    })
  }

  async deleteDecisionMaker(clientId, decisionMakerId) {
    return this.request(`/clients/${clientId}/decision-makers/${decisionMakerId}`, {
      method: 'DELETE',
    })
  }

  // Advisors endpoints
  async getAdvisors(clientId) {
    return this.request(`/clients/${clientId}/advisors`)
  }

  async createAdvisor(clientId, advisorData) {
    return this.request(`/clients/${clientId}/advisors`, {
      method: 'POST',
      body: JSON.stringify(advisorData),
    })
  }

  async updateAdvisor(clientId, advisorId, advisorData) {
    return this.request(`/clients/${clientId}/advisors/${advisorId}`, {
      method: 'PUT',
      body: JSON.stringify(advisorData),
    })
  }

  async deleteAdvisor(clientId, advisorId) {
    return this.request(`/clients/${clientId}/advisors/${advisorId}`, {
      method: 'DELETE',
    })
  }

  // Documents endpoints
  async getDocuments(clientId) {
    return this.request(`/clients/${clientId}/documents`)
  }

  async createDocument(clientId, documentData) {
    return this.request(`/clients/${clientId}/documents`, {
      method: 'POST',
      body: JSON.stringify(documentData),
    })
  }

  async updateDocument(clientId, documentId, documentData) {
    return this.request(`/clients/${clientId}/documents/${documentId}`, {
      method: 'PUT',
      body: JSON.stringify(documentData),
    })
  }

  async deleteDocument(clientId, documentId) {
    return this.request(`/clients/${clientId}/documents/${documentId}`, {
      method: 'DELETE',
    })
  }

  // Spouse Access endpoints
  async getSpouseAccessSettings(clientId) {
    return this.request(`/clients/${clientId}/spouse-access`)
  }

  async updateSpouseAccessSettings(clientId, accessData) {
    return this.request(`/clients/${clientId}/spouse-access`, {
      method: 'PUT',
      body: JSON.stringify(accessData),
    })
  }

  // File upload endpoints
  async uploadFile(clientId, file, category) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('category', category)

    return this.request(`/clients/${clientId}/files/upload`, {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    })
  }

  async deleteFile(clientId, fileId) {
    return this.request(`/clients/${clientId}/files/${fileId}`, {
      method: 'DELETE',
    })
  }
}

// Export singleton instance
const apiService = new ApiService()
export default apiService

