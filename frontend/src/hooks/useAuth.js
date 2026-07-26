// frontend/src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function useAuth({
  navigateTo,
  fetchAllData,
  currentMember,
  setCurrentMember,
  currentNgo,
  setCurrentNgo,
  isAdminLoggedIn,
  setIsAdminLoggedIn
}) {
  const [activeCategory, setActiveCategory] = useState(null);
  
  // Modal states
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showNgoModal, setShowNgoModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInError, setSignInError] = useState('');
  const [signInSuccess, setSignInSuccess] = useState(false);
  
  // Form submission success states
  const [memberSuccess, setMemberSuccess] = useState(false);
  const [ngoSuccess, setNgoSuccess] = useState(false);

  // Form submission error states
  const [memberError, setMemberError] = useState('');
  const [ngoError, setNgoError] = useState('');

  // Reset errors when modal changes
  useEffect(() => {
    if (showMemberModal) setMemberError('');
  }, [showMemberModal]);

  useEffect(() => {
    if (showNgoModal) setNgoError('');
  }, [showNgoModal]);

  // Verification states
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationRole, setVerificationRole] = useState('Member');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  // Form states
  const [memberForm, setMemberForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    password: ''
  });

  const [ngoForm, setNgoForm] = useState({
    ngoName: '',
    officialEmail: '',
    phone: '',
    address: '',
    description: '',
    registrationNumber: '',
    certificate: null,
    password: ''
  });

  const [uploadedFileName, setUploadedFileName] = useState('');

  // Helper to complete login session
  const loginSession = (data) => {
    const { token, user } = data;
    localStorage.setItem('token', token);
    if (user.role === 'Member') {
      const initials = user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'M';
      setCurrentMember({
        fullName: user.fullName,
        initials: initials,
        email: user.email,
        location: user.location,
        phone: user.phone
      });
      navigateTo('/member');
    } else if (user.role === 'NGO') {
      setCurrentNgo(user);
      navigateTo('/ngo');
    } else if (user.role === 'Admin') {
      setIsAdminLoggedIn(true);
      navigateTo('/admin');
    }
  };

  // Handlers
  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    setMemberError('');
    const password = memberForm.password;
    if (!password) {
      setMemberError('Password is required.');
      return;
    }
    if (password.length < 6 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setMemberError('Password must be at least 6 characters long and contain both letters and numbers.');
      return;
    }
    setMemberSuccess(true);
    try {
      const res = await api.registerUser({
        role: 'Member',
        fullName: memberForm.fullName,
        email: memberForm.email,
        phone: memberForm.phone,
        location: memberForm.location,
        password: memberForm.password
      });

      if (res.ok) {
        setVerificationEmail(memberForm.email);
        setVerificationRole('Member');
        setVerificationCode('');
        setVerificationError('');
        
        setTimeout(() => {
          setMemberSuccess(false);
          setShowMemberModal(false);
          setShowVerificationModal(true);
          setMemberForm({ fullName: '', email: '', phone: '', location: '', password: '' });
        }, 1000);
      } else {
        const errData = await res.json();
        setMemberError(errData.error || 'Failed to register.');
        setMemberSuccess(false);
      }
    } catch (err) {
      console.error('Member submit error:', err);
      setMemberError('Connection error. Please try again.');
      setMemberSuccess(false);
    }
  };

  const handleNgoSubmit = async (e) => {
    e.preventDefault();
    setNgoError('');
    const password = ngoForm.password;
    if (!password) {
      setNgoError('Password is required.');
      return;
    }
    if (password.length < 6 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setNgoError('Password must be at least 6 characters long and contain both letters and numbers.');
      return;
    }
    setNgoSuccess(true);
    try {
      const res = await api.registerUser({
        role: 'NGO',
        ngoName: ngoForm.ngoName,
        officialEmail: ngoForm.officialEmail,
        phone: ngoForm.phone,
        address: ngoForm.address,
        description: ngoForm.description,
        registrationNumber: ngoForm.registrationNumber,
        password: ngoForm.password
      });

      if (res.ok) {
        setVerificationEmail(ngoForm.officialEmail);
        setVerificationRole('NGO');
        setVerificationCode('');
        setVerificationError('');

        setTimeout(() => {
          setNgoSuccess(false);
          setShowNgoModal(false);
          setShowVerificationModal(true);
          setNgoForm({ ngoName: '', officialEmail: '', phone: '', address: '', description: '', registrationNumber: '', certificate: null, password: '' });
          setUploadedFileName('');
        }, 1000);
      } else {
        const errData = await res.json();
        setNgoError(errData.error || 'Failed to register NGO.');
        setNgoSuccess(false);
      }
    } catch (err) {
      console.error('NGO submit error:', err);
      setNgoError('Connection error. Please try again.');
      setNgoSuccess(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setSignInError('');
    setSignInSuccess(false);

    try {
      const res = await api.login(signInEmail, signInPassword);
      const data = await res.json();

      if (res.ok) {
        setSignInSuccess(true);
        setTimeout(() => {
          setShowSignInModal(false);
          setSignInSuccess(false);
          setSignInEmail('');
          setSignInPassword('');
          loginSession(data);
        }, 1200);
      } else {
        if (res.status === 403 && data.unverified) {
          setVerificationEmail(data.email);
          setVerificationRole(data.role || 'Member');
          setVerificationCode('');
          setVerificationError('');
          setShowSignInModal(false);
          setShowVerificationModal(true);
        } else {
          setSignInError(data.error || 'Failed to sign in. Please verify your credentials.');
        }
      }
    } catch (err) {
      console.error('Sign In Error:', err);
      setSignInError('Server connection error. Please try again later.');
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setVerificationError('');
    setVerificationSuccess(false);

    try {
      const res = await api.verifyEmail(verificationEmail, verificationCode);
      const data = await res.json();

      if (res.ok) {
        setVerificationSuccess(true);
        setTimeout(() => {
          setShowVerificationModal(false);
          setVerificationSuccess(false);
          setVerificationCode('');
          loginSession(data);
          fetchAllData();
        }, 1200);
      } else {
        setVerificationError(data.error || 'Incorrect code. Please try again.');
      }
    } catch (err) {
      console.error('Verify Email Error:', err);
      setVerificationError('Connection error. Please try again.');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNgoForm({ ...ngoForm, certificate: file });
      setUploadedFileName(file.name);
    }
  };

  return {
    activeCategory,
    setActiveCategory,
    showMemberModal,
    setShowMemberModal,
    showNgoModal,
    setShowNgoModal,
    showSignInModal,
    setShowSignInModal,
    signInEmail,
    setSignInEmail,
    signInPassword,
    setSignInPassword,
    signInError,
    setSignInError,
    signInSuccess,
    setSignInSuccess,
    memberSuccess,
    setMemberSuccess,
    ngoSuccess,
    setNgoSuccess,
    memberError,
    setMemberError,
    ngoError,
    setNgoError,
    showVerificationModal,
    setShowVerificationModal,
    verificationEmail,
    setVerificationEmail,
    verificationRole,
    setVerificationRole,
    verificationCode,
    setVerificationCode,
    verificationError,
    setVerificationError,
    verificationSuccess,
    setVerificationSuccess,
    memberForm,
    setMemberForm,
    ngoForm,
    setNgoForm,
    uploadedFileName,
    setUploadedFileName,
    handleMemberSubmit,
    handleNgoSubmit,
    handleSignIn,
    handleVerifyEmail,
    handleFileChange
  };
}
