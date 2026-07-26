// frontend/src/pages/NgoDashboard.jsx
import React from 'react';
import { 
  Heart, Package, CheckCircle, Clipboard, Truck, Home, LogOut
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { api } from '../services/api';

// Import refactored sub-components
import { NgoOverview } from '../components/Ngo/NgoOverview';
import { NgoDonationBox } from '../components/Ngo/NgoDonationBox';
import { NgoReceivedDonations } from '../components/Ngo/NgoReceivedDonations';
import { NgoRequirementsBoard } from '../components/Ngo/NgoRequirementsBoard';
import { NgoLogisticsTracking } from '../components/Ngo/NgoLogisticsTracking';

export function NgoDashboard({
  ngoTab,
  setNgoTab,
  currentNgo,
  setCurrentNgo,
  ngoDonations,
  ngoReceived,
  ngoInDeliveries,
  ngoCompletedDeliveries,
  ngoActiveVolunteers,
  myRequests,
  requestForm,
  setRequestForm,
  requestPostedSuccess,
  validationError,
  ngoDeliveries,
  adminNgos,
  setAdminNgos,
  activeNgoRecord,
  ngoStatus,
  isApproved,
  handleAcceptDonation,
  handlePostRequest,
  handleStopRequest,
  fetchAllData,
  navigateTo
}) {

  // Helper function to render active content panel
  const renderNgoContent = () => {
    switch (ngoTab) {
      case 'dashboard':
        return (
          <NgoOverview 
            currentNgo={currentNgo}
            isApproved={isApproved}
            ngoStatus={ngoStatus}
            activeNgoRecord={activeNgoRecord}
            ngoDonations={ngoDonations}
            ngoReceived={ngoReceived}
            ngoInDeliveries={ngoInDeliveries}
            ngoCompletedDeliveries={ngoCompletedDeliveries}
            ngoActiveVolunteers={ngoActiveVolunteers}
            setNgoTab={setNgoTab}
          />
        );

      case 'box':
        return (
          <NgoDonationBox 
            ngoDonations={ngoDonations}
            isApproved={isApproved}
            ngoStatus={ngoStatus}
            handleAcceptDonation={handleAcceptDonation}
          />
        );

      case 'received':
        return (
          <NgoReceivedDonations 
            ngoReceived={ngoReceived}
          />
        );

      case 'request':
        return (
          <NgoRequirementsBoard 
            myRequests={myRequests}
            requestForm={requestForm}
            setRequestForm={setRequestForm}
            requestPostedSuccess={requestPostedSuccess}
            validationError={validationError}
            isApproved={isApproved}
            ngoStatus={ngoStatus}
            handlePostRequest={handlePostRequest}
            handleStopRequest={handleStopRequest}
          />
        );

      case 'deliveries':
        return (
          <NgoLogisticsTracking 
            ngoDeliveries={ngoDeliveries}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF5] font-sans antialiased text-[#0F340F]">
      
      {/* 1. TOP NAVBAR HEADER */}
      <header className="bg-[#0F340F] text-white px-6 md:px-8 py-3.5 shadow-md relative z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => navigateTo('/')}>
            <Logo light={true} />
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2.5 select-none">
              <div className="w-9 h-9 rounded-full bg-white text-[#0F340F] flex items-center justify-center font-bold text-sm border border-white/5 flex-shrink-0">
                🏢
              </div>
              <div className="flex flex-col text-left">
                <label className="text-[9px] text-white/60 font-extrabold uppercase tracking-wide leading-none mb-0.5">Active NGO</label>
                <select
                  value={currentNgo.ngoName}
                  onChange={(e) => {
                    const selected = adminNgos.find(n => n.ngoName === e.target.value);
                    if (selected) {
                      setCurrentNgo(selected);
                      setNgoTab('dashboard');
                    }
                  }}
                  className="bg-transparent border-0 text-white font-bold text-xs p-0 focus:ring-0 focus:outline-none cursor-pointer pr-5 font-serif select-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right center',
                    backgroundSize: '1.1em',
                    backgroundRepeat: 'no-repeat',
                    paddingRight: '1.2rem',
                    colorScheme: 'dark'
                  }}
                >
                  {adminNgos.length === 0 ? (
                    <option value={currentNgo.ngoName} className="bg-[#0F340F] text-white font-bold">{currentNgo.ngoName}</option>
                  ) : (
                    adminNgos.map(ngo => (
                      <option 
                        key={ngo._id || ngo.id} 
                        value={ngo.ngoName} 
                        className="bg-[#0F340F] text-white font-bold font-sans"
                      >
                        {ngo.ngoName} ({ngo.status})
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <span className="h-6 w-[1px] bg-white/20"></span>

            <button 
              onClick={() => {
                setCurrentNgo(null);
                localStorage.removeItem('currentNgo');
                localStorage.removeItem('token');
                navigateTo('/');
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 text-white font-bold transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* 2. HORIZONTAL TAB NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-8">
        <div className="bg-white border border-[#0F340F]/8 rounded-2xl p-1 shadow-[0_2px_12px_rgba(15,52,15,0.02)]">
          <div className="flex items-center justify-center md:justify-start gap-4 md:gap-8 overflow-x-auto py-2.5 px-4 scrollbar-hide">
            <button 
              onClick={() => setNgoTab('dashboard')}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                ngoTab === 'dashboard'
                  ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                  : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
              }`}
            >
              <Home className="w-4 h-4" /> Dashboard
            </button>

            <button 
              onClick={() => setNgoTab('box')}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                ngoTab === 'box'
                  ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                  : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
              }`}
            >
              <Package className="w-4 h-4" /> Donation Box
            </button>

            <button 
              onClick={() => setNgoTab('received')}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                ngoTab === 'received'
                  ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                  : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
              }`}
            >
              <CheckCircle className="w-4 h-4" /> Donation Received
            </button>

            <button 
              onClick={() => setNgoTab('request')}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                ngoTab === 'request'
                  ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                  : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
              }`}
            >
              <Clipboard className="w-4 h-4" /> My Request
            </button>

            <button 
              onClick={() => setNgoTab('deliveries')}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                ngoTab === 'deliveries'
                  ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                  : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
              }`}
            >
              <Truck className="w-4 h-4" /> Deliveries
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-8 w-full">
        {!isApproved && (
          ngoStatus === 'Rejected' ? (
            <div className="mb-6 p-5 rounded-2xl border border-red-200 bg-red-50/80 backdrop-blur-sm text-red-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in text-left">
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold flex items-center gap-1.5 text-red-800">
                  <span>❌</span> Account Registration Rejected
                </h4>
                <p className="text-xs text-red-700 font-semibold leading-relaxed">
                  Your NGO credentials verification request was reviewed and rejected by the administration team. Please contact <a href="mailto:admin@gmail.com" className="underline font-bold text-red-950">admin@gmail.com</a> to appeal.
                </p>
              </div>
              <button
                onClick={async () => {
                  if (activeNgoRecord) {
                    try {
                      const res = await api.verifyNgo(activeNgoRecord._id || activeNgoRecord.id, 'Approved');
                      if (res.ok) {
                        fetchAllData();
                      }
                    } catch (err) {
                      console.error('Error approving NGO shortcut:', err);
                    }
                  } else {
                    setAdminNgos(adminNgos.map(n => n.ngoName === currentNgo.ngoName ? { ...n, status: 'Approved' } : n));
                  }
                }}
                className="bg-[#0F340F] hover:bg-[#1C4A1C] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex-shrink-0 cursor-pointer self-start sm:self-center"
              >
                ✔️ Re-Approve Instantly (Demo Shortcut)
              </button>
            </div>
          ) : (
            <div className="mb-6 p-5 rounded-2xl border border-amber-200 bg-amber-50/80 backdrop-blur-sm text-amber-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in text-left">
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold flex items-center gap-1.5 text-amber-800">
                  <span>⚠️</span> Account Pending Verification Approval
                </h4>
                <p className="text-xs text-amber-700 font-semibold leading-relaxed">
                  Your NGO account is currently pending document validation checks by the Pick&Give administrative team. You can still browse, but actions are locked until verification is complete.
                </p>
              </div>
              <button
                onClick={async () => {
                  if (activeNgoRecord) {
                    try {
                      const res = await api.verifyNgo(activeNgoRecord._id || activeNgoRecord.id, 'Approved');
                      if (res.ok) {
                        fetchAllData();
                      }
                    } catch (err) {
                      console.error('Error approving NGO shortcut:', err);
                    }
                  } else {
                    setAdminNgos(adminNgos.map(n => n.ngoName === currentNgo.ngoName ? { ...n, status: 'Approved' } : n));
                  }
                }}
                className="bg-[#0F340F] hover:bg-[#1C4A1C] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex-shrink-0 cursor-pointer self-start sm:self-center"
              >
                ✔️ Approve Account Instantly
              </button>
            </div>
          )
        )}
        {renderNgoContent()}
      </main>

    </div>
  );
}
