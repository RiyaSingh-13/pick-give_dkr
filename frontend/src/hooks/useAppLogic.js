// frontend/src/hooks/useAppLogic.js
import { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

// Import specialized sub-hooks
import { useAuth } from './useAuth';
import { useMemberActions } from './useMemberActions';
import { useNgoActions } from './useNgoActions';
import { useAdminActions } from './useAdminActions';

export function useAppLogic() {
  // 1. Core Simple Path Router & Global Database Cache States
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const [currentMember, setCurrentMember] = useState(() => {
    const saved = localStorage.getItem('currentMember');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentNgo, setCurrentNgo] = useState(() => {
    const saved = localStorage.getItem('currentNgo');
    return saved ? JSON.parse(saved) : null;
  });

  const currentNgoRef = useRef(currentNgo);
  useEffect(() => {
    currentNgoRef.current = currentNgo;
  }, [currentNgo]);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => localStorage.getItem('isAdminLoggedIn') === 'true');

  useEffect(() => {
    localStorage.setItem('currentMember', JSON.stringify(currentMember));
  }, [currentMember]);

  useEffect(() => {
    localStorage.setItem('currentNgo', JSON.stringify(currentNgo));
  }, [currentNgo]);

  useEffect(() => {
    localStorage.setItem('isAdminLoggedIn', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  // Validate session token presence
  useEffect(() => {
    const token = localStorage.getItem('token');
    if ((currentMember || currentNgo || isAdminLoggedIn) && !token) {
      console.warn('Session active but no authentication token found. Clearing session...');
      setCurrentMember(null);
      setCurrentNgo(null);
      setIsAdminLoggedIn(false);
      localStorage.removeItem('currentMember');
      localStorage.removeItem('currentNgo');
      localStorage.removeItem('isAdminLoggedIn');
      localStorage.removeItem('token');
      navigateTo('/');
    }
  }, [currentMember, currentNgo, isAdminLoggedIn]);

  const [donations, setDonations] = useState([]);
  const [adminNgos, setAdminNgos] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminLogs, setAdminLogs] = useState([]);
  const [ngoRequests, setNgoRequests] = useState([]);

  const activeNgoRecord = currentNgo ? adminNgos.find(n => n.ngoName === currentNgo.ngoName) : null;
  const ngoStatus = activeNgoRecord ? activeNgoRecord.status : (currentNgo?.status || 'Pending');
  const isApproved = ngoStatus === 'Approved';

  // 2. Load data from live Express backend APIs
  const fetchAllData = async () => {
    try {
      // Fetch Donations
      const resDonations = await api.getDonations();
      if (resDonations.ok) {
        const data = await resDonations.json();
        setDonations(data);
      }

      // Fetch NGOs
      const resNgos = await api.getNgos();
      if (resNgos.ok) {
        const data = await resNgos.json();
        setAdminNgos(data);
        // Only update active NGO session details if an NGO is currently signed in
        const activeNgo = currentNgoRef.current;
        if (activeNgo && data.length > 0) {
          const found = data.find(n => n.ngoName === activeNgo.ngoName);
          if (found) {
            setCurrentNgo(found);
          }
        }
      }

      // Fetch Members
      const resMembers = await api.getMembers();
      if (resMembers.ok) {
        const data = await resMembers.json();
        setAdminUsers(data);
      }

      // Fetch Logs
      const resLogs = await api.getAudits();
      if (resLogs.ok) {
        const data = await resLogs.json();
        setAdminLogs(data);
      }

      // Fetch NGO Requests
      const resRequests = await api.getRequests();
      if (resRequests.ok) {
        const data = await resRequests.json();
        setNgoRequests(data);
      }
    } catch (err) {
      console.error('Error fetching backend data:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Listen to popstate changes (back/forward browser buttons)
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. Delegate to Domain Hooks
  const auth = useAuth({
    navigateTo,
    fetchAllData,
    currentMember,
    setCurrentMember,
    currentNgo,
    setCurrentNgo,
    isAdminLoggedIn,
    setIsAdminLoggedIn
  });

  const memberActions = useMemberActions({
    currentMember,
    donations,
    ngoRequests,
    fetchAllData
  });

  const ngoActions = useNgoActions({
    currentNgo,
    donations,
    ngoRequests,
    fetchAllData
  });

  const adminActions = useAdminActions({
    fetchAllData
  });

  // 4. Return flat object mapping matching existing dashboards signatures
  return {
    currentPath,
    setCurrentPath,
    currentMember,
    setCurrentMember,
    currentNgo,
    setCurrentNgo,
    donations,
    adminNgos,
    setAdminNgos,
    adminUsers,
    adminLogs,
    ngoRequests,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    activeNgoRecord,
    ngoStatus,
    isApproved,
    fetchAllData,
    navigateTo,

    // Auth exports
    ...auth,

    // Member exports
    ...memberActions,

    // NGO exports
    ...ngoActions,

    // Admin exports
    ...adminActions
  };
}
export default useAppLogic;
