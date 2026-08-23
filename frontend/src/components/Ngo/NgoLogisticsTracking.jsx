// frontend/src/components/Ngo/NgoLogisticsTracking.jsx
import React from 'react';
import { User, MapPinned } from 'lucide-react';
import { SectionHeader } from '../UI/SectionHeader';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';

export function NgoLogisticsTracking({
  ngoDeliveries
}) {
  return (
    <div className="space-y-6 animate-fade-in text-left font-sans">
      <SectionHeader
        title="ACTIVE COURIER & DELIVERIES"
        subtitle="Monitor volunteers transporting donation packages from donor doorstep to your facility."
        icon="🚚"
      >
        <span className="bg-[#78A642]/10 text-[#78A642] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#78A642]/20 select-none">
          {ngoDeliveries.length} Active Runs
        </span>
      </SectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ngoDeliveries.map((delivery) => (
          <Card key={delivery.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge status={delivery.status} />
              <span className="text-[10px] font-bold text-[#556B5D]">
                ID: #{delivery.id}
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-[#0F340F] font-serif">{delivery.item}</h4>
              <div className="text-xs font-semibold text-[#556B5D] mt-2 space-y-1.5 font-sans">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#78A642]" /> <span className="font-bold text-[#0F340F]">Courier:</span> {delivery.courier}
                </div>
                <div className="flex items-start gap-1.5">
                  <MapPinned className="w-4 h-4 text-[#78A642] mt-0.5" /> <span className="font-bold text-[#0F340F] flex-shrink-0">Pipeline:</span> <span className="leading-normal">{delivery.route}</span>
                </div>
              </div>
            </div>

            {delivery.status === 'On the way' && (
              <div className="space-y-2">
                <div className="bg-[#FFFDF4] border border-amber-200 p-3 rounded-xl flex items-center justify-between text-xs font-semibold">
                  <span className="text-amber-900 font-bold">🔑 Delivery Verification OTP:</span>
                  <span className="font-mono text-sm font-black text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-200">{delivery.deliveryOtp || '1234'}</span>
                </div>
                <div className="bg-[#F8FAF5] p-3 rounded-xl border border-[#0F340F]/5 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-[#556B5D] flex items-center gap-1">
                    📍 Live Courier Tracking Locked
                  </span>
                  <span className="text-[#78A642] font-black uppercase">Active (GPS verified)</span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
