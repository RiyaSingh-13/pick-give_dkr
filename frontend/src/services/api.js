// frontend/src/services/api.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  // Authentication & Registration
  registerUser: async (data) => {
    return fetch(`${API_BASE}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },
  login: async (email, password) => {
    return fetch(`${API_BASE}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  },
  verifyEmail: async (email, code) => {
    return fetch(`${API_BASE}/api/users/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
  },

  // Donations Data Fetching & Mutations
  getDonations: async () => {
    return fetch(`${API_BASE}/api/donations`);
  },
  createDonation: async (data) => {
    return fetch(`${API_BASE}/api/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
  },
  acceptDonation: async (id, ngoName) => {
    return fetch(`${API_BASE}/api/donations/${id}/accept`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ ngo: ngoName })
    });
  },
  claimDonation: async (id, volunteerName) => {
    return fetch(`${API_BASE}/api/donations/${id}/claim`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ volunteerName })
    });
  },
  completeDelivery: async (id, volunteerName) => {
    return fetch(`${API_BASE}/api/donations/${id}/complete`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ volunteerName })
    });
  },
  startSelfTransit: async (id) => {
    return fetch(`${API_BASE}/api/donations/${id}/self-transit`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
    });
  },
  completeSelfDelivery: async (id) => {
    return fetch(`${API_BASE}/api/donations/${id}/self-complete`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
    });
  },
  verifyPickupOtp: async (id, otp, volunteerName) => {
    return fetch(`${API_BASE}/api/donations/${id}/verify-pickup`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ otp, volunteerName })
    });
  },

  // NGO Requirements
  getRequests: async () => {
    return fetch(`${API_BASE}/api/requests`);
  },
  createRequest: async (data) => {
    return fetch(`${API_BASE}/api/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
  },
  stopRequest: async (id) => {
    return fetch(`${API_BASE}/api/requests/${id}/stop`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
    });
  },

  // Admin Portal & Auditing Actions
  getNgos: async () => {
    return fetch(`${API_BASE}/api/users/ngos`);
  },
  getMembers: async () => {
    return fetch(`${API_BASE}/api/users/members`);
  },
  getAudits: async () => {
    return fetch(`${API_BASE}/api/audits`);
  },
  verifyNgo: async (id, status) => {
    return fetch(`${API_BASE}/api/users/ngos/${id}/verify`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ status })
    });
  },
  deleteUser: async (id) => {
    return fetch(`${API_BASE}/api/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  }
};
