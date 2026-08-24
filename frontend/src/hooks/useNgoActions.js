// frontend/src/hooks/useNgoActions.js
import { useState } from 'react';
import { api } from '../services/api';

export function useNgoActions({
  currentNgo,
  donations,
  ngoRequests,
  fetchAllData
}) {
  const [ngoTab, setNgoTab] = useState('dashboard');
  const [requestForm, setRequestForm] = useState({ category: '', title: '', quantity: '', urgency: 'Low', description: '' });
  const [requestPostedSuccess, setRequestPostedSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Derived NGO lists directly connected to globalDonations!
  const ngoDonations = donations.filter(d => 
    (d.ngo === 'Common Pool' || (currentNgo && d.ngo === currentNgo.ngoName)) && 
    d.status === 'Offer Posted'
  );
  const ngoReceived = donations.filter(d => currentNgo && d.ngo === currentNgo.ngoName && d.status !== 'Offer Posted');
  const ngoDeliveries = donations.filter(d => currentNgo && d.ngo === currentNgo.ngoName && (d.status === 'In Transit' || d.status === 'Delivered')).map(d => ({
    id: d._id || d.id,
    courier: d.courier || 'None (Awaiting Courier)',
    route: `${d.donor} ➔ ${d.ngo} Shelter`,
    item: d.title,
    status: d.status === 'In Transit' ? 'On the way' : 'Successfully delivered',
    deliveryOtp: d.deliveryOtp
  }));

  const ngoInDeliveries = donations.filter(d => currentNgo && d.ngo === currentNgo.ngoName && d.status === 'In Transit').length;
  const ngoCompletedDeliveries = donations.filter(d => currentNgo && d.ngo === currentNgo.ngoName && d.status === 'Delivered').length;
  const ngoActiveVolunteers = [...new Set(donations.filter(d => currentNgo && d.ngo === currentNgo.ngoName && d.courier && d.courier !== 'None (Awaiting Courier)').map(d => d.courier.replace(' (Active)', '').replace(' (Completed)', '')))].length;
  const myRequests = ngoRequests.filter(r => currentNgo && r.ngo === currentNgo.ngoName);

  const handleAcceptDonation = async (id) => {
    try {
      const res = await api.acceptDonation(id, currentNgo.ngoName);
      if (res.ok) {
        fetchAllData();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Failed to accept donation offer.');
      }
    } catch (err) {
      console.error('Error accepting donation:', err);
      alert('Connection error. Please check your backend connection.');
    }
  };

  const handlePostRequest = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!requestForm.category) {
      setValidationError('Please select an item category.');
      return;
    }
    if (!requestForm.title || !requestForm.title.trim()) {
      setValidationError('Please enter an item name / title.');
      return;
    }
    if (!requestForm.quantity || isNaN(Number(requestForm.quantity)) || Number(requestForm.quantity) <= 0) {
      setValidationError('Please enter a valid quantity needed (positive number).');
      return;
    }

    try {
      const res = await api.createRequest({
        title: requestForm.title,
        category: requestForm.category,
        urgency: requestForm.urgency,
        quantity: Number(requestForm.quantity),
        description: requestForm.description,
        ngo: currentNgo.ngoName
      });
      if (res.ok) {
        setRequestPostedSuccess(true);
        setRequestForm({ category: '', title: '', quantity: '', urgency: 'Low', description: '' });
        setValidationError('');
        fetchAllData();
        setTimeout(() => setRequestPostedSuccess(false), 3000);
      } else {
        const errData = await res.json();
        setValidationError(errData.error || 'Server rejected request. Please check input values.');
      }
    } catch (err) {
      console.error('Error posting request:', err);
      setValidationError('Failed to post request. Please check your backend connection.');
    }
  };

  const handleStopRequest = async (id) => {
    if (!window.confirm("Are you sure you want to stop/close this requirement request? Members will no longer see it on the community feed.")) {
      return;
    }
    try {
      const res = await api.stopRequest(id);
      if (res.ok) {
        fetchAllData();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to stop the request.');
      }
    } catch (err) {
      console.error('handleStopRequest Error:', err);
      alert('Connection error. Please check your backend server is running.');
    }
  };

  return {
    ngoTab,
    setNgoTab,
    requestForm,
    setRequestForm,
    requestPostedSuccess,
    validationError,
    ngoDonations,
    ngoReceived,
    ngoDeliveries,
    ngoInDeliveries,
    ngoCompletedDeliveries,
    ngoActiveVolunteers,
    myRequests,
    handleAcceptDonation,
    handlePostRequest,
    handleStopRequest
  };
}
