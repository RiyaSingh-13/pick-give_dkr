// frontend/src/pages/AdminDashboard.jsx
import React from 'react';
import { ChevronDown, LogOut, Home, Building, Users, Clipboard } from 'lucide-react';
import { Logo } from '../components/Logo';
import { AdminSignIn } from './AdminSignIn';

// Import refactored sub-components
import { AdminDossierModal } from '../components/Admin/AdminDossierModal';
import { AdminOverview } from '../components/Admin/AdminOverview';
import { AdminNgosList } from '../components/Admin/AdminNgosList';
import { AdminUsersList } from '../components/Admin/AdminUsersList';
import { AdminAuditLogs } from '../components/Admin/AdminAuditLogs';

export function AdminDashboard({
  adminTab,
  setAdminTab,
  adminSearchQuery,
  setAdminSearchQuery,
  adminNgos,
  adminUsers,
  adminLogs,
  setAdminLogs,
  selectedDossier,
  setSelectedDossier,
  donations,
  ngoRequests,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  navigateTo,
  handleApproveNgo,
  handleRejectNgo,
  handleDeleteUser
}) {

  if (!isAdminLoggedIn) {
    return (
      <AdminSignIn 
        setIsAdminLoggedIn={setIsAdminLoggedIn} 
        navigateTo={navigateTo} 
      />
    );
  }

  // Helper function to render active content panel
  const renderAdminContent = () => {
    switch (adminTab) {
      case 'overview':
        return (
          <AdminOverview 
            adminUsers={adminUsers}
            adminNgos={adminNgos}
            adminLogs={adminLogs}
            setSelectedDossier={setSelectedDossier}
            handleApproveNgo={handleApproveNgo}
            handleRejectNgo={handleRejectNgo}
          />
        );

      case 'ngos':
        return (
          <AdminNgosList 
            adminNgos={adminNgos}
            adminSearchQuery={adminSearchQuery}
            setAdminSearchQuery={setAdminSearchQuery}
            setSelectedDossier={setSelectedDossier}
            handleApproveNgo={handleApproveNgo}
            handleRejectNgo={handleRejectNgo}
            handleDeleteUser={handleDeleteUser}
          />
        );

      case 'users':
        return (
          <AdminUsersList 
            adminUsers={adminUsers}
            adminSearchQuery={adminSearchQuery}
            setAdminSearchQuery={setAdminSearchQuery}
            setSelectedDossier={setSelectedDossier}
            handleDeleteUser={handleDeleteUser}
          />
        );

      case 'logs':
        return (
          <AdminAuditLogs 
            adminLogs={adminLogs}
            setAdminLogs={setAdminLogs}
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
              onClick={() => setAdminTab('overview')}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="w-9 h-9 rounded-full bg-white text-[#0F340F] flex items-center justify-center font-bold text-sm border border-white/5 group-hover:scale-105 transition-transform">
                👑
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold leading-tight text-white flex items-center gap-1">
                  Admin Portal <ChevronDown className="w-3 h-3 text-white/60 inline" />
                </span>
                <span className="text-[10px] text-white/70 font-semibold underline mt-0.5 group-hover:text-white">System Admin</span>
              </div>
            </div>

            <span className="h-6 w-[1px] bg-white/20"></span>

            <button 
              onClick={() => {
                setIsAdminLoggedIn(false);
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
              onClick={() => setAdminTab('overview')}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                adminTab === 'overview'
                  ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                  : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
              }`}
            >
              <Home className="w-4 h-4" /> Overview
            </button>

            <button 
              onClick={() => setAdminTab('ngos')}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                adminTab === 'ngos'
                  ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                  : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
              }`}
            >
              <Building className="w-4 h-4" /> Registered NGOs
            </button>

            <button 
              onClick={() => setAdminTab('users')}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                adminTab === 'users'
                  ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                  : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
              }`}
            >
              <Users className="w-4 h-4" /> Registered Members
            </button>

            <button 
              onClick={() => setAdminTab('logs')}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer border-b-2 ${
                adminTab === 'logs'
                  ? 'border-[#0F340F] text-[#0F340F] font-extrabold'
                  : 'border-transparent text-[#556B5D] hover:text-[#0F340F]'
              }`}
            >
              <Clipboard className="w-4 h-4" /> System Audit Logs
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-8 w-full">
        {renderAdminContent()}
      </main>

      {/* 4. DETAILS DOSSIER DRAWER/MODAL */}
      {selectedDossier && (
        <AdminDossierModal 
          selectedDossier={selectedDossier}
          setSelectedDossier={setSelectedDossier}
          donations={donations}
          ngoRequests={ngoRequests}
          handleApproveNgo={handleApproveNgo}
          handleRejectNgo={handleRejectNgo}
          handleDeleteUser={handleDeleteUser}
        />
      )}

    </div>
  );
}
