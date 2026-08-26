// frontend/src/components/Member/MemberUrgentNeeds.jsx
import React from 'react';
import { SectionHeader } from '../UI/SectionHeader';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Button } from '../UI/Button';

export function MemberUrgentNeeds({
  ngoRequests,
  currentMember,
  setNewBooking,
  setDashboardTab
}) {
  const activeRequests = ngoRequests.filter(r => r.status !== 'Stopped');

  return (
    <div className="space-y-6 animate-fade-in text-left font-sans">
      <SectionHeader
        title="URGENT NGO REQUIREMENTS"
        subtitle="Local verified organizations have immediate material shortages. Fulfill a request to double your impact today."
        icon="🚨"
      >
        <span className="bg-red-50 text-red-750 px-3.5 py-1.5 rounded-full text-xs font-bold border border-red-200 select-none animate-pulse">
          {activeRequests.length} Emergency Shortages
        </span>
      </SectionHeader>

      {activeRequests.length === 0 ? (
        <Card className="p-12 text-center shadow-sm">
          <p className="text-xs text-[#556B5D] font-bold py-4 text-center">No active NGO requirements posted at the moment. Check back later!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeRequests.map((req) => {
            const [fulfilledVal, totalVal] = req.fulfilled.split('/').map(Number);
            const percent = Math.min(100, Math.round((fulfilledVal / totalVal) * 100)) || 0;
            return (
              <Card key={req._id || req.id} className="flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#F8FAF5] text-[#0F340F] border border-[#0F340F]/10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {req.category}
                      </span>
                      <Badge status={`${req.urgency} Urgency`} />
                    </div>
                    <span className="text-[10px] text-[#556B5D] font-bold">
                      {req.date}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[#78A642] uppercase tracking-wider block mb-0.5">
                      🏫 {req.ngo}
                    </span>
                    <h4 className="text-base font-extrabold text-[#0F340F] font-serif leading-tight">
                      {req.title}
                    </h4>
                    <p className="text-xs text-[#556B5D] mt-2 leading-relaxed font-semibold">
                      {req.description || "Looking for generous contributions from members. Dropoff coordinates locked at NGO shelter center."}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#0F340F]/5">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#556B5D]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#556B5D]">Progress:</span>
                      <span className="bg-[#78A642]/10 text-[#78A642] px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#78A642]/20">
                        {req.fulfilled} Items
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#556B5D]">
                      {percent}% fulfilled
                    </span>
                  </div>

                  <div className="w-full bg-[#0F340F]/5 rounded-full h-2 overflow-hidden border border-[#0F340F]/5">
                    <div 
                      className="bg-[#78A642] h-full transition-all duration-500" 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      onClick={() => {
                        setNewBooking({
                          step: 2,
                          category: req.category,
                          title: `Fulfillment: ${req.title}`,
                          description: `Fulfilling urgent request for ${req.quantity} units of ${req.title} posted by ${req.ngo}.`,
                          photo: null,
                          photoName: '',
                          address: currentMember.location,
                          instructions: '',
                          ngoName: req.ngo,
                          isFulfillment: true,
                          requestId: req._id || req.id
                        });
                        setDashboardTab('donate');
                      }}
                      variant="primary"
                      size="sm"
                      className="rounded-xl font-bold"
                    >
                      🎁 Fulfill Request
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
