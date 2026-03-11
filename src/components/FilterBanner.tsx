import React from 'react';

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

interface FilterBannerProps {
  statistics: Statistics;
  onActionClick?: (actionType: string) => void;
  activeFilter?: string | null;
}

export function FilterBanner({ statistics, onActionClick, activeFilter }: FilterBannerProps) {
  const FilterPill = ({ label, count, type }: { label: string; count: number; type: string }) => {
    const isActive = activeFilter === type;
    return (
      <button
        onClick={() => onActionClick?.(type)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          isActive
            ? 'bg-teal-500 text-white shadow-md'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
        }`}
      >
        <span>{label}</span>
        {count > 0 && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full min-w-[24px] text-center ${
            isActive ? 'bg-white text-teal-600' : 'bg-red-500 text-white'
          }`}>
            {count}
          </span>
        )}
      </button>
    );
  };

  const StatCard = ({ title, stats }: { title: string; stats: { label: string; value: number }[] }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm min-w-[200px]">
      <h3 className="text-xs font-semibold text-gray-600 uppercase mb-3">{title}</h3>
      <div className="space-y-2">
        {stats.map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-gray-600">{label}</span>
            <span className="font-semibold text-gray-900">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex flex-wrap items-start gap-4">
          <StatCard
            title="Referral Provider"
            stats={[
              { label: 'Total Count', value: statistics.referralProvider.totalCount },
              { label: 'Total Skipped', value: statistics.referralProvider.totalSkipped },
              { label: 'Total Merged', value: statistics.referralProvider.totalMerged },
            ]}
          />

          <StatCard
            title="Migrated Category"
            stats={[
              { label: 'Total Count', value: statistics.migratedCategory.totalCount },
              { label: 'Total Skipped', value: statistics.migratedCategory.totalSkipped },
              { label: 'Total Merged', value: statistics.migratedCategory.totalMerged },
              { label: 'Newly Created', value: statistics.migratedCategory.newlyCreated },
            ]}
          />

          <div className="flex-1 min-w-[300px]">
            <h3 className="text-xs font-semibold text-gray-600 uppercase mb-3">Action(s) Required</h3>
            <div className="flex flex-wrap gap-2">
              <FilterPill label="Duplicate Emails" count={statistics.actions.duplicateEmails} type="duplicate_email" />
              <FilterPill label="Missing First Name" count={statistics.actions.missingFirstName} type="missing_first_name" />
              <FilterPill label="Missing Last Name" count={statistics.actions.missingLastName} type="missing_last_name" />
              <FilterPill label="Invalid NPI" count={statistics.actions.invalidNPI} type="invalid_npi" />
              <FilterPill label="Invalid Phone" count={statistics.actions.invalidPhone} type="invalid_phone" />
              <FilterPill label="Invalid Fax" count={statistics.actions.invalidFax} type="invalid_fax" />
              <FilterPill label="Invalid Zip" count={statistics.actions.invalidZip} type="invalid_zip" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
