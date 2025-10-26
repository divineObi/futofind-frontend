import React from 'react';

interface StatusBadgeProps {
  status: 'found' | 'pending' | 'claimed' | 'approved' | 'rejected';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusStyles: { [key: string]: string } = {
    // Item Statuses
    found: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    claimed: 'bg-green-100 text-green-800',
    // Claim Statuses
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const text = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}
    >
      {text}
    </span>
  );
};

export default StatusBadge;