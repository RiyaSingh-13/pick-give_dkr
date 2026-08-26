// frontend/src/pages/MemberDashboard.jsx
import React from 'react';
import { 
  Gift, Truck, Heart, Users, Award, ChevronDown, LogOut, 
  Home, Bell, Package, Shirt, Apple, BookOpen, Gamepad2, 
  HeartPulse, Laptop, Armchair, Grid 
} from 'lucide-react';
import { Logo } from '../components/Logo';

// Import refactored sub-components
import { MemberOverview } from '../components/Member/MemberOverview';
import { MemberBookDonation } from '../components/Member/MemberBookDonation';
import { MemberCourierTasks } from '../components/Member/MemberCourierTasks';
import { MemberDonationHistory } from '../components/Member/MemberDonationHistory';
import { MemberDeliveries } from '../components/Member/MemberDeliveries';
import { MemberUrgentNeeds } from '../components/Member/MemberUrgentNeeds';
import { MemberSettingsProfile } from '../components/Member/MemberSettingsProfile';

export function MemberDashboard({
  dashboardTab,
  setDashboardTab,
  currentMember,
  setCurrentMember,
  activeDonations,
  newBooking,
  setNewBooking,
  bookingSuccess,
  setBookingSuccess,
  memberDeliveries,
  volunteerTasks,
  claimedTasks,
  setClaimedTasks,
  selectedDonationId,
  setSelectedDonationId,
  otpInputValues,
  setOtpInputValues,
  otpErrors,
  setOtpErrors,
  radiusFilter,
  setRadiusFilter,
  adminNgos,
  ngoRequests,
  handleBookingSubmit,
  handleClaimTask,
  handleStartSelfTransit,
  handleCompleteSelfDelivery,
  fetchAllData,
  navigateTo
}) {

  // Donation Categories list passed down to the booking wizard
  const DONATION_CATEGORIES = [
    { title: "Clothes", icon: Shirt },
    { title: "Food", icon: Apple },
    { title: "Books", icon: BookOpen },
    { title: "Toys", icon: Gamepad2 },
    { title: "Medical", icon: HeartPulse },
    { title: "Electronics", icon: Laptop },
    { title: "Furniture", icon: Armchair },
    { title: "Others", icon: Grid }
  ];

  // Helper function to render active content panel
  const renderDashboardContent = () => {
    switch (dashboardTab) {
      case 'dashboard':
        return (
          <MemberOverview 
            currentMember={currentMember} 
            setDashboardTab={setDashboardTab} 
          />
        );
      
      case 'donate':
        return (
          <MemberBookDonation 
            currentMember={currentMember}
            newBooking={newBooking}
            setNewBooking={setNewBooking}
            bookingSuccess={bookingSuccess}
            setBookingSuccess={setBookingSuccess}
            handleBookingSubmit={handleBookingSubmit}
            donationCategories={DONATION_CATEGORIES}
          />
        );

      case 'tasks':
        return (
          <MemberCourierTasks 
            radiusFilter={radiusFilter}
            setRadiusFilter={setRadiusFilter}
            volunteerTasks={volunteerTasks}
            claimedTasks={claimedTasks}
            handleClaimTask={handleClaimTask}
          />
        );

      case 'donations':
        return (
          <MemberDonationHistory 
            activeDonations={activeDonations}
            selectedDonationId={selectedDonationId}
            setSelectedDonationId={setSelectedDonationId}
            adminNgos={adminNgos}
            handleStartSelfTransit={handleStartSelfTransit}
            handleCompleteSelfDelivery={handleCompleteSelfDelivery}
          />
        );

      case 'deliveries':
        return (
          <MemberDeliveries 
            memberDeliveries={memberDeliveries}
            currentMember={currentMember}
            adminNgos={adminNgos}
            otpInputValues={otpInputValues}
            setOtpInputValues={setOtpInputValues}
            otpErrors={otpErrors}
            setOtpErrors={setOtpErrors}
            fetchAllData={fetchAllData}
          />
        );

      case 'urgent':
        return (
          <MemberUrgentNeeds 
            ngoRequests={ngoRequests}
            currentMember={currentMember}
            setNewBooking={setNewBooking}
            setDashboardTab={setDashboardTab}
          />
        );

      case 'achievements':
      case 'profile':
      case 'settings':
        return (
          <MemberSettingsProfile 
            dashboardTab={dashboardTab}
            currentMember={currentMember}
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
            <div 
              onClick={() => setDashboardTab('profile')}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="w-9 h-9 rounded-full bg-white text-[#0F340F] flex items-center justify-center font-bold text-sm border border-white/5 group-hover:scale-105 transition-transform">
                {currentMember.initials}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold leading-tight text-white">Hello, {currentMember.fullName.split(' ')[0]}</span>
                <span className="text-[10px] text-white/70 font-semibold underline mt-0.5 group-hover:text-white">View My Profile</span>
              </div>
              <ChevronDown className="w-3 h-3 text-white/60" />
            </div>

            <span className="h-6 w-[1px] bg-white/20"></span>

            <button 
              onClick={() => {
                setCurrentMember(null);
                localStorage.removeItem('currentMember');
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2.5 px-4 overflow-x-auto scrollbar-hide">
            
            <div className="flex items-center gap-4 md:gap-8 overflow-x-auto scrollbar-hide">
              <button 
                onClick={() => setDashboardTab('dashboard')}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                  dashboardTab === 'dashboard' || dashboardTab === 'donate' || dashboardTab === 'tasks'
                    ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                    : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
                }`}
              >
                <Home className="w-4 h-4" /> Dashboard
              </button>

              <button 
                onClick={() => setDashboardTab('deliveries')}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                  dashboardTab === 'deliveries'
                    ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                    : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
                }`}
              >
                <Truck className="w-4 h-4" /> My Deliveries
              </button>

              <button 
                onClick={() => setDashboardTab('donations')}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                  dashboardTab === 'donations'
                    ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                    : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
                }`}
              >
                <Package className="w-4 h-4" /> My Donations
              </button>

              <button 
                onClick={() => setDashboardTab('achievements')}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                  dashboardTab === 'achievements'
                    ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                    : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
                }`}
              >
                <Award className="w-4 h-4" /> Achievements
              </button>
            </div>

            <div className="relative group flex-shrink-0 select-none">
              <div className="absolute -inset-0.5 bg-[#E32121] rounded-full blur opacity-55 group-hover:opacity-75 transition duration-300 animate-emergency-glow"></div>
              
              <button
                onClick={() => setDashboardTab('urgent')}
                className={`relative inline-flex items-center gap-3 px-5 py-3 rounded-full font-extrabold text-[13px] text-white shadow-sm transition-all cursor-pointer select-none whitespace-nowrap overflow-visible ${
                  dashboardTab === 'urgent'
                    ? 'bg-[#C61818] ring-2 ring-red-400/40'
                    : 'bg-[#E32121] hover:bg-[#C61818] hover:scale-[1.03] active:scale-[0.97]'
                }`}
              >
                <Bell className="w-4 h-4 text-white animate-emergency-ring" />
                <span>Urgent NGO Needs</span>
                
                <span className="bg-white text-[#E32121] rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black leading-none shadow-[0_1px_3px_rgba(0,0,0,0.15)]">
                  {ngoRequests.filter(r => r.status !== 'Stopped').length}
                </span>
              </button>

              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-[#78A642] absolute -top-4 -right-3.5 pointer-events-none select-none animate-pulse">
                <path d="M4 14C5.5 11 8 9 11.5 8.5" />
                <path d="M10 13C12.5 10 16 8.5 20 8.5" />
                <path d="M15 14C17.5 12 21 11.5 24 13" />
              </svg>
            </div>

          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-8 w-full">
        {renderDashboardContent()}
      </main>

    </div>
  );
}
