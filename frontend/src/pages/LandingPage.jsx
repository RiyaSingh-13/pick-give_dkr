// frontend/src/pages/LandingPage.jsx
import React from 'react';
import { 
  Shield, MapPin, Users, Heart, Info, Sparkles, Phone, Mail, 
  UserPlus, Building, User, LogOut, Package, TrendingUp,
  Shirt, Apple, BookOpen, Gamepad2, HeartPulse, Laptop, Armchair, Grid 
} from 'lucide-react';
import donationDeliveryImg from '../assets/donation_delivery.png';
import { AuthModals } from '../components/AuthModals';
import { Logo } from '../components/Logo';
import { Button } from '../components/UI/Button';

export function LandingPage({
  currentMember,
  setCurrentMember,
  currentNgo,
  setCurrentNgo,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  showSignInModal,
  setShowSignInModal,
  showMemberModal,
  setShowMemberModal,
  showNgoModal,
  setShowNgoModal,
  memberSuccess,
  memberForm,
  setMemberForm,
  ngoSuccess,
  ngoForm,
  setNgoForm,
  uploadedFileName,
  signInSuccess,
  signInEmail,
  setSignInEmail,
  signInPassword,
  setSignInPassword,
  signInError,
  activeCategory,
  setActiveCategory,
  handleMemberSubmit,
  handleNgoSubmit,
  handleSignIn,
  handleFileChange,
  navigateTo,
  adminNgos,
  showVerificationModal,
  setShowVerificationModal,
  verificationEmail,
  verificationCode,
  setVerificationCode,
  verificationError,
  verificationSuccess,
  handleVerifyEmail,
  memberError,
  ngoError
}) {

  // Statistics Array
  const STATS_ITEMS = [
    { value: "12,580+", label: "Donations Delivered", sublabel: "Verified delivery pipelines", icon: Package },
    { value: "3,240+", label: "Active Volunteers", sublabel: "Drivers & on-foot couriers", icon: Users },
    { value: "450+", label: "Partner NGOs", sublabel: "Local community organizations", icon: Building },
    { value: "50,000+", label: "Lives Impacted", sublabel: "Direct material support", icon: Heart },
    { value: "Growing Daily", label: "Be Part of the Change", sublabel: "Join thousands of kind hearts", icon: TrendingUp }
  ];

  // Donation Categories Array
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

  // How it works steps
  const FLOW_STEPS = [
    { step: "1", title: "Upload", description: "Upload items you want to donate.", colorClass: "bg-[#78A642]" },
    { step: "2", title: "NGO Accepts", description: "NGO reviews and accepts the request.", colorClass: "bg-[#0F340F]" },
    { step: "3", title: "Volunteer Delivers", description: "Volunteer picks up and delivers it.", colorClass: "bg-[#78A642]" },
    { step: "4", title: "Impact Created", description: "Donation reaches those who need it.", colorClass: "bg-[#0F340F]" }
  ];

  // Why Choose Us list
  const BENEFITS = [
    {
      title: "Verified & Trusted NGOs",
      description: "All NGOs are verified to ensure your donation reaches the right place.",
      icon: Shield
    },
    {
      title: "Live Tracking",
      description: "Volunteers use OTP verification and map routes to guarantee safe transit.",
      icon: MapPin
    },
    {
      title: "Community Driven",
      description: "Direct neighbor-to-neighbor and organization coordination pipelines.",
      icon: Users
    }
  ];

  const handleSignOut = () => {
    setCurrentMember(null);
    setCurrentNgo(null);
    setIsAdminLoggedIn(false);
    localStorage.removeItem('currentMember');
    localStorage.removeItem('currentNgo');
    localStorage.removeItem('token');
    localStorage.setItem('isAdminLoggedIn', 'false');
    navigateTo('/');
  };

  const renderHeaderActions = () => {
    if (currentMember) {
      return (
        <>
          <Button 
            onClick={() => navigateTo('/member')}
            variant="primary"
          >
            <User className="w-4 h-4 flex-shrink-0" /> Hello, {currentMember.fullName.split(' ')[0]} (Go to Dashboard)
          </Button>
          <Button 
            onClick={handleSignOut}
            variant="secondary"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" /> Sign Out
          </Button>
        </>
      );
    }
    if (currentNgo) {
      return (
        <>
          <Button 
            onClick={() => navigateTo('/ngo')}
            variant="primary"
          >
            <Building className="w-4 h-4 flex-shrink-0" /> {currentNgo.ngoName} (Go to Dashboard)
          </Button>
          <Button 
            onClick={handleSignOut}
            variant="secondary"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" /> Sign Out
          </Button>
        </>
      );
    }
    if (isAdminLoggedIn) {
      return (
        <>
          <Button 
            onClick={() => navigateTo('/admin')}
            variant="primary"
          >
            👑 Admin Control Panel
          </Button>
          <Button 
            onClick={handleSignOut}
            variant="secondary"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" /> Sign Out
          </Button>
        </>
      );
    }
    return (
      <>
        <Button 
          onClick={() => setShowSignInModal(true)}
          variant="secondary"
        >
          <User className="w-4 h-4 flex-shrink-0" /> Sign In
        </Button>
        <Button 
          onClick={() => setShowMemberModal(true)}
          variant="primary"
        >
          <UserPlus className="w-4 h-4 flex-shrink-0" /> Join as Member
        </Button>
        <Button 
          onClick={() => setShowNgoModal(true)}
          variant="outline"
        >
          <Building className="w-4 h-4 flex-shrink-0" /> Register NGO
        </Button>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slateblack antialiased relative">
      
      {/* Decorative background vectors representing leaves */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-leaf/5 rounded-full filter blur-3xl pointer-events-none z-0" />
      <div className="absolute top-1/2 right-0 w-[450px] h-[450px] bg-sage/5 rounded-full filter blur-3xl pointer-events-none z-0" />

      {/* SVGs needed for Clip-Paths */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="organic-leaf-mask" clipPathUnits="objectBoundingBox">
            <path d="M 0.12 0 L 1 0 L 1 1 L 0.12 1 C 0.05 0.8, 0 0.5, 0.12 0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* HEADER NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-b border-forest/5 px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => navigateTo('/')}>
            <Logo />
          </div>

          <nav className="hidden lg:flex items-center gap-3 xl:gap-5 text-[13px] xl:text-sm font-semibold text-slateblack">
            <a href="#home" className="hover:text-leaf transition-colors whitespace-nowrap">Home</a>
            <a href="#how-it-works" className="hover:text-leaf transition-colors whitespace-nowrap">How It Works</a>
            <a href="#about-us" className="hover:text-leaf transition-colors whitespace-nowrap">About Us</a>
          </nav>

          {/* Action Buttons bound to modals / active sessions */}
          <div className="flex items-center gap-2 xl:gap-3">
            {renderHeaderActions()}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-cream/30 via-white to-white px-4 md:px-8">
        
        {/* Floating decorative elements */}
        <div className="absolute top-24 left-10 text-leaf/10 animate-pulse pointer-events-none">
          <svg width="40" height="40" fill="currentColor" viewBox="0 0 100 100">
            <path d="M10,90 C30,70 60,60 90,10 C80,40 70,70 10,90 Z" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Info */}
          <div className="lg:col-span-6 flex flex-col items-start text-center lg:text-left">
            
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-leaf/10 border border-leaf/20 text-forest text-xs font-semibold uppercase tracking-wider mb-6 mx-auto lg:mx-0 select-none">
              <span className="w-2 h-2 rounded-full bg-leaf animate-pulse"></span>
              Together We Create Change
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-extrabold tracking-tight text-forest leading-[1.12] mb-6 font-serif">
              Give What You Can.<br />
              <span className="bg-gradient-to-r from-forest via-leaf to-forest bg-clip-text text-transparent">
                Deliver What Matters.
              </span>
            </h1>

            <p className="text-base md:text-lg text-mutegreen max-w-xl mb-8 font-medium mx-auto lg:mx-0">
              Connect with nearby NGOs, donate useful items, volunteer for deliveries, and create real impact in your community.
            </p>

            {/* CTA Group bound to modals */}
            <div className="flex flex-wrap gap-4 mb-10 justify-center lg:justify-start w-full">
              <Button 
                onClick={() => setShowMemberModal(true)}
                variant="primary"
                size="lg"
              >
                <UserPlus className="w-5 h-5" /> Join as Member
              </Button>
              <Button 
                onClick={() => setShowNgoModal(true)}
                variant="outline"
                size="lg"
              >
                <Building className="w-5 h-5" /> Register NGO
              </Button>
              <Button 
                onClick={() => setShowSignInModal(true)}
                variant="secondary"
                size="lg"
              >
                <User className="w-5 h-5 animate-pulse text-[#78A642]" /> Sign In to Dashboard
              </Button>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full border-t border-forest/5 pt-6 text-left">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-leaf flex-shrink-0" />
                <span className="text-[11px] md:text-xs font-bold text-slateblack">Verified NGOs</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-leaf flex-shrink-0" />
                <span className="text-[11px] md:text-xs font-bold text-slateblack">Live Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-leaf flex-shrink-0" />
                <span className="text-[11px] md:text-xs font-bold text-slateblack">Community Driven</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-leaf flex-shrink-0" />
                <span className="text-[11px] md:text-xs font-bold text-slateblack">Zero Waste Mission</span>
              </div>
            </div>
          </div>

          {/* Hero Right Illustration */}
          <div className="lg:col-span-6 relative flex flex-col items-center w-full">
            <div className="leaf-mask-container shadow-2xl">
              <img
                src={donationDeliveryImg}
                alt="Donation pipeline visual"
                className="leaf-mask-image"
              />
            </div>
            
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-sage/20 rounded-full filter blur-xl animate-pulse pointer-events-none" />
          </div>
        </div>
      </section>

      {/* STATS BAR SECTION */}
      <section id="impact" className="py-6 px-4 md:px-8 bg-white z-10 relative">
        <div className="max-w-7xl mx-auto bg-forest text-cream rounded-2xl p-6 md:p-8 stats-bar-shadow">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 items-center">
            {STATS_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center gap-1.5 group hover:scale-[1.03] transition-transform duration-200">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sage group-hover:bg-white/20 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-white leading-none mt-1">
                    {item.value}
                  </h3>
                  <p className="text-[10px] md:text-xs font-bold tracking-wide uppercase text-sage font-sans">
                    {item.label}
                  </p>
                  <p className="text-[9px] text-white/50 px-2 line-clamp-1">
                    {item.sublabel}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* COLUMN CONTENT SECTIONS */}
      <section id="how-it-works" className="py-20 px-4 md:px-8 bg-cream/30 border-t border-b border-forest/5 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Column 1: How Pick&Give Works */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className="text-left">
              <h2 className="text-3xl font-extrabold text-forest mb-4 font-serif">
                How Pick&Give Works 🌿
              </h2>
              <p className="text-mutegreen text-sm mb-8 leading-relaxed font-medium">
                We make contribution seamless. Follow our direct pipelines to start supporting local organizations in just a few clicks.
              </p>

              {/* Steps vertical flow */}
              <div className="flex flex-col gap-6 mb-8">
                {FLOW_STEPS.map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start group">
                    <div className={`w-8 h-8 rounded-full ${step.colorClass} flex items-center justify-center font-bold text-white text-xs flex-shrink-0 transition-transform group-hover:scale-110 duration-200 shadow-sm font-sans`}>
                      {step.step}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-forest mb-0.5">
                        {step.title}
                      </h4>
                      <p className="text-xs text-mutegreen leading-relaxed font-medium">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="h-6"></div>
          </div>

          {/* Column 2: What Can You Donate? */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className="text-left">
              <h2 className="text-3xl font-extrabold text-forest mb-4 font-serif">
                What Can You Donate? 📦
              </h2>
              <p className="text-mutegreen text-sm mb-8 leading-relaxed font-medium">
                Select your category and start packing. We accept a wide range of essential resources to meet community needs.
              </p>

              {/* Grid 4x2 categories */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {DONATION_CATEGORIES.map((cat, idx) => {
                  const Icon = cat.icon;
                  const isSelected = activeCategory === idx;
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col items-center justify-center aspect-square border rounded-xl cursor-pointer select-none transition-all duration-300 ${isSelected ? 'bg-white border-leaf shadow-md scale-105' : 'bg-cream/40 border-forest/10 hover:bg-white hover:border-leaf/50 hover:shadow-sm hover:-translate-y-1'}`}
                      onClick={() => setActiveCategory(idx)}
                    >
                      <Icon className={`w-6 h-6 mb-1.5 transition-colors ${isSelected ? 'text-leaf' : 'text-forest'}`} />
                      <span className="text-[10px] font-bold text-slateblack text-center">{cat.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Button 
              onClick={() => setShowMemberModal(true)}
              variant="primary"
              className="bg-leaf hover:bg-leaf-hover self-start"
            >
              Donate Now <Heart className="w-4 h-4 fill-white text-white" />
            </Button>
          </div>

          {/* Column 3: Why Choose Pick&Give? */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className="text-left">
              <h2 className="text-3xl font-extrabold text-forest mb-4 font-serif">
                Why Choose Pick&Give? ✨
              </h2>
              <p className="text-mutegreen text-sm mb-8 leading-relaxed font-medium">
                Transparency and safety are built into every contribution. Know exactly where your support lands.
              </p>

              {/* Feature highlights list */}
              <div className="flex flex-col gap-4 mb-8">
                {BENEFITS.map((benefit, idx) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={idx} className="flex gap-4 items-start p-3 rounded-xl border border-forest/5 hover:border-leaf/25 hover:bg-white hover:shadow-sm transition-all duration-300">
                      <div className="w-9 h-9 rounded-lg bg-leaf/10 flex items-center justify-center text-leaf flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-forest mb-0.5">
                          {benefit.title}
                        </h4>
                        <p className="text-xs text-mutegreen leading-relaxed font-medium">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-mutegreen text-left font-sans">
              <Info className="w-4 h-4 text-leaf flex-shrink-0" />
              Secure verified operations inside your city.
            </div>
          </div>

        </div>
      </section>

      {/* DEDICATED ABOUT US SECTION */}
      <section id="about-us" className="py-20 px-4 md:px-8 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-forest mb-4 font-serif">
              About Pick&Give 🌿
            </h2>
            <div className="w-16 h-1 bg-leaf mx-auto mb-6 rounded-full"></div>
            <p className="text-mutegreen text-base font-medium leading-relaxed">
              We are a dedicated community bridge designed to connect kind hearts directly with local social needs. By matching generous donors, reliable volunteer drivers, and verified NGOs, we ensure that every single item makes a meaningful, direct difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Card 1: Our Mission */}
            <div className="bg-cream/25 border border-forest/5 p-8 rounded-2xl hover:border-leaf/30 transition-all duration-300 text-left">
              <div className="w-12 h-12 bg-leaf/10 rounded-xl flex items-center justify-center text-leaf mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-forest mb-3 font-serif">Our Mission</h3>
              <p className="text-sm text-mutegreen leading-relaxed font-medium">
                To simplify material philanthropy by creating a transparent, real-time connected logistics system where people can easily donate items they no longer need directly to those who do.
              </p>
            </div>

            {/* Card 2: Transparency First */}
            <div className="bg-cream/25 border border-forest/5 p-8 rounded-2xl hover:border-leaf/30 transition-all duration-300 text-left">
              <div className="w-12 h-12 bg-forest/10 rounded-xl flex items-center justify-center text-forest mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-forest mb-3 font-serif">Transparency First</h3>
              <p className="text-sm text-mutegreen leading-relaxed font-medium">
                Every matched donation is tracked from pickup to handoff. Verified photograph confirmations and direct notifications give our donors absolute confidence and visual impact proof.
              </p>
            </div>

            {/* Card 3: Direct Community Contact */}
            <div className="bg-cream/25 border border-forest/5 p-8 rounded-2xl hover:border-leaf/30 transition-all duration-300 flex flex-col justify-between text-left">
              <div>
                <div className="w-12 h-12 bg-leaf/10 rounded-xl flex items-center justify-center text-[#7EB138] mb-6">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-forest mb-3 font-serif">Connect Directly</h3>
                <p className="text-sm text-mutegreen leading-relaxed font-medium mb-4">
                  Need custom delivery coordination or NGO bulk integrations? Speak directly with our dedicated community support desk.
                </p>
              </div>
              <div className="border-t border-forest/5 pt-4 flex flex-col gap-2 font-sans">
                <a href="tel:+919876543210" className="flex items-center gap-2 text-xs font-bold text-forest hover:text-leaf transition-colors text-left">
                  <Phone className="w-3.5 h-3.5 text-leaf" /> +91 98765 43210 (Toll-Free Support)
                </a>
                <a href="tel:+919999988888" className="flex items-center gap-2 text-xs font-bold text-forest hover:text-leaf transition-colors text-left">
                  <Phone className="w-3.5 h-3.5 text-leaf" /> +91 99999 88888 (NGO Desk Coordinator)
                </a>
              </div>
            </div>
          </div>
          
          <div className="bg-[#0F340F] text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-sage">
                <Info className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-left">
                <h4 className="text-lg font-bold font-serif text-white">Have questions about donation packaging?</h4>
                <p className="text-xs text-white/70 font-semibold font-sans">Reach our verified team 24/7 via hotlines or email support.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 items-center font-sans">
              <a href="tel:+919876543210" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-leaf text-white font-bold text-xs hover:bg-leaf-hover transition-all">
                <Phone className="w-3 h-3" /> Call: +91 98765 43210
              </a>
              <a href="mailto:support@pickandgive.org" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-all border border-white/10">
                <Mail className="w-3 h-3" /> support@pickandgive.org
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA BANNER */}
      <footer className="bg-forest text-white py-16 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3 filter blur-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4 filter blur-xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/10 pb-12 relative z-10">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 font-serif">
              Small Acts. Lasting Impact.
            </h2>
            <p className="text-sage text-sm font-semibold font-sans">
              Join thousands of kind hearts making a difference every single day.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              onClick={() => setShowMemberModal(true)}
              variant="primary"
              className="bg-leaf hover:bg-leaf-hover px-5 py-3 text-sm font-bold text-white shadow-sm"
            >
              <UserPlus className="w-4 h-4" /> Join as Member
            </Button>
            <Button 
              onClick={() => setShowNgoModal(true)}
              variant="outline"
              className="px-5 py-3 text-sm font-bold border-white/30 text-white hover:bg-white/10 hover:border-white hover:scale-[1.02]"
            >
              <Building className="w-4 h-4" /> Register NGO
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50 relative z-10 font-sans">
          <p>© {new Date().getFullYear()} Pick&Give. From Your Hands to Those in Need. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-sage font-semibold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-sage" />
            Be the reason someone smiles today. ❤️
          </div>
        </div>
      </footer>

      <AuthModals
        showMemberModal={showMemberModal}
        setShowMemberModal={setShowMemberModal}
        showNgoModal={showNgoModal}
        setShowNgoModal={setShowNgoModal}
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
        memberSuccess={memberSuccess}
        memberForm={memberForm}
        setMemberForm={setMemberForm}
        handleMemberSubmit={handleMemberSubmit}
        ngoSuccess={ngoSuccess}
        ngoForm={ngoForm}
        setNgoForm={setNgoForm}
        handleNgoSubmit={handleNgoSubmit}
        uploadedFileName={uploadedFileName}
        handleFileChange={handleFileChange}
        signInSuccess={signInSuccess}
        signInEmail={signInEmail}
        setSignInEmail={setSignInEmail}
        signInPassword={signInPassword}
        setSignInPassword={setSignInPassword}
        signInError={signInError}
        handleSignIn={handleSignIn}
        showVerificationModal={showVerificationModal}
        setShowVerificationModal={setShowVerificationModal}
        verificationEmail={verificationEmail}
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        verificationError={verificationError}
        verificationSuccess={verificationSuccess}
        handleVerifyEmail={handleVerifyEmail}
        memberError={memberError}
        ngoError={ngoError}
      />
    </div>
  );
}
