// frontend/src/hooks/useMemberActions.js
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function useMemberActions({
  currentMember,
  donations,
  ngoRequests,
  fetchAllData
}) {
  const [dashboardTab, setDashboardTab] = useState('dashboard');
  const [radiusFilter, setRadiusFilter] = useState('5');
  const [claimedTasks, setClaimedTasks] = useState([]);
  const [selectedDonationId, setSelectedDonationId] = useState(null);
  const [otpInputValues, setOtpInputValues] = useState({});
  const [otpErrors, setOtpErrors] = useState({});

  // Derived Member list directly connected to globalDonations!
  const activeDonations = donations.filter(d => currentMember && d.donorEmail === currentMember.email);

  // Form states for new booking
  const [newBooking, setNewBooking] = useState({
    step: 1,
    category: null,
    title: '',
    description: '',
    photo: null,
    photoName: '',
    address: '',
    instructions: '',
    ngoName: 'Common Pool',
    deliveryMode: 'Volunteer'
  });

  useEffect(() => {
    if (currentMember && !newBooking.address) {
      setNewBooking(prev => ({ ...prev, address: currentMember.location }));
    }
  }, [currentMember]);

  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Derived claimed delivery routes
  const memberDeliveries = [
    ...(claimedTasks.includes('1105') ? [{ id: '1105', title: 'Warm Clothes & Blankets', location: '14 Baker Street (Your coordinates)', ngo: 'Hope Shelter', status: 'In Transit' }] : []),
    ...donations.filter(d => d.courier && currentMember && d.courier.startsWith(currentMember.fullName)).map(d => ({
      id: (d._id || d.id || '').toString(),
      title: d.title,
      location: d.location,
      ngo: d.ngo,
      status: d.status
    }))
  ];

  // Available volunteer tasks derived from dynamic accepted donations + static preset
  const volunteerTasks = [
    {
      id: '1105',
      title: 'Warm Clothes & Blankets',
      ngo: 'Hope Shelter',
      pickup: '14 Baker Street (Your coordinates)',
      dropoff: '22 Compassion Ave (2.1 km total)',
      weight: 'Light (1 box, clothes)',
      distance: 0.1
    },
    ...donations.filter(d => d.status === 'Accepted' && (!d.courier || d.courier === 'None (Awaiting Courier)')).map(d => ({
      id: (d._id || d.id || '').toString(),
      title: d.title,
      ngo: d.ngo,
      pickup: d.location,
      dropoff: 'Hope Center Shelter (2.5 km total)',
      weight: 'Medium (1 Package)',
      distance: 1.2
    }))
  ];

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    try {
      const res = await api.createDonation({
        title: newBooking.title || 'Other Donation',
        category: newBooking.category || 'Clothes',
        donor: currentMember.fullName,
        donorEmail: currentMember.email,
        ngo: newBooking.ngoName || 'Common Pool',
        location: newBooking.address || currentMember.location,
        description: newBooking.description,
        instructions: newBooking.instructions,
        photo: newBooking.photoName,
        deliveryMode: newBooking.deliveryMode || 'Volunteer',
        isFulfillment: newBooking.isFulfillment || false,
        requestId: newBooking.requestId || null
      });
      if (res.ok) {
        setTimeout(() => {
          setBookingSuccess(false);
          setNewBooking({
            step: 1,
            category: null,
            title: '',
            description: '',
            photo: null,
            photoName: '',
            address: currentMember?.location || '',
            instructions: '',
            ngoName: 'Common Pool',
            deliveryMode: 'Volunteer',
            isFulfillment: false,
            requestId: null
          });
          fetchAllData();
          setDashboardTab('donations');
        }, 1200);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Failed to book donation. Please verify your fields.');
        setBookingSuccess(false);
      }
    } catch (err) {
      console.error('Error booking donation:', err);
      alert('Connection error: could not connect to server. Please try again.');
      setBookingSuccess(false);
    }
  };

  const handleClaimTask = async (taskId) => {
    if (taskId === '1105') {
      if (claimedTasks.includes(taskId)) {
        setClaimedTasks(claimedTasks.filter(id => id !== taskId));
      } else {
        setClaimedTasks([...claimedTasks, taskId]);
      }
      return;
    }
    try {
      const res = await api.claimDonation(taskId, currentMember.fullName);
      if (res.ok) {
        fetchAllData();
        if (claimedTasks.includes(taskId)) {
          setClaimedTasks(claimedTasks.filter(id => id !== taskId));
        } else {
          setClaimedTasks([...claimedTasks, taskId]);
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Failed to claim delivery run.');
      }
    } catch (err) {
      console.error('Error claiming task:', err);
      alert('Connection error. Please check your backend connection.');
    }
  };

  const handleStartSelfTransit = async (id) => {
    try {
      const res = await api.startSelfTransit(id);
      if (res.ok) {
        fetchAllData();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Failed to start transit.');
      }
    } catch (err) {
      console.error('Error starting self transit:', err);
      alert('Connection error. Please check your backend connection.');
    }
  };

  const handleCompleteSelfDelivery = async (id, otp) => {
    try {
      const res = await api.verifyDeliveryOtp(id, otp, currentMember.fullName);
      if (res.ok) {
        fetchAllData();
        return true;
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Verification failed. Please check the NGO code.');
        return false;
      }
    } catch (err) {
      console.error('Error completing self delivery:', err);
      alert('Connection error. Please try again.');
      return false;
    }
  };

  return {
    dashboardTab,
    setDashboardTab,
    radiusFilter,
    setRadiusFilter,
    claimedTasks,
    setClaimedTasks,
    selectedDonationId,
    setSelectedDonationId,
    otpInputValues,
    setOtpInputValues,
    otpErrors,
    setOtpErrors,
    activeDonations,
    newBooking,
    setNewBooking,
    bookingSuccess,
    setBookingSuccess,
    memberDeliveries,
    volunteerTasks,
    handleBookingSubmit,
    handleClaimTask,
    handleStartSelfTransit,
    handleCompleteSelfDelivery
  };
}
