// backend/config/fallbackDb.js
// In-memory fallback database for seamless offline/unwhitelisted testing
const initialUsers = [
  {
    _id: "u0",
    role: 'Admin',
    fullName: 'System Admin',
    email: 'admin@gmail.com',
    password: 'admin123',
    phone: '+91 99999 88888',
    joinedDate: 'May 15, 2026',
    status: 'Approved',
    isVerified: true
  }
];

const initialRequests = [
  {
    _id: "r_initial0",
    title: "10 blankets for winter relief campaign",
    category: "Clothes",
    urgency: "High",
    quantity: 10,
    fulfilled: "0/10",
    description: "Urgent requirements of warm blankets for community night shelter support.",
    date: "Jun 30, 2026",
    ngo: "Hope Foundation",
    status: "Active"
  }
];

const initialDonations = [
  {
    _id: "d_initial0",
    title: "Warm winter jackets & woolens",
    category: "Clothes",
    donor: "Rahul Sharma",
    donorEmail: "rahul@gmail.com",
    ngo: "Common Pool",
    location: "A-12, Sector 62, Noida",
    status: "Offer Posted",
    courier: "None (Awaiting Courier)",
    courierEmail: "",
    deliveryMode: "Volunteer",
    otp: "5423",
    date: "Jul 1, 2026",
    description: "Gently used winter jackets in medium size, packed nicely.",
    instructions: "Call on phone before coming for pick up.",
    photo: ""
  }
];

const initialLogs = [
  {
    id: "l1",
    event: 'System Registry initialized with clean configuration.',
    category: 'Auth',
    timestamp: new Date().toLocaleString()
  }
];

// Fallback state containers
let users = [...initialUsers];
let requests = [...initialRequests];
let donations = [...initialDonations];
let logs = [...initialLogs];

const fallbackDb = {
  // Users Repo
  getUsers: () => users,
  getMembers: () => users.filter(u => u.role === 'Member'),
  getNgos: () => users.filter(u => u.role === 'NGO'),
  findUserById: (id) => users.find(u => u._id === id || u.id === id),
  findUserByEmail: (email) => users.find(u => (u.email && u.email.toLowerCase() === email.toLowerCase()) || (u.officialEmail && u.officialEmail.toLowerCase() === email.toLowerCase())),
  saveUser: (userData) => {
    const id = "u_" + Math.random().toString(36).substr(2, 9);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`\n==================================================`);
    console.log(`[Offline Fallback DB] Verification Code for ${userData.email || userData.officialEmail}: ${verificationToken}`);
    console.log(`==================================================\n`);
    const newUser = {
      _id: id,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: userData.role === 'NGO' ? 'Pending' : 'Approved',
      isVerified: false,
      emailVerificationToken: verificationToken,
      ...userData
    };
    users.unshift(newUser);
    return newUser;
  },
  verifyUserEmail: (email, token) => {
    const user = users.find(u => 
      (u.email && u.email.toLowerCase() === email.toLowerCase()) || 
      (u.officialEmail && u.officialEmail.toLowerCase() === email.toLowerCase())
    );
    if (user && user.emailVerificationToken === token) {
      user.isVerified = true;
      user.emailVerificationToken = '';
      return user;
    }
    return null;
  },
  updateNgoStatus: (id, status) => {
    const ngo = users.find(u => u._id === id || u.id === id);
    if (ngo) {
      ngo.status = status;
      return ngo;
    }
    return null;
  },
  deleteUser: (id) => {
    const index = users.findIndex(u => u._id === id || u.id === id);
    if (index !== -1) {
      const removed = users[index];
      users.splice(index, 1);
      return removed;
    }
    return null;
  },

  // Requests Repo
  getRequests: () => requests,
  saveRequest: (reqData) => {
    const id = "r_" + Math.random().toString(36).substr(2, 9);
    const newReq = {
      _id: id,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      fulfilled: '0/' + (reqData.quantity || 10),
      status: 'Active',
      ...reqData
    };
    requests.unshift(newReq);
    return newReq;
  },

  // Donations Repo
  getDonations: () => donations,
  findDonationById: (id) => donations.find(d => d._id === id || d.id === id),
  saveDonation: (donData) => {
    const id = "d_" + Math.random().toString(36).substr(2, 9);
    const newDon = {
      _id: id,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Offer Posted',
      courier: 'None (Awaiting Courier)',
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      ...donData
    };
    donations.unshift(newDon);
    return newDon;
  },
  updateDonation: (id, updates) => {
    const donation = donations.find(d => d._id === id || d.id === id);
    if (donation) {
      Object.assign(donation, updates);
      return donation;
    }
    return null;
  },
  updateRequest: (id, updates) => {
    const request = requests.find(r => r._id === id || r.id === id);
    if (request) {
      Object.assign(request, updates);
      return request;
    }
    return null;
  },

  // Logs Repo
  getLogs: () => logs,
  saveLog: (event, category) => {
    const id = "l_" + Math.random().toString(36).substr(2, 9);
    const newLog = {
      id,
      event,
      category,
      timestamp: new Date().toLocaleString()
    };
    logs.unshift(newLog);
    return newLog;
  },
  clearLogs: () => {
    logs = [];
  }
};

module.exports = fallbackDb;
