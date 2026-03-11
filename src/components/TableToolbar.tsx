import React, { useState, useRef, useEffect } from 'react';
import { Search, Settings, Ban, ChevronDown, LogIn, LogOut, Info } from 'lucide-react';

type FilterTab = 'all' | 'referral_provider' | 'other';

interface TableToolbarProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onDoNotMigrate: () => void;
  onSkipZeroPatients: () => void;
  onManageSources?: () => void;
  onTogglePortalLogin?: () => void;
  onInactivateZeroPatients?: () => void;
  onInactivateAll?: () => void;
  totalReferralProviders?: number;
  totalOtherSources?: number;
}

export function TableToolbar({ activeTab, onTabChange, searchQuery, onSearchChange, onDoNotMigrate, onSkipZeroPatients, onManageSources, onTogglePortalLogin, onInactivateZeroPatients, onInactivateAll, totalReferralProviders = 0, totalOtherSources = 0 }: TableToolbarProps) {
  const [showSkipMenu, setShowSkipMenu] = useState(false);
  const [showPortalMenu, setShowPortalMenu] = useState(false);
  const [showSkipZeroTooltip, setShowSkipZeroTooltip] = useState(false);
  const [showSkipAllTooltip, setShowSkipAllTooltip] = useState(false);
  const [showInactivateZeroTooltip, setShowInactivateZeroTooltip] = useState(false);
  const [showInactivateAllTooltip, setShowInactivateAllTooltip] = useState(false);
  const [showPortalTooltip, setShowPortalTooltip] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const portalMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowSkipMenu(false);
      }
      if (portalMenuRef.current && !portalMenuRef.current.contains(event.target as Node)) {
        setShowPortalMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 mr-2">Group by :</span>

          <button
            onClick={() => onTabChange('all')}
            className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${
              activeTab === 'all'
                ? 'text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={activeTab === 'all' ? { backgroundColor: '#227e85' } : {}}
          >
            All
          </button>

          <button
            onClick={() => onTabChange('referral_provider')}
            className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${
              activeTab === 'referral_provider'
                ? 'text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={activeTab === 'referral_provider' ? { backgroundColor: '#227e85' } : {}}
          >
            Referral Provider
            {totalReferralProviders > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'referral_provider'
                  ? 'bg-white bg-opacity-30'
                  : 'bg-gray-200'
              }`}>
                {totalReferralProviders}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('other')}
            className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${
              activeTab === 'other'
                ? 'text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={activeTab === 'other' ? { backgroundColor: '#227e85' } : {}}
          >
            Other Referral Sources
            {totalOtherSources > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'other'
                  ? 'bg-white bg-opacity-30'
                  : 'bg-gray-200'
              }`}>
                {totalOtherSources}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Referral Name, Email, NPI"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#227e85' } as React.CSSProperties}
              onFocus={(e) => e.currentTarget.style.borderColor = '#227e85'}
              onBlur={(e) => e.currentTarget.style.borderColor = ''}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowSkipMenu(!showSkipMenu)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded transition-colors border border-gray-300 hover:bg-gray-50"
              style={{ color: '#227e85' }}
            >
              <Ban size={16} />
              Skip/Inactivate Records
              <ChevronDown size={16} />
            </button>

            {showSkipMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => {
                    onSkipZeroPatients();
                    setShowSkipMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                >
                  <span>Skip records with 0 patients</span>
                  <div className="relative">
                    <Info
                      size={14}
                      className="text-gray-400 cursor-help"
                      onMouseEnter={() => setShowSkipZeroTooltip(true)}
                      onMouseLeave={() => setShowSkipZeroTooltip(false)}
                    />
                    {showSkipZeroTooltip && (
                      <div className="absolute right-0 top-6 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-[60]">
                        <div className="text-gray-200">
                          Select this option to exclude the referral source from the migration process.
                        </div>
                      </div>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => {
                    onDoNotMigrate();
                    setShowSkipMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                >
                  <span>Skip all records</span>
                  <div className="relative">
                    <Info
                      size={14}
                      className="text-gray-400 cursor-help"
                      onMouseEnter={() => setShowSkipAllTooltip(true)}
                      onMouseLeave={() => setShowSkipAllTooltip(false)}
                    />
                    {showSkipAllTooltip && (
                      <div className="absolute right-0 top-6 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-[60]">
                        <div className="text-gray-200">
                          Select this option to exclude the referral source from the migration process.
                        </div>
                      </div>
                    )}
                  </div>
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={() => {
                    onInactivateZeroPatients?.();
                    setShowSkipMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                >
                  <span>Inactivate records with 0 patients</span>
                  <div className="relative">
                    <Info
                      size={14}
                      className="text-gray-400 cursor-help"
                      onMouseEnter={() => setShowInactivateZeroTooltip(true)}
                      onMouseLeave={() => setShowInactivateZeroTooltip(false)}
                    />
                    {showInactivateZeroTooltip && (
                      <div className="absolute right-0 top-6 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-[60]">
                        <div className="text-gray-200">
                          Select this option to migrate the referral source as inactive. This means the record will not be available for use with new patients in CareStack but will remain in the master list for historical reference.
                        </div>
                      </div>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => {
                    onInactivateAll?.();
                    setShowSkipMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                >
                  <span>Inactivate all</span>
                  <div className="relative">
                    <Info
                      size={14}
                      className="text-gray-400 cursor-help"
                      onMouseEnter={() => setShowInactivateAllTooltip(true)}
                      onMouseLeave={() => setShowInactivateAllTooltip(false)}
                    />
                    {showInactivateAllTooltip && (
                      <div className="absolute right-0 top-6 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-[60]">
                        <div className="text-gray-200">
                          Select this option to migrate the referral source as inactive. This means the record will not be available for use with new patients in CareStack but will remain in the master list for historical reference.
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              </div>
            )}
          </div>

          <div className="relative" ref={portalMenuRef}>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowPortalMenu(!showPortalMenu)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded transition-colors border border-gray-300 hover:bg-gray-50"
                style={{ color: '#227e85' }}
              >
                <LogIn size={16} />
                Referral Portal Login
                <ChevronDown size={16} />
              </button>
              <div
                className="relative"
                onMouseEnter={() => setShowPortalTooltip(true)}
                onMouseLeave={() => setShowPortalTooltip(false)}
              >
                <Info
                  size={16}
                  className="text-gray-400 cursor-help"
                />
                {showPortalTooltip && (
                  <div className="absolute right-0 top-7 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-[60]">
                    <div className="text-gray-200 mb-2">
                      CareStack provides a unique referral portal for every referral provider using CareStack, where they can view and manage their referrals. Please enable login access for the referral provider so they can access the portal.
                    </div>
                    <a
                      href="https://www.youtube.com/watch?v=your-video-id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline transition-colors inline-flex items-center gap-1"
                    >
                      Click here to view tutorial
                    </a>
                  </div>
                )}
              </div>
            </div>

            {showPortalMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => {
                    console.log('Enable portal login for all');
                    setShowPortalMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <LogIn size={14} />
                  Enable for all
                </button>
                <button
                  onClick={() => {
                    console.log('Disable portal login for all');
                    setShowPortalMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <LogOut size={14} />
                  Disable for all
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
