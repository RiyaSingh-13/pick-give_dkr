// frontend/src/components/Member/MemberDeliveries.jsx
import React from 'react';
import { Truck } from 'lucide-react';
import { InteractiveRouteMap } from '../Map/InteractiveRouteMap';
import { SectionHeader } from '../UI/SectionHeader';
import { Badge } from '../UI/Badge';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { api } from '../../services/api';

export function MemberDeliveries({
  memberDeliveries,
  currentMember,
  adminNgos,
  otpInputValues,
  setOtpInputValues,
  otpErrors,
  setOtpErrors,
  fetchAllData
}) {
  return (
    <div className="space-y-6 animate-fade-in text-left font-sans">
      <SectionHeader title="VOLUNTEER RUN LOGS" icon="📋" />
      
      {memberDeliveries.length === 0 ? (
        <Card className="p-12 text-center text-[#576F5E]">
          <Truck className="w-12 h-12 text-[#576F5E]/30 mx-auto mb-3" />
          <p className="text-sm font-bold">You have no active or completed volunteer delivery runs.</p>
          <p className="text-xs mt-1">Accept courier tasks on the workboard to start supporting local pipelines.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="p-5 bg-[#F8FAF5] border border-[#0F340F]/8 rounded-2xl font-serif font-bold text-[#0F340F] flex items-center justify-between shadow-sm select-none">
            <span>📋 Active Delivery Navigator HUD</span>
            <span className="text-xs font-sans font-bold bg-[#0F340F]/5 text-[#0F340F] px-3 py-1 rounded-full border border-[#0F340F]/10">Total claimed runs: {memberDeliveries.length}</span>
          </div>
          <div className="space-y-6">
            {memberDeliveries.map(task => {
              const isAwaitingPickup = task.status === 'Accepted';
              const statusStr = task.status === 'Delivered' ? 'Delivered' : task.status === 'In Transit' ? 'In Transit' : 'Awaiting Pickup';

              return (
                <Card key={task.id} className="flex flex-col gap-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#0F340F]/5 pb-3">
                    <div>
                      <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-[#78A642] px-2.5 py-0.5 bg-[#78A642]/10 rounded-full select-none">
                        Task #{task.id ? task.id.toString().slice(-6).toUpperCase() : ''}
                      </span>
                      <h4 className="text-base font-extrabold text-[#0F340F] mt-1.5 leading-tight font-serif">{task.title}</h4>
                      <p className="text-xs font-semibold text-[#556B5D] mt-1.5 flex flex-wrap gap-x-2 gap-y-1 font-sans">
                        <span>📍 Pickup Address:</span> 
                        <span className="text-[#0F340F] font-bold">{task.location}</span> 
                        <span className="text-[#556B5D]/40">➔</span>
                        <span>NGO Destination:</span> 
                        <span className="text-[#0F340F] font-bold">{task.ngo}</span>
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge status={statusStr} />

                      {task.status === 'In Transit' && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full uppercase tracking-wider select-none font-sans">
                          🚚 In Transit
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    <div className="space-y-4">
                      {isAwaitingPickup ? (
                        <div className="bg-[#FFFDF4] border border-amber-200 rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden text-left font-sans">
                          <div className="absolute top-0 bottom-0 left-0 w-1 bg-amber-400"></div>
                          <div>
                            <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-widest flex items-center gap-1.5 select-none">
                              <span>🔑</span> Secure Pickup OTP Verification Required
                            </h4>
                            <p className="text-[11px] text-amber-800 font-semibold leading-relaxed mt-1">
                              To maintain high community safety standards, ask the donor for their **4-digit Pickup Verification OTP** and enter it below to confirm the pickup and begin the transit run.
                            </p>
                          </div>

                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                maxLength="4"
                                placeholder="Enter 4-Digit OTP"
                                value={otpInputValues[task.id] || ''}
                                onChange={(e) => setOtpInputValues({ ...otpInputValues, [task.id]: e.target.value.replace(/\D/g, '') })}
                                className="bg-white border border-amber-200 rounded-lg px-3 py-2 text-sm font-bold font-mono tracking-widest text-[#0F340F] focus:outline-none focus:ring-2 focus:ring-amber-400/40 w-full placeholder-amber-900/30 shadow-inner"
                              />
                              <Button
                                onClick={async () => {
                                  const otp = otpInputValues[task.id];
                                  if (!otp || otp.length !== 4) {
                                    setOtpErrors({ ...otpErrors, [task.id]: 'Please enter a valid 4-digit OTP code.' });
                                    return;
                                  }
                                  try {
                                    const res = await api.verifyPickupOtp(task.id, otp, currentMember.fullName);
                                    const data = await res.json();
                                    if (res.ok) {
                                      setOtpInputValues({ ...otpInputValues, [task.id]: '' });
                                      setOtpErrors({ ...otpErrors, [task.id]: '' });
                                      fetchAllData();
                                    } else {
                                      setOtpErrors({ ...otpErrors, [task.id]: data.error || 'Failed to verify OTP.' });
                                    }
                                  } catch (err) {
                                    setOtpErrors({ ...otpErrors, [task.id]: 'Connection error. Please try again.' });
                                  }
                                }}
                                variant="primary"
                                className="rounded-lg font-bold text-xs"
                              >
                                Confirm & Start
                              </Button>
                            </div>

                            {otpErrors[task.id] && (
                              <p className="text-[10px] font-bold text-red-600 animate-pulse">
                                ⚠️ {otpErrors[task.id]}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : task.status === 'In Transit' ? (
                        <div className="bg-[#FFFDF4] border border-amber-200 rounded-xl p-5 shadow-sm space-y-4 text-left font-sans relative overflow-hidden">
                          <div className="absolute top-0 bottom-0 left-0 w-1 bg-amber-400"></div>
                          <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-widest flex items-center gap-1.5 select-none">
                            <span>🔑</span> Secure NGO Delivery OTP Required
                          </h4>
                          <p className="text-[11px] text-[#556B5D] font-semibold leading-relaxed">
                            Ask the NGO staff for their **4-digit Delivery Handoff OTP** and enter it below to confirm and complete this delivery run:
                          </p>
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                maxLength={4}
                                placeholder="Enter 4-Digit NGO OTP"
                                value={otpInputValues[task.id] || ''}
                                onChange={(e) => setOtpInputValues({ ...otpInputValues, [task.id]: e.target.value.replace(/\D/g, '') })}
                                className="bg-white border border-amber-200 rounded-lg px-3 py-2 text-sm font-bold font-mono tracking-widest text-[#0F340F] focus:outline-none focus:ring-2 focus:ring-amber-400/40 w-full placeholder-amber-900/30 shadow-inner"
                              />
                              <Button
                                onClick={async () => {
                                  const otp = otpInputValues[task.id];
                                  if (!otp || otp.length !== 4) {
                                    setOtpErrors({ ...otpErrors, [task.id]: 'Please enter a valid 4-digit OTP code.' });
                                    return;
                                  }
                                  try {
                                    const res = await api.verifyDeliveryOtp(task.id, otp, currentMember.fullName);
                                    const data = await res.json();
                                    if (res.ok) {
                                      setOtpInputValues({ ...otpInputValues, [task.id]: '' });
                                      setOtpErrors({ ...otpErrors, [task.id]: '' });
                                      fetchAllData();
                                    } else {
                                      setOtpErrors({ ...otpErrors, [task.id]: data.error || 'Failed to verify OTP.' });
                                    }
                                  } catch (err) {
                                    setOtpErrors({ ...otpErrors, [task.id]: 'Connection error. Please try again.' });
                                  }
                                }}
                                variant="primary"
                                className="rounded-lg font-bold text-xs"
                              >
                                Confirm & Complete
                              </Button>
                            </div>

                            {otpErrors[task.id] && (
                              <p className="text-[10px] font-bold text-red-600 animate-pulse">
                                ⚠️ {otpErrors[task.id]}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-[#F8FAF5] border border-[#0F340F]/8 rounded-xl p-5 shadow-sm space-y-4 text-left font-sans">
                          <h4 className="text-xs font-extrabold text-[#0F340F] uppercase tracking-widest flex items-center gap-1.5 select-none">
                            <span>🚚</span> Delivery Completed
                          </h4>
                          <div className="space-y-2 text-xs font-semibold text-[#556B5D] leading-relaxed">
                            <p><span className="text-[#0F340F] font-bold">Logistics Status:</span> Delivered successfully! Thank you for your volunteer service.</p>
                            <p><span className="text-[#0F340F] font-bold">Recipient NGO Hub:</span> {task.ngo}</p>
                            <p className="text-[11px] text-[#78A642] font-extrabold">🌿 Double platform impact points unlocked for this run!</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <InteractiveRouteMap 
                        pickupAddress={task.location}
                        dropoffAddress={adminNgos.find(n => n.ngoName === task.ngo)?.address || task.ngo}
                        dropoffNgo={task.ngo}
                        status={task.status}
                        courierName={task.status === 'Delivered' ? `${currentMember.fullName} (Completed)` : isAwaitingPickup ? `${currentMember.fullName} (Claimed)` : `${currentMember.fullName} (Active)`}
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
