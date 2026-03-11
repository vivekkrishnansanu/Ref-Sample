import React, { useState } from 'react';
import { AlertCircle, Info } from 'lucide-react';

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
    missingEmail: number;
    missingFirstName: number;
    missingLastName: number;
    invalidNPI: number;
    invalidZip: number;
    invalidFax: number;
    invalidPhone: number;
  };
}

interface SourceStat {
  name: string;
  total: number;
  toMigrate: number;
  merged: number;
  skipped: number;
}

interface InlineSummaryCardsProps {
  statistics: Statistics;
  onActionClick?: (actionType: string) => void;
  activeFilter?: string | null;
  totalSkipped?: number;
  totalInactivated?: number;
  totalMigrated?: number;
  sourceStats?: SourceStat[];
}

export function InlineSummaryCards({ statistics, onActionClick, activeFilter, totalSkipped = 0, totalInactivated = 0, totalMigrated = 0, sourceStats = [] }: InlineSummaryCardsProps) {
  const totalActions = Object.values(statistics.actions).reduce((sum, count) => sum + count, 0);

  const StatusChip = ({ label, count, type, color }: { label: string; count: number; type: string; color: string }) => {
    const isActive = activeFilter === type;

    return (
      <button
        onClick={() => onActionClick?.(type)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
          isActive
            ? `${color} text-white shadow-sm`
            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
        }`}
      >
        <span>{label}</span>
        <span className={`font-bold px-1.5 py-0.5 rounded ${
          isActive ? 'bg-black bg-opacity-20' : `${color} text-white`
        }`}>
          {count}
        </span>
      </button>
    );
  };

  const ActionChip = ({ label, count, type, showInfo, tooltipText }: { label: string; count: number; type: string; showInfo?: boolean; tooltipText?: string }) => {
    const isActive = activeFilter === type;
    const [showTooltip, setShowTooltip] = useState(false);
    if (count === 0) return null;

    const isMissingEmail = type === 'missing_email';

    return (
      <button
        onClick={() => onActionClick?.(type)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
          isActive
            ? isMissingEmail ? 'bg-amber-600 text-white shadow-sm' : 'bg-red-600 text-white shadow-sm'
            : isMissingEmail ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200' : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
        }`}
      >
        <span>{label}</span>
        <span className={`font-bold px-1.5 py-0.5 rounded ${
          isActive
            ? isMissingEmail ? 'bg-amber-800' : 'bg-red-800'
            : isMissingEmail ? 'bg-amber-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {count}
        </span>
        {showInfo && tooltipText && (
          <div className="relative">
            <Info
              size={14}
              className={`${isActive
                ? isMissingEmail ? 'text-amber-100' : 'text-red-100'
                : isMissingEmail ? 'text-amber-600' : 'text-red-600'
              } cursor-help`}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />
            {showTooltip && (
              <div className="absolute left-0 top-6 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                <div className="text-gray-200">
                  {tooltipText}
                </div>
              </div>
            )}
          </div>
        )}
      </button>
    );
  };

  const referralProviderSources = sourceStats.filter(s => s.name === 'Referral Provider');
  const otherSources = sourceStats.filter(s => s.name === 'Uncategorized').map(s => ({
    ...s,
    name: 'Other referral sources'
  }));

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Action(s) Required Tile - 2/3 width */}
        <div className="lg:col-span-2 rounded-lg border border-red-200 bg-red-50/40 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" aria-hidden />
            <h4 className="text-xs font-semibold text-red-800 uppercase tracking-wide">
              Action(s) Required
            </h4>
            {totalActions > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white">
                {totalActions}
              </span>
            )}
          </div>
          {/* All action chips in a single flowing container */}
          <div className="flex flex-wrap items-center gap-2">
            <ActionChip label="Dup. Emails" count={statistics.actions.duplicateEmails} type="duplicate_email" showInfo={true} tooltipText="CareStack does not allow duplicate email addresses because each referral provider is assigned a unique email ID to access the referral portal. If the referral providers are the same, please merge the duplicate entries." />
            <ActionChip label="Missing Email" count={statistics.actions.missingEmail} type="missing_email" showInfo={true} tooltipText="If email is not present, the referral portal will not be enabled for them in CareStack." />
            <ActionChip label="Missing Firstname" count={statistics.actions.missingFirstName} type="missing_first_name" />
            <ActionChip label="Missing Lastname" count={statistics.actions.missingLastName} type="missing_last_name" />
            <ActionChip label="Invalid NPI" count={statistics.actions.invalidNPI} type="invalid_npi" />
            <ActionChip label="Invalid Zip" count={statistics.actions.invalidZip} type="invalid_zip" />
            <ActionChip label="Invalid Fax" count={statistics.actions.invalidFax} type="invalid_fax" />
            <ActionChip label="Invalid Phone" count={statistics.actions.invalidPhone} type="invalid_phone" />
          </div>
        </div>

        {/* Summary Tile - 1/3 width */}
        {sourceStats.length > 0 && (referralProviderSources.length > 0 || otherSources.length > 0) && (
          <div className="lg:col-span-1 rounded-lg border border-gray-200 bg-gray-50/80 px-4 py-3 shadow-sm">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Summary</h4>
            <div className="space-y-2.5">
              {referralProviderSources.map((source) => (
                <div key={source.name} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-sm">
                  <span className="font-medium text-gray-900">{source.name}</span>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-600">
                    <span><span className="text-gray-500">Migrated:</span> <span className="font-semibold text-green-600">{source.toMigrate}</span></span>
                    <span className="text-gray-300 hidden sm:inline">|</span>
                    <span><span className="text-gray-500">Merged:</span> <span className="font-semibold text-blue-600">{source.merged}</span></span>
                    <span className="text-gray-300 hidden sm:inline">|</span>
                    <span><span className="text-gray-500">Skipped:</span> <span className="font-semibold text-orange-600">{source.skipped}</span></span>
                  </div>
                </div>
              ))}
              {otherSources.map((source) => (
                <div key={source.name} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-sm">
                  <span className="font-medium text-gray-900">{source.name}</span>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-600">
                    <span><span className="text-gray-500">Migrated:</span> <span className="font-semibold text-green-600">{source.toMigrate}</span></span>
                    <span className="text-gray-300 hidden sm:inline">|</span>
                    <span><span className="text-gray-500">Merged:</span> <span className="font-semibold text-blue-600">{source.merged}</span></span>
                    <span className="text-gray-300 hidden sm:inline">|</span>
                    <span><span className="text-gray-500">Skipped:</span> <span className="font-semibold text-orange-600">{source.skipped}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
