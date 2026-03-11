import React from 'react';
import { Settings, Ban, FileText } from 'lucide-react';

interface Statistics {
  referralProvider: {
    totalCount: number;
    totalSkipped: number;
    totalMerged: number;
  };
  migratedCategory: {
    totalCount: number;
    totalSkipped: number;
    totalMerged: number;
    newlyCreated: number;
  };
  actions: {
    duplicateEmails: number;
    missingFirstName: number;
    missingLastName: number;
    invalidNPI: number;
    invalidPhone: number;
    invalidFax: number;
    invalidZip: number;
  };
}

interface SidebarProps {
  statistics: Statistics;
  onActionClick?: (actionType: string) => void;
  activeFilter?: string | null;
  onManageSources?: () => void;
  onSkipAll?: () => void;
  onViewSummary?: () => void;
}

export function Sidebar({ statistics, onActionClick, activeFilter, onManageSources, onSkipAll, onViewSummary }: SidebarProps) {
  const ActionItem = ({ label, count, type }: { label: string; count: number; type: string }) => {
    const isActive = activeFilter === type;
    return (
      <button
        onClick={() => onActionClick?.(type)}
        className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded transition-colors ${
          isActive
            ? 'bg-teal-100 text-teal-800 font-medium'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <span>{label}</span>
        {count > 0 && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center ${
            isActive ? 'bg-teal-600 text-white' : 'bg-red-500 text-white'
          }`}>
            {count}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <div className="space-y-2">
          <button
            onClick={onManageSources}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded transition-colors border border-gray-300 hover:bg-gray-50"
            style={{ color: '#227e85' }}
          >
            <Settings size={16} />
            Manage Referral Sources
          </button>
          <button
            onClick={onSkipAll}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded transition-colors border border-gray-300 hover:bg-gray-50"
            style={{ color: '#227e85' }}
          >
            <Ban size={16} />
            Skip All Records
          </button>
          <button
            onClick={onViewSummary}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded transition-colors border border-gray-300 hover:bg-gray-50"
            style={{ color: '#227e85' }}
          >
            <FileText size={16} />
            View Summary
          </button>
        </div>
      </div>
    </div>
  );
}
