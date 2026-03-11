import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, AlertCircle, Info, MoreVertical, Filter, CreditCard as Edit2, X } from 'lucide-react';
import { ProviderWithIssues } from '../types/referralProvider';
import { REFERRAL_CATEGORIES } from '../constants/categories';

interface PendingChanges {
  [key: string]: {
    referral_category?: string;
    merge_to_id?: string;
    do_not_migrate?: boolean;
    action?: string;
  };
}

interface ProviderTableProps {
  providers: ProviderWithIssues[];
  selectedIds: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  pendingChanges: PendingChanges;
  onCategoryChange: (id: string, category: string) => void;
  onMergeToChange: (id: string, mergeToId: string) => void;
  onDoNotMigrateChange: (id: string, checked: boolean) => void;
  allProviders: ProviderWithIssues[];
  onRowClick?: (provider: ProviderWithIssues) => void;
  showEmailGroups?: boolean;
  customReferralSources?: string[];
  onManageSources?: () => void;
  onActionChange?: (id: string, action: string) => void;
  onActionFilterChange?: (filter: string | null) => void;
  activeActionFilter?: string | null;
}

export function ProviderTable({
  providers,
  selectedIds,
  onSelectAll,
  onSelectRow,
  pendingChanges,
  onCategoryChange,
  onMergeToChange,
  onDoNotMigrateChange,
  allProviders,
  onRowClick,
  showEmailGroups = false,
  customReferralSources = [],
  onManageSources,
  onActionChange,
  onActionFilterChange,
  activeActionFilter
}: ProviderTableProps) {
  const allSelected = providers.length > 0 && providers.every(p => selectedIds.has(p.id));
  const [showTooltip, setShowTooltip] = useState(false);
  const [showActionFilter, setShowActionFilter] = useState(false);
  const [showInstructionBanner, setShowInstructionBanner] = useState(true);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [errorsFlyout, setErrorsFlyout] = useState<{ providerId: string; issueTexts: string[] } | null>(null);
  const actionFilterRef = useRef<HTMLDivElement>(null);
  const errorsFlyoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (actionFilterRef.current && !actionFilterRef.current.contains(event.target as Node)) {
        setShowActionFilter(false);
      }
      if (errorsFlyoutRef.current && !errorsFlyoutRef.current.contains(event.target as Node)) {
        setErrorsFlyout(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [errorsFlyout]);

  const categoryCount = React.useMemo(() => {
    const counts: Record<string, number> = {};
    allProviders.forEach(p => {
      const category = p.referral_category || 'Uncategorized';
      counts[category] = (counts[category] || 0) + 1;
    });
    return counts;
  }, [allProviders]);

  // Generate email group colors
  const emailGroupColors = React.useMemo(() => {
    if (!showEmailGroups) return {};

    const colors = [
      'bg-blue-50 border-l-4 border-l-blue-400',
      'bg-green-50 border-l-4 border-l-green-400',
      'bg-yellow-50 border-l-4 border-l-yellow-400',
      'bg-pink-50 border-l-4 border-l-pink-400',
      'bg-purple-50 border-l-4 border-l-purple-400',
      'bg-orange-50 border-l-4 border-l-orange-400',
      'bg-cyan-50 border-l-4 border-l-cyan-400',
      'bg-rose-50 border-l-4 border-l-rose-400',
    ];

    const emailToColor: Record<string, string> = {};
    const uniqueEmails = Array.from(new Set(providers.map(p => p.email?.toLowerCase() || '')));

    uniqueEmails.forEach((email, index) => {
      if (email) {
        emailToColor[email] = colors[index % colors.length];
      }
    });

    return emailToColor;
  }, [providers, showEmailGroups]);

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {showInstructionBanner && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <Info size={16} className="flex-shrink-0" />
            <span className="font-medium">Click on any row to edit the referral source details</span>
          </div>
          <button
            onClick={() => setShowInstructionBanner(false)}
            className="text-blue-600 hover:text-blue-800 transition-colors p-1"
            aria-label="Dismiss instruction"
          >
            <X size={16} />
          </button>
        </div>
      )}
      <table className="w-full">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Referral Source Sub-Categories
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Merge To
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Referral Source
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Email
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              NPI
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Linked Patients
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              <div className="flex items-center gap-2">
                <span>Skip/Inactivate Records</span>
                <div className="relative" ref={actionFilterRef}>
                  <button
                    onClick={() => setShowActionFilter(!showActionFilter)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <MoreVertical size={14} className="text-gray-500" />
                  </button>
                  {showActionFilter && (
                    <div className="absolute left-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <button
                        onClick={() => {
                          onActionFilterChange?.(activeActionFilter === 'skipped' ? null : 'skipped');
                          setShowActionFilter(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${
                          activeActionFilter === 'skipped'
                            ? 'bg-orange-50 text-orange-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {activeActionFilter === 'skipped' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-600"></div>
                        )}
                        <span>Skipped</span>
                      </button>
                      <button
                        onClick={() => {
                          onActionFilterChange?.(activeActionFilter === 'inactivated' ? null : 'inactivated');
                          setShowActionFilter(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${
                          activeActionFilter === 'inactivated'
                            ? 'bg-gray-200 text-gray-800 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {activeActionFilter === 'inactivated' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                        )}
                        <span>Inactivated</span>
                      </button>
                      <button
                        onClick={() => {
                          onActionFilterChange?.(activeActionFilter === 'all' ? null : 'all');
                          setShowActionFilter(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${
                          activeActionFilter === 'all'
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {activeActionFilter === 'all' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                        )}
                        <span>All</span>
                      </button>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={() => {
                          onActionFilterChange?.(null);
                          setShowActionFilter(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Clear Filter
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
              Actions Required
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {providers.map((provider, index) => {
            const changes = pendingChanges[provider.id] || {};
            const displayName = provider.sub_category || `${provider.first_name} ${provider.last_name}`.trim() || provider.email;
            const hasDuplicateEmail = provider.issues.includes('duplicate_email');

            const emailKey = provider.email?.toLowerCase() || '';
            const groupColor = showEmailGroups && emailKey ? emailGroupColors[emailKey] : '';

            // Check if this is the first row in an email group
            const isFirstInGroup = showEmailGroups && (index === 0 || providers[index - 1].email?.toLowerCase() !== emailKey);
            const isLastInGroup = showEmailGroups && (index === providers.length - 1 || providers[index + 1].email?.toLowerCase() !== emailKey);

            // Check if this subcategory is merged into another (source of merge)
            const isMergedSource = !!(changes.merge_to_id || provider.merge_to_id);

            // Check if record is skipped
            const isSkipped = changes.action === 'do_not_migrate';

            // Only the source (merged from) row should be disabled, not the target
            const isDisabled = isMergedSource;

            return (
              <tr
                key={provider.id}
                onMouseEnter={() => !isDisabled && setHoveredRowId(provider.id)}
                onMouseLeave={() => setHoveredRowId(null)}
                className={`border-b border-gray-200 transition-all duration-200 ${
                  isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 hover:shadow-sm cursor-pointer'
                } ${
                  isSkipped ? 'opacity-40 bg-gray-100' : ''
                } ${
                  groupColor || (selectedIds.has(provider.id) ? 'bg-blue-100' : '')
                } ${isFirstInGroup ? 'border-t-2 border-t-gray-400' : ''} ${isLastInGroup ? 'border-b-2 border-b-gray-400' : ''}`}
              >
                <td className="px-4 py-3 text-sm text-gray-900" onClick={() => !isDisabled && onRowClick?.(provider)}>
                  {displayName}
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="relative flex items-center gap-2">
                    <select
                      value={changes.merge_to_id || provider.merge_to_id || ''}
                      onChange={(e) => onMergeToChange(provider.id, e.target.value)}
                      disabled={isDisabled}
                      className="appearance-none w-full px-3 py-2 pr-8 border border-gray-300 rounded text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      style={{ '--tw-ring-color': '#227e85' } as React.CSSProperties}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#227e85'}
                      onBlur={(e) => e.currentTarget.style.borderColor = ''}
                    >
                      <option value="">-- None --</option>
                      {allProviders
                        .filter(p => {
                          if (p.id === provider.id) return false;

                          const currentCategory = changes.referral_category || provider.referral_category;

                          if (currentCategory === 'Referral Provider') {
                            return p.referral_category === 'Referral Provider';
                          }

                          if (currentCategory === 'Migrated Category') {
                            return p.referral_category !== 'Referral Provider';
                          }

                          return true;
                        })
                        .map((p) => {
                          const name = p.sub_category || `${p.first_name} ${p.last_name}`.trim() || p.email;
                          const isInactive = p.linked_patients_count === 0;
                          return (
                            <option
                              key={p.id}
                              value={p.id}
                              style={isInactive ? { color: '#dc2626' } : {}}
                            >
                              {name}{isInactive ? ' (Inactive)' : ''}
                            </option>
                          );
                        })}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="relative">
                    <select
                      value={changes.referral_category || provider.referral_category || ''}
                      onChange={(e) => {
                        if (e.target.value === '__manage__') {
                          onManageSources?.();
                          e.target.value = changes.referral_category || provider.referral_category || '';
                        } else {
                          onCategoryChange(provider.id, e.target.value);
                        }
                      }}
                      disabled={isDisabled}
                      className="appearance-none w-full px-3 py-2 pr-8 border border-gray-300 rounded text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      style={{ '--tw-ring-color': '#227e85' } as React.CSSProperties}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#227e85'}
                      onBlur={(e) => e.currentTarget.style.borderColor = ''}
                    >
                      <option value="">Select</option>
                      {REFERRAL_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                      {customReferralSources.map((source) => (
                        <option key={source} value={source}>
                          {source}
                        </option>
                      ))}
                      {onManageSources && (
                        <option value="__manage__" style={{ fontWeight: 'bold', color: '#227e85' }}>
                          + Manage Sources
                        </option>
                      )}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900" onClick={() => !isDisabled && onRowClick?.(provider)}>
                  {provider.email || '--'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900" onClick={() => !isDisabled && onRowClick?.(provider)}>
                  {provider.npi || '--'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-center" onClick={() => !isDisabled && onRowClick?.(provider)}>
                  {provider.linked_patients_count}
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="relative">
                    <select
                      value={changes.action || 'no_action'}
                      onChange={(e) => {
                        const action = e.target.value;
                        onActionChange?.(provider.id, action);
                        if (action === 'do_not_migrate') {
                          onDoNotMigrateChange(provider.id, true);
                        } else if (action === 'no_action') {
                          onDoNotMigrateChange(provider.id, false);
                        }
                      }}
                      disabled={isDisabled}
                      className="appearance-none w-full px-3 py-2 pr-8 border border-gray-300 rounded text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      style={{ '--tw-ring-color': '#227e85' } as React.CSSProperties}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#227e85'}
                      onBlur={(e) => e.currentTarget.style.borderColor = ''}
                    >
                      <option value="no_action">No Action Required</option>
                      <option value="do_not_migrate">Skipped</option>
                      <option value="deactivate">Inactivate</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </td>
                <td className="px-4 py-3 text-right" onClick={() => !isDisabled && onRowClick?.(provider)}>
                  <div className="flex items-center justify-end gap-2">
                    {changes.action === 'do_not_migrate' ? (
                      <span className="text-xs font-medium text-gray-600">
                        Will not be migrated to CareStack
                      </span>
                    ) : provider.issues.length > 0 ? (
                      <div className="flex items-center justify-end gap-2 relative" ref={errorsFlyout?.providerId === provider.id ? errorsFlyoutRef : undefined}>
                        {(() => {
                          const issueTexts: string[] = [];
                          let hasDuplicateEmail = false;
                          let hasMissingEmail = false;
                          let hasMissingFirstName = false;
                          let hasMissingLastName = false;

                          let hasInvalidNPI = false;
                          let hasInvalidZip = false;
                          let hasInvalidFax = false;
                          let hasInvalidPhone = false;

                          provider.issues.forEach(issue => {
                            if (issue === 'duplicate_email') hasDuplicateEmail = true;
                            else if (issue === 'missing_email') hasMissingEmail = true;
                            else if (issue === 'missing_first_name') hasMissingFirstName = true;
                            else if (issue === 'missing_last_name') hasMissingLastName = true;
                            else if (issue === 'invalid_npi') hasInvalidNPI = true;
                            else if (issue === 'invalid_zip') hasInvalidZip = true;
                            else if (issue === 'invalid_fax') hasInvalidFax = true;
                            else if (issue === 'invalid_phone') hasInvalidPhone = true;
                          });

                          if (hasDuplicateEmail) {
                            issueTexts.push('Duplicate email');
                          }
                          if (hasMissingEmail) {
                            issueTexts.push('Missing email');
                          }
                          if (hasMissingFirstName && hasMissingLastName) {
                            issueTexts.push('Missing firstname, lastname');
                          } else if (hasMissingFirstName) {
                            issueTexts.push('Missing firstname');
                          } else if (hasMissingLastName) {
                            issueTexts.push('Missing lastname');
                          }
                          if (hasInvalidNPI) issueTexts.push('Invalid NPI');
                          if (hasInvalidZip) issueTexts.push('Invalid Zip');
                          if (hasInvalidFax) issueTexts.push('Invalid Fax');
                          if (hasInvalidPhone) issueTexts.push('Invalid Phone Number');

                          const isNameIssue = (t: string) => t?.includes('firstname') || t?.includes('lastname');

                          return (
                            <>
                              {/* Show first two errors (comma separated), then "+X more" if any additional */}
                              <span className={`text-xs font-medium ${isNameIssue(issueTexts[0]) ? 'text-amber-600' : 'text-red-600'}`}>
                                {issueTexts.slice(0, 2).join(', ')}
                              </span>
                              {issueTexts.length > 2 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setErrorsFlyout(prev => prev?.providerId === provider.id ? null : { providerId: provider.id, issueTexts });
                                  }}
                                  className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-800 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 cursor-pointer"
                                >
                                  +{issueTexts.length - 2} more
                                </button>
                              )}
                              {/* Flyout listing all errors when "+X more" is clicked – left-aligned */}
                              {errorsFlyout?.providerId === provider.id && (
                                <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg text-left">
                                  <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 border-b border-gray-100 text-left">All issues</div>
                                  <ul className="max-h-48 overflow-y-auto text-left">
                                    {errorsFlyout.issueTexts.map((text, i) => (
                                      <li key={i} className="px-3 py-1.5 text-xs text-red-700 text-left">{text}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    ) : null}
                    {!isDisabled && hoveredRowId === provider.id && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                        <Edit2 size={14} className="text-teal-600" />
                        <span>Edit</span>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
