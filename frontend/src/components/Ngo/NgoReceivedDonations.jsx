// frontend/src/components/Ngo/NgoReceivedDonations.jsx
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { SectionHeader } from '../UI/SectionHeader';
import { Table } from '../UI/Table';
import { Badge } from '../UI/Badge';
import { Card } from '../UI/Card';

export function NgoReceivedDonations({
  ngoReceived
}) {
  const tableHeaders = [
    { label: 'Item Details' },
    { label: 'Category' },
    { label: 'Donor Details' },
    { label: 'Courier Partner' },
    { label: 'Delivery OTP' },
    { label: 'Status' },
    { label: 'Accepted Date' }
  ];

  return (
    <div className="space-y-6 animate-fade-in text-left font-sans">
      <SectionHeader
        title="DONATIONS RECEIVED"
        subtitle="Track the status of the donations that your organization has accepted."
        icon="🤝"
      >
        <span className="bg-[#0F340F]/5 text-[#0F340F] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#0F340F]/10 select-none">
          {ngoReceived.length} Total Accepted
        </span>
      </SectionHeader>

      {ngoReceived.length === 0 ? (
        <Card className="p-12 text-center space-y-3 shadow-sm">
          <div className="w-16 h-16 bg-[#F8FAF5] rounded-full flex items-center justify-center mx-auto text-[#78A642]">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h4 className="font-extrabold text-[#0F340F] text-base font-serif">No Received Donations Yet</h4>
          <p className="text-xs text-[#556B5D] max-w-sm mx-auto leading-relaxed font-sans">You haven't accepted any donation offers. Go to the "Donation Box" tab to review and accept offers!</p>
        </Card>
      ) : (
        <Table headers={tableHeaders}>
          {ngoReceived.map((item) => (
            <tr key={item._id || item.id} className="hover:bg-[#F8FAF5]/40 transition-colors">
              <td className="px-6 py-4 font-bold text-[#0F340F] text-sm font-serif">
                {item.title}
              </td>
              <td className="px-6 py-4">
                <span className="bg-[#F8FAF5] text-[#0F340F] border border-[#0F340F]/10 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider font-sans">
                  {item.category}
                </span>
              </td>
              <td className="px-6 py-4 font-bold">
                {item.donor}
              </td>
              <td className="px-6 py-4">
                {item.deliveryMode === 'Self' ? (
                  <span className="text-[#78A642] font-bold flex items-center gap-1">
                    🙋‍♂️ Self Delivery (Donor)
                  </span>
                ) : item.courier === 'None (Awaiting Courier)' ? (
                  <span className="text-amber-600 font-bold flex items-center gap-1">
                    ⏳ Awaiting Courier
                  </span>
                ) : (
                  <span className="text-[#78A642] font-bold flex items-center gap-1">
                    🚚 {item.courier}
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <span className="font-mono text-sm font-black text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded shadow-inner">
                  {item.deliveryOtp}
                </span>
              </td>
              <td className="px-6 py-4">
                <Badge status={item.status} />
              </td>
              <td className="px-6 py-4 font-medium">
                {item.date}
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}
