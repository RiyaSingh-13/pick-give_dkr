// frontend/src/services/api.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Custom fetch wrapper to handle 401 Unauthorized globally for authenticated requests
const request = async (url, options = {}) => {
  const res = await fetch(url, options);

  // Check if this was an authenticated request (i.e. sent with an Authorization header)
  const hasAuthHeader = options.headers && 
    (options.headers['Authorization'] || options.headers.authorization);

  if (res.status === 401 && hasAuthHeader) {
    console.warn('Unauthorized request detected. Clearing session...');
    localStorage.removeItem('token');
    localStorage.removeItem('currentMember');
    localStorage.removeItem('currentNgo');
    localStorage.removeItem('isAdminLoggedIn');
    alert('Your session has expired. Please sign in again.');
    window.location.href = '/';
  }
  return res;
};

export const api = {
  // Authentication & Registration
  registerUser: async (data) => {
    return request(`${API_BASE}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },
  login: async (email, password) => {
    return request(`${API_BASE}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  },
  verifyEmail: async (email, code) => {
    return request(`${API_BASE}/api/users/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
  },

  // Donations Data Fetching & Mutations
  getDonations: async () => {
    return request(`${API_BASE}/api/donations`);
  },
  createDonation: async (data) => {
    return request(`${API_BASE}/api/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
  },
  acceptDonation: async (id, ngoName) => {
    return request(`${API_BASE}/api/donations/${id}/accept`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ ngo: ngoName })
    });
  },
  claimDonation: async (id, volunteerName) => {
    return request(`${API_BASE}/api/donations/${id}/claim`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ volunteerName })
    });
  },
  startSelfTransit: async (id) => {
    return request(`${API_BASE}/api/donations/${id}/self-transit`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
    });
  },
  verifyPickupOtp: async (id, otp, volunteerName) => {
    return request(`${API_BASE}/api/donations/${id}/verify-pickup`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ otp, volunteerName })
    });
  },
  verifyDeliveryOtp: async (id, otp, volunteerName) => {
    return request(`${API_BASE}/api/donations/${id}/verify-delivery`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ otp, volunteerName })
    });
  },

  // NGO Requirements
  getRequests: async () => {
    return request(`${API_BASE}/api/requests`);
  },
  createRequest: async (data) => {
    return request(`${API_BASE}/api/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
  },
  stopRequest: async (id) => {
    return request(`${API_BASE}/api/requests/${id}/stop`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
    });
  },

  // Admin Portal & Auditing Actions
  getNgos: async () => {
    return request(`${API_BASE}/api/users/ngos`);
  },
  getMembers: async () => {
    return request(`${API_BASE}/api/users/members`);
  },
  getAudits: async () => {
    return request(`${API_BASE}/api/audits`);
  },
  verifyNgo: async (id, status) => {
    return request(`${API_BASE}/api/users/ngos/${id}/verify`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ status })
    });
  },
  deleteUser: async (id) => {
    return request(`${API_BASE}/api/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  }
};
