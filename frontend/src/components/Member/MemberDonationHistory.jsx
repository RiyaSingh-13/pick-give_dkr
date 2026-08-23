// frontend/src/components/Member/MemberDonationHistory.jsx
import React from 'react';
import { InteractiveRouteMap } from '../Map/InteractiveRouteMap';
import { SectionHeader } from '../UI/SectionHeader';
import { Badge } from '../UI/Badge';
import { Button } from '../UI/Button';

export function MemberDonationHistory({
  activeDonations,
  selectedDonationId,
  setSelectedDonationId,
  adminNgos,
  handleStartSelfTransit,
  handleCompleteSelfDelivery
}) {
  const [selfDeliveryOtp, setSelfDeliveryOtp] = React.useState('');
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <SectionHeader title="MY DONATIONS LOG" icon="🎁" />
      
      <div className="bg-white border border-[#0F340F]/8 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs font-semibold text-[#556B5D]">
          <thead>
            <tr className="bg-[#F8FAF5] border-b border-[#0F340F]/5 text-[10px] font-extrabold text-[#576F5E] uppercase tracking-wider">
              <th className="p-4">Donation ID</th>
              <th className="p-4">Item Title</th>
              <th className="p-4">Partner NGO</th>
              <th className="p-4">Delivery Mode</th>
              <th className="p-4">Status</th>
              <th className="p-4">Log Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0F340F]/5 text-xs text-[#0F340F] font-bold">
            {activeDonations.map((item) => {
              const itemId = item._id || item.id;
              const isSelected = selectedDonationId === itemId;
              const statusStr = item.status === 'Delivered' 
                ? 'Delivered' 
                : item.status === 'In Transit' 
                  ? 'In Transit' 
                  : item.courier && item.courier.includes('Claimed') 
                    ? 'Awaiting Pickup' 
                    : 'Offer Posted';

              return (
                <React.Fragment key={itemId}>
                  <tr 
                    onClick={() => setSelectedDonationId(isSelected ? null : itemId)}
                    className={`hover:bg-[#F8FAF5]/40 transition-colors cursor-pointer select-none ${
                      isSelected ? 'bg-[#F8FAF5]/60 border-l-4 border-[#78A642]' : ''
                    }`}
                  >
                    <td className="p-4 font-mono text-[#576F5E]">
                      <span className="flex items-center gap-1.5">
                        {isSelected ? '▼' : '▶'} #{(itemId || '').toString().slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 font-serif text-sm">{item.title}</td>
                    <td className="p-4 text-[#576F5E] font-semibold">{item.ngo}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold ${
                        item.deliveryMode === 'Self' ? 'text-[#78A642]' : 'text-blue-600'
                      }`}>
                        {item.deliveryMode === 'Self' ? '🙋‍♂️ Self' : '🚚 Volunteer'}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge status={statusStr} />
                    </td>
                    <td className="p-4 text-[#576F5E] font-semibold">{item.date}</td>
                  </tr>
                  {isSelected && (
                    <tr>
                      <td colSpan="6" className="p-6 bg-[#F8FAF5]/40 border-t border-b border-[#0F340F]/5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start text-left font-sans">
                          <div className="space-y-4">
                            <div className="bg-white border border-[#0F340F]/8 rounded-xl p-5 shadow-sm space-y-3">
                              <h4 className="text-sm font-extrabold text-[#0F340F] font-serif border-b border-[#0F340F]/5 pb-2 flex items-center gap-1.5">
                                <span>📋</span> Donation Handoff Metrics
                              </h4>
                              <div className="space-y-2 text-xs font-semibold text-[#556B5D] leading-relaxed">
                                <p><span className="text-[#0F340F] font-bold">Description:</span> {item.description || 'No description provided.'}</p>
                                {item.deliveryMode !== 'Self' && <p><span className="text-[#0F340F] font-bold">Pickup Point:</span> {item.location}</p>}
                                {item.deliveryMode !== 'Self' && item.instructions && <p><span className="text-[#0F340F] font-bold">Instructions:</span> {item.instructions}</p>}
                                <p><span className="text-[#0F340F] font-bold">Delivery Mode:</span> {item.deliveryMode === 'Self' ? 'Self Deliver' : 'Volunteer Delivery'}</p>
                                <p><span className="text-[#0F340F] font-bold">Current Courier:</span> {item.courier || 'None (Awaiting NGO Acceptance & Courier)'}</p>
                              </div>
                            </div>

                            {item.deliveryMode === 'Self' ? (
                              <div className="bg-[#F8FAF5] border border-[#78A642]/30 rounded-xl p-5 shadow-sm space-y-2.5 relative overflow-hidden">
                                <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#78A642]"></div>
                                <h4 className="text-xs font-extrabold text-[#0F340F] uppercase tracking-widest flex items-center gap-1.5 select-none">
                                  <span>🙋‍♂️</span> Self-Delivery Instructions
                                </h4>
                                
                                {item.status === 'Offer Posted' && (
                                  <div className="space-y-2">
                                    <p className="text-[11px] text-amber-700 leading-normal font-bold bg-amber-50 p-2.5 border border-amber-200/50 rounded-xl font-sans">
                                      ⏳ Awaiting NGO Acceptance:<br/>
                                      <span className="font-semibold text-amber-600">Please wait for the NGO to accept this donation offer. Once accepted, the destination address details will be unlocked and you will be able to start delivery.</span>
                                    </p>
                                  </div>
                                )}

                                {item.status === 'Accepted' && (
                                  <>
                                    <p className="text-[11px] text-[#556B5D] leading-normal font-semibold font-sans">
                                      The NGO has accepted your offer! When you are ready to drop off the items at the NGO's address shown on the map, click the button below to start self-delivery.
                                    </p>
                                    <Button
                                      onClick={() => handleStartSelfTransit(itemId)}
                                      className="w-full mt-2 font-sans rounded-xl py-2.5"
                                    >
                                      🚀 Start Self Delivery (Mark In Transit)
                                    </Button>
                                  </>
                                )}

                                {item.status === 'In Transit' && (
                                  <div className="space-y-3 pt-1">
                                    <p className="text-[11px] text-[#556B5D] leading-normal font-semibold font-sans">
                                      You are currently delivering the package. When you arrive at the NGO facility, **ask the NGO staff for their 4-digit Delivery Handoff OTP** and enter it below to complete the delivery:
                                    </p>
                                    <div className="flex gap-2">
                                      <input 
                                        type="text" 
                                        maxLength={4}
                                        placeholder="Enter NGO OTP"
                                        value={selfDeliveryOtp}
                                        onChange={(e) => setSelfDeliveryOtp(e.target.value.replace(/\D/g, ''))}
                                        className="flex-1 px-3.5 py-2 border border-[#0F340F]/15 rounded-xl bg-white text-xs font-mono text-center font-bold tracking-widest focus:outline-none focus:border-[#78A642]"
                                      />
                                      <Button
                                        onClick={async () => {
                                          if (!selfDeliveryOtp || selfDeliveryOtp.length !== 4) {
                                            alert("Please enter a valid 4-digit OTP code.");
                                            return;
                                          }
                                          const success = await handleCompleteSelfDelivery(itemId, selfDeliveryOtp);
                                          if (success) {
                                            setSelfDeliveryOtp('');
                                          }
                                        }}
                                        className="bg-[#0F340F] hover:bg-[#1C4A1C] font-sans py-2 px-4 rounded-xl text-xs"
                                      >
                                        Verify & Complete
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {item.status === 'Delivered' && (
                                  <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-200 text-xs font-semibold leading-relaxed flex items-center gap-2 font-sans">
                                    <span>✔️</span>
                                    <span>Self-delivery completed successfully. Thank you for your contribution!</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="bg-[#FFFDF4] border border-amber-200 rounded-xl p-5 shadow-sm space-y-2.5 relative overflow-hidden">
                                <div className="absolute top-0 bottom-0 left-0 w-1 bg-amber-400"></div>
                                <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-widest flex items-center gap-1.5 select-none">
                                  <span>🔑</span> Pickup Verification OTP
                                </h4>
                                <div className="inline-flex items-center justify-center bg-white border border-amber-200 px-4 py-2.5 rounded-lg font-mono text-xl font-black text-amber-700 tracking-wider shadow-inner select-all">
                                  {item.otp || '4891'}
                                </div>
                                <p className="text-[10px] text-amber-800 leading-normal font-semibold">
                                  Please **provide this 4-digit code** to the volunteer courier when they physically arrive at your doorstep. They must enter this code into their platform interface to verify and start the transit safely.
                                </p>
                              </div>
                            )}
                          </div>

                          <div>
                            <InteractiveRouteMap 
                              pickupAddress={item.deliveryMode === 'Self' ? 'Self Delivery (Donor Drop-off)' : item.location}
                              dropoffAddress={adminNgos.find(n => n.ngoName === item.ngo)?.address || item.ngo}
                              dropoffNgo={item.ngo}
                              status={item.status}
                              courierName={item.deliveryMode === 'Self' ? 'Self (Donor)' : item.courier}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
