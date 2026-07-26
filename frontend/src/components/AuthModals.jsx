// frontend/src/components/AuthModals.jsx
import React from 'react';
import { X, CheckCircle, Upload, Building, Check } from 'lucide-react';
import { Logo } from './Logo';
import { Modal } from './UI/Modal';
import { Button } from './UI/Button';

export function AuthModals({
  showMemberModal,
  setShowMemberModal,
  showNgoModal,
  setShowNgoModal,
  showSignInModal,
  setShowSignInModal,
  memberSuccess,
  memberForm,
  setMemberForm,
  handleMemberSubmit,
  ngoSuccess,
  ngoForm,
  setNgoForm,
  handleNgoSubmit,
  uploadedFileName,
  handleFileChange,
  signInSuccess,
  signInEmail,
  setSignInEmail,
  signInPassword,
  setSignInPassword,
  signInError,
  handleSignIn,
  showVerificationModal,
  setShowVerificationModal,
  verificationEmail,
  verificationCode,
  setVerificationCode,
  verificationError,
  verificationSuccess,
  handleVerifyEmail
}) {
  return (
    <>
      {/* MEMBER REGISTRATION MODAL */}
      <Modal
        isOpen={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        maxWidth="max-w-lg"
      >
        <div className="flex justify-center mb-6">
          <Logo showText={false} />
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A3828] text-center mb-8 font-serif uppercase tracking-tight leading-tight">
          Member Registration Form:<br />
          <span className="text-leaf">Personal Info</span>
        </h2>

        {memberSuccess ? (
          <div className="text-center py-12 flex flex-col items-center gap-4 animate-pulse">
            <div className="w-16 h-16 rounded-full bg-leaf/10 flex items-center justify-center text-leaf">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-forest font-serif">Welcome Aboard!</h3>
            <p className="text-sm text-mutegreen font-semibold">Your Member Account has been created successfully. Logging you in...</p>
          </div>
        ) : (
          <form onSubmit={handleMemberSubmit} className="space-y-6 relative z-10 text-left">
            <div>
              <label className="input-label">1. Full Name:</label>
              <input 
                type="text" 
                required 
                value={memberForm.fullName}
                onChange={(e) => setMemberForm({ ...memberForm, fullName: e.target.value })}
                className="input-box border border-forest/20 animate-fade-in"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="input-label">2. Email Address:</label>
              <input 
                type="email" 
                required 
                value={memberForm.email}
                onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                className="input-box border border-forest/20 animate-fade-in"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="input-label">3. Phone Number:</label>
              <input 
                type="tel" 
                required 
                value={memberForm.phone}
                onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                className="input-box border border-forest/20 animate-fade-in"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="input-label">4. Location (City/Area or Zip Code):</label>
              <span className="text-[11px] font-semibold text-mutegreen mb-1.5 block -mt-1 font-sans">
                (Crucial for local community matching)
              </span>
              <input 
                type="text" 
                required 
                value={memberForm.location}
                onChange={(e) => setMemberForm({ ...memberForm, location: e.target.value })}
                className="input-box border border-forest/20 animate-fade-in"
                placeholder="e.g. New Delhi or 110001"
              />
            </div>

            <div>
              <label className="input-label">5. Security Password:</label>
              <input 
                type="password" 
                required 
                value={memberForm.password}
                onChange={(e) => setMemberForm({ ...memberForm, password: e.target.value })}
                className="input-box border border-forest/20 animate-fade-in"
                placeholder="Create a secure password"
              />
            </div>

            <div className="pt-2 flex justify-center">
              <Button 
                type="submit"
                className="w-full sm:w-auto px-10 py-3.5 text-base font-bold"
              >
                JOIN AS MEMBER
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* NGO REGISTRATION MODAL */}
      <Modal
        isOpen={showNgoModal}
        onClose={() => setShowNgoModal(false)}
        maxWidth="max-w-xl"
      >
        <div className="flex justify-center mb-6">
          <Logo showText={false} />
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A3828] text-center mb-8 font-serif uppercase tracking-tight leading-tight">
          NGO Registration Form:<br />
          <span className="text-leaf">Organization Info</span>
        </h2>

        {ngoSuccess ? (
          <div className="text-center py-12 flex flex-col items-center gap-4 animate-pulse">
            <div className="w-16 h-16 rounded-full bg-leaf/10 flex items-center justify-center text-leaf">
              <Building className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-forest font-serif">NGO Registered!</h3>
            <p className="text-sm text-mutegreen font-semibold">Your credentials have been submitted for verification checks.</p>
          </div>
        ) : (
          <form onSubmit={handleNgoSubmit} className="space-y-5 text-left max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
            <div>
              <label className="input-label">1. NGO Name:</label>
              <input 
                type="text" 
                required 
                value={ngoForm.ngoName}
                onChange={(e) => setNgoForm({ ...ngoForm, ngoName: e.target.value })}
                className="input-box border border-forest/20 animate-fade-in"
                placeholder="Enter official NGO name"
              />
            </div>

            <div>
              <label className="input-label">2. Official Email Address:</label>
              <input 
                type="email" 
                required 
                value={ngoForm.officialEmail}
                onChange={(e) => setNgoForm({ ...ngoForm, officialEmail: e.target.value })}
                className="input-box border border-forest/20 animate-fade-in"
                placeholder="ngo@organization.org"
              />
            </div>

            <div>
              <label className="input-label">3. Phone Number:</label>
              <input 
                type="tel" 
                required 
                value={ngoForm.phone}
                onChange={(e) => setNgoForm({ ...ngoForm, phone: e.target.value })}
                className="input-box border border-forest/20 animate-fade-in"
                placeholder="NGO Support contact number"
              />
            </div>

            <div>
              <label className="input-label">4. Full Address & Operating City:</label>
              <textarea 
                required 
                rows="3"
                value={ngoForm.address}
                onChange={(e) => setNgoForm({ ...ngoForm, address: e.target.value })}
                className="input-box border border-forest/20 resize-none py-2"
                placeholder="Enter complete office address and primary service city"
              />
            </div>

            <div>
              <label className="input-label">5. Description of NGO:</label>
              <span className="text-[11px] font-semibold text-mutegreen mb-1 block -mt-1 font-sans">
                (Explain your mission, causes, and goals)
              </span>
              <textarea 
                required 
                rows="3"
                value={ngoForm.description}
                onChange={(e) => setNgoForm({ ...ngoForm, description: e.target.value })}
                className="input-box border border-forest/20 resize-none py-2"
                placeholder="Briefly tell us about your causes..."
              />
            </div>

            <div className="border border-dashed border-forest/35 p-4 rounded-xl bg-cream/20">
              <label className="input-label">6. Registration Number (for verification):</label>
              <input 
                type="text" 
                required 
                value={ngoForm.registrationNumber}
                onChange={(e) => setNgoForm({ ...ngoForm, registrationNumber: e.target.value })}
                className="input-box border border-forest/25 font-mono"
                placeholder="e.g. REG-12345678"
              />
            </div>

            <div className="border border-dashed border-leaf/40 p-4 rounded-xl bg-[#7EB138]/5">
              <label className="input-label">7. Upload Verification Certificate:</label>
              <span className="text-[11px] font-semibold text-mutegreen mb-2 block -mt-1 font-sans">
                (Attach official Government NGO license or certification in PDF, JPG, or PNG format)
              </span>
              <div className="relative flex flex-col items-center justify-center border border-dashed border-[#7EB138]/30 py-4 rounded-lg bg-white hover:bg-cream/40 transition-colors cursor-pointer group">
                <input 
                  type="file" 
                  required 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="w-6 h-6 text-leaf group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-bold text-forest">
                  {uploadedFileName ? uploadedFileName : "Click to select certificate file"}
                </span>
                <span className="text-[9px] text-[#556B5D] mt-0.5 font-sans">Max size: 5MB</span>
              </div>
            </div>

            <div className="border border-[#0F340F]/15 p-4 rounded-xl bg-cream/10">
              <label className="input-label">8. Security Password:</label>
              <input 
                type="password" 
                required 
                value={ngoForm.password}
                onChange={(e) => setNgoForm({ ...ngoForm, password: e.target.value })}
                className="input-box border border-forest/20 animate-fade-in"
                placeholder="Create a secure password"
              />
            </div>

            <div className="pt-2 flex justify-center">
              <Button 
                type="submit"
                className="w-full sm:w-auto px-10 py-3.5 text-base font-bold"
              >
                REGISTER NGO
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* SIGN IN MODAL */}
      <Modal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        maxWidth="max-w-md"
      >
        <div className="flex justify-center mb-6">
          <Logo showText={false} />
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A3828] text-center mb-6 font-serif uppercase tracking-tight leading-tight">
          Welcome Back<br />
          <span className="text-leaf">Sign In</span>
        </h2>

        {signInSuccess ? (
          <div className="text-center py-8 flex flex-col items-center gap-4 animate-pulse">
            <div className="w-14 h-14 rounded-full bg-leaf/10 flex items-center justify-center text-leaf">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-forest font-serif">Signed In Successfully!</h3>
            <p className="text-xs text-mutegreen font-semibold">Redirecting you to your workspace...</p>
          </div>
        ) : (
          <form onSubmit={handleSignIn} className="space-y-5 relative z-10 text-left">
            {signInError && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-xl text-xs font-semibold leading-relaxed animate-fade-in text-left">
                ⚠️ {signInError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="input-label">Email Address:</label>
                <input 
                  type="email" 
                  required 
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  className="input-box border border-forest/20 animate-fade-in"
                  placeholder="Enter your registered email address"
                />
              </div>

              <div>
                <label className="input-label">Password:</label>
                <input 
                  type="password" 
                  required 
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="input-box border border-forest/20 animate-fade-in"
                  placeholder="Enter your security password"
                />
              </div>

              <p className="text-[10px] text-mutegreen font-semibold leading-relaxed mt-1.5 text-left font-sans">
                💡 Hint: Create a Member or NGO account using the links in the header, then sign in with your email and password here!
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <Button 
                type="submit"
                className="w-full px-10 py-3.5 text-base font-bold"
              >
                SIGN IN
              </Button>
            </div>
          </form>
      </Modal>

      {/* EMAIL VERIFICATION MODAL */}
      <Modal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        maxWidth="max-w-md"
      >
        <div className="flex justify-center mb-6">
          <Logo showText={false} />
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A3828] text-center mb-4 font-serif uppercase tracking-tight leading-tight">
          Verify Your<br />
          <span className="text-leaf">Email Address</span>
        </h2>
        
        <p className="text-xs text-[#556B5D] text-center mb-6 font-semibold font-sans leading-relaxed">
          We have generated a 6-digit verification code to secure your account. 
          {window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? (
            <span className="text-leaf block mt-2 font-extrabold bg-[#78A642]/10 p-2 rounded-xl">
              💡 Testing offline: Please check your terminal console/logs to retrieve your verification code.
            </span>
          ) : (
            <span className="text-leaf block mt-2 font-extrabold bg-[#78A642]/10 p-2 rounded-xl">
              💡 Please check your console/audit logs to retrieve your verification code.
            </span>
          )}
        </p>

        {verificationSuccess ? (
          <div className="text-center py-8 flex flex-col items-center gap-4 animate-pulse">
            <div className="w-14 h-14 rounded-full bg-leaf/10 flex items-center justify-center text-leaf">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-forest font-serif">Email Verified Successfully!</h3>
            <p className="text-xs text-mutegreen font-semibold">Creating secure session and entering workspace...</p>
          </div>
        ) : (
          <form onSubmit={handleVerifyEmail} className="space-y-5 relative z-10 text-left">
            {verificationError && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-xl text-xs font-semibold leading-relaxed animate-fade-in text-left">
                ⚠️ {verificationError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="input-label">6-Digit Verification Code:</label>
                <input 
                  type="text" 
                  maxLength="6"
                  required 
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="input-box border border-forest/20 animate-fade-in text-center font-bold tracking-widest text-lg font-mono"
                  placeholder="000000"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <Button 
                type="submit"
                className="w-full px-10 py-3.5 text-base font-bold"
              >
                VERIFY & START
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
