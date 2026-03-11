import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { InlineSummaryCards } from './components/InlineSummaryCards';
import { TableToolbar } from './components/TableToolbar';
import { ProviderTable } from './components/ProviderTable';
import { Footer } from './components/Footer';
import { ProviderEditModal } from './components/ProviderEditModal';
import { ReferralSourceManager } from './components/ReferralSourceManager';
import { referralProviderService } from './services/referralProviderService';
import { referralSourceService, ReferralSource } from './services/referralSourceService';
import { ProviderWithIssues } from './types/referralProvider';

type FilterTab = 'all' | 'referral_provider' | 'other';

interface PendingChanges {
  [key: string]: {
    referral_category?: string;
    merge_to_id?: string;
    do_not_migrate?: boolean;
    action?: string;
  };
}

function App() {
  const [providers, setProviders] = useState<ProviderWithIssues[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pendingChanges, setPendingChanges] = useState<PendingChanges>({});
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeActionFilter, setActiveActionFilter] = useState<string | null>(null);
  const [editingProvider, setEditingProvider] = useState<ProviderWithIssues | null>(null);
  const [referralSources, setReferralSources] = useState<ReferralSource[]>([]);
  const [showSourceManager, setShowSourceManager] = useState(false);

  const loadProviders = async () => {
    try {
      const data = await referralProviderService.getAll();
      const analyzed = referralProviderService.analyzeProviders(data);

      const autoUpdates: PendingChanges = {};
      analyzed.forEach(provider => {
        if (provider.linked_patients_count === 0 && !provider.do_not_migrate) {
          autoUpdates[provider.id] = { do_not_migrate: true, action: 'do_not_migrate' };
        }
      });

      if (Object.keys(autoUpdates).length > 0) {
        setPendingChanges(prev => ({ ...prev, ...autoUpdates }));
      }

      setProviders(analyzed);
    } catch (error) {
      console.error('Failed to load providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReferralSources = async () => {
    try {
      const sources = await referralSourceService.getAll();
      setReferralSources(sources);
    } catch (error) {
      console.error('Failed to load referral sources:', error);
    }
  };

  useEffect(() => {
    loadProviders();
    loadReferralSources();
  }, []);

  const filteredProviders = useMemo(() => {
    let filtered = providers;

    if (activeTab !== 'all') {
      filtered = filtered.filter(p => p.category === activeTab);
    }

    if (activeFilter) {
      if (activeFilter === 'skipped') {
        filtered = filtered.filter(p => {
          const changes = pendingChanges[p.id] || {};
          const action = changes.action || 'no_action';
          return action === 'do_not_migrate';
        });
      } else if (activeFilter === 'inactivated') {
        filtered = filtered.filter(p => {
          const changes = pendingChanges[p.id] || {};
          const action = changes.action || 'no_action';
          return action === 'deactivate';
        });
      } else if (activeFilter === 'migrated') {
        filtered = filtered.filter(p => {
          const changes = pendingChanges[p.id] || {};
          const action = changes.action || 'no_action';
          return action === 'no_action' || !action;
        });
      } else {
        filtered = filtered.filter(p => p.issues.includes(activeFilter as any));
      }
    }

    if (activeActionFilter) {
      if (activeActionFilter === 'skipped') {
        filtered = filtered.filter(p => {
          const changes = pendingChanges[p.id] || {};
          const action = changes.action || 'no_action';
          return action === 'do_not_migrate';
        });
      } else if (activeActionFilter === 'inactivated') {
        filtered = filtered.filter(p => {
          const changes = pendingChanges[p.id] || {};
          const action = changes.action || 'no_action';
          return action === 'deactivate';
        });
      } else if (activeActionFilter === 'all') {
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => {
        const displayName = p.sub_category || `${p.first_name} ${p.last_name}`.trim();
        return (
          displayName.toLowerCase().includes(query) ||
          p.email?.toLowerCase().includes(query) ||
          p.npi?.toLowerCase().includes(query)
        );
      });
    }

    // Sort duplicate emails together when filtering by duplicate_email
    if (activeFilter === 'duplicate_email') {
      filtered = [...filtered].sort((a, b) => {
        const emailA = a.email?.toLowerCase() || '';
        const emailB = b.email?.toLowerCase() || '';

        if (emailA === emailB) {
          // Within same email group, sort by linked_patients_count descending
          return (b.linked_patients_count || 0) - (a.linked_patients_count || 0);
        }

        return emailA.localeCompare(emailB);
      });
    } else {
      // Default: Sort alphabetically by display name
      filtered = [...filtered].sort((a, b) => {
        const nameA = (a.sub_category || `${a.first_name} ${a.last_name}`.trim() || a.email || '').toLowerCase();
        const nameB = (b.sub_category || `${b.first_name} ${b.last_name}`.trim() || b.email || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
    }

    return filtered;
  }, [providers, activeTab, searchQuery, activeFilter, activeActionFilter, pendingChanges]);

  const statistics = useMemo(() => {
    return referralProviderService.getStatistics(providers);
  }, [providers]);

  const actionCounts = useMemo(() => {
    const skipped = providers.filter(p => {
      const changes = pendingChanges[p.id] || {};
      return changes.action === 'do_not_migrate';
    }).length;

    const inactivated = providers.filter(p => {
      const changes = pendingChanges[p.id] || {};
      return changes.action === 'deactivate';
    }).length;

    const migrated = providers.filter(p => {
      const changes = pendingChanges[p.id] || {};
      const action = changes.action || 'no_action';
      return action === 'no_action' || !action;
    }).length;

    return { skipped, inactivated, migrated };
  }, [providers, pendingChanges]);

  const categoryCounts = useMemo(() => {
    const referralProviderCount = providers.filter(p => p.category === 'referral_provider').length;
    const otherSourcesCount = providers.filter(p => p.category === 'other').length;
    return { referralProviderCount, otherSourcesCount };
  }, [providers]);

  const sourceStats = useMemo(() => {
    const sourceStatsMap = new Map<string, { total: number; toMigrate: number; merged: number; skipped: number }>();

    providers.forEach(provider => {
      const sourceName = provider.referral_category || 'Uncategorized';
      const isSkipped = provider.do_not_migrate || pendingChanges[provider.id]?.do_not_migrate;
      const isMerged = !!(provider.merge_to_id || pendingChanges[provider.id]?.merge_to_id);

      if (!sourceStatsMap.has(sourceName)) {
        sourceStatsMap.set(sourceName, { total: 0, toMigrate: 0, merged: 0, skipped: 0 });
      }

      const stats = sourceStatsMap.get(sourceName)!;
      stats.total++;
      if (isSkipped) {
        stats.skipped++;
      } else {
        stats.toMigrate++;
      }
      if (isMerged) {
        stats.merged++;
      }
    });

    return Array.from(sourceStatsMap.entries()).map(([name, stats]) => ({
      name,
      ...stats
    })).sort((a, b) => b.total - a.total);
  }, [providers, pendingChanges]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredProviders.map(p => p.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleCategoryChange = (id: string, category: string) => {
    setPendingChanges(prev => ({
      ...prev,
      [id]: { ...prev[id], referral_category: category }
    }));
  };

  const handleMergeToChange = (id: string, mergeToId: string) => {
    // If mergeToId is empty, set it to null to unmerge
    setPendingChanges(prev => ({
      ...prev,
      [id]: { ...prev[id], merge_to_id: mergeToId === '' ? null : mergeToId }
    }));
  };

  const handleDoNotMigrateChange = (id: string, checked: boolean) => {
    setPendingChanges(prev => ({
      ...prev,
      [id]: { ...prev[id], do_not_migrate: checked }
    }));
  };

  const handleActionChange = (id: string, action: string) => {
    setPendingChanges(prev => ({
      ...prev,
      [id]: { ...prev[id], action }
    }));
  };

  const handleDoNotMigrateSelected = () => {
    const changes: PendingChanges = {};

    selectedIds.forEach(id => {
      changes[id] = { ...pendingChanges[id], do_not_migrate: true };
    });
    setPendingChanges(prev => ({ ...prev, ...changes }));
  };

  const handleSkipZeroPatients = () => {
    const changes: PendingChanges = {};

    providers.forEach(provider => {
      if (provider.linked_patients_count === 0) {
        changes[provider.id] = { ...pendingChanges[provider.id], do_not_migrate: true, action: 'do_not_migrate' };
      }
    });
    setPendingChanges(prev => ({ ...prev, ...changes }));
  };

  const handleInactivateZeroPatients = () => {
    const changes: PendingChanges = {};

    providers.forEach(provider => {
      if (provider.linked_patients_count === 0) {
        changes[provider.id] = { ...pendingChanges[provider.id], action: 'deactivate' };
      }
    });
    setPendingChanges(prev => ({ ...prev, ...changes }));
  };

  const handleInactivateAll = () => {
    const changes: PendingChanges = {};

    providers.forEach(provider => {
      changes[provider.id] = { ...pendingChanges[provider.id], action: 'deactivate' };
    });
    setPendingChanges(prev => ({ ...prev, ...changes }));
  };

  const handleSubmit = async () => {
    try {
      const updates = Object.entries(pendingChanges).map(([id, changes]) => ({
        id,
        changes
      }));

      await referralProviderService.bulkUpdate(updates);
      setPendingChanges({});
      setSelectedIds(new Set());
      await loadProviders();
      alert('Changes submitted successfully!');
    } catch (error) {
      console.error('Failed to submit changes:', error);
      alert('Failed to submit changes. Please try again.');
    }
  };

  const handleEditProvider = async (id: string, updates: Partial<ProviderWithIssues>) => {
    try {
      await referralProviderService.update(id, updates);
      await loadProviders();
    } catch (error) {
      console.error('Failed to update provider:', error);
      alert('Failed to update provider. Please try again.');
    }
  };

  const handleAddSource = async (name: string) => {
    await referralSourceService.create(name);
    await loadReferralSources();
  };

  const handleRenameSource = async (id: string, newName: string) => {
    await referralSourceService.update(id, newName);
    await loadReferralSources();
  };

  const handleDeleteSource = async (id: string) => {
    await referralSourceService.delete(id);
    await loadReferralSources();
  };

  const hasChanges = Object.keys(pendingChanges).length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TableToolbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onDoNotMigrate={handleDoNotMigrateSelected}
          onSkipZeroPatients={handleSkipZeroPatients}
          onManageSources={() => setShowSourceManager(true)}
          onInactivateZeroPatients={handleInactivateZeroPatients}
          onInactivateAll={handleInactivateAll}
          totalReferralProviders={categoryCounts.referralProviderCount}
          totalOtherSources={categoryCounts.otherSourcesCount}
        />
        <InlineSummaryCards
          statistics={statistics}
          onActionClick={(actionType) => {
            setActiveFilter(activeFilter === actionType ? null : actionType);
          }}
          activeFilter={activeFilter}
          totalSkipped={actionCounts.skipped}
          totalInactivated={actionCounts.inactivated}
          totalMigrated={actionCounts.migrated}
          sourceStats={sourceStats}
        />
        <ProviderTable
          providers={filteredProviders}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          pendingChanges={pendingChanges}
          onCategoryChange={handleCategoryChange}
          onMergeToChange={handleMergeToChange}
          onDoNotMigrateChange={handleDoNotMigrateChange}
          allProviders={providers}
          onRowClick={setEditingProvider}
          showEmailGroups={activeFilter === 'duplicate_email'}
          customReferralSources={referralSources.map(s => s.name)}
          onManageSources={() => setShowSourceManager(true)}
          onActionChange={handleActionChange}
          onActionFilterChange={setActiveActionFilter}
          activeActionFilter={activeActionFilter}
        />
        <Footer onSubmit={handleSubmit} hasChanges={hasChanges} />
      </div>
      {editingProvider && (
        <ProviderEditModal
          provider={editingProvider}
          onClose={() => setEditingProvider(null)}
          onSave={handleEditProvider}
        />
      )}
      {showSourceManager && (
        <ReferralSourceManager
          onClose={() => setShowSourceManager(false)}
          sources={referralSources}
          onAdd={handleAddSource}
          onRename={handleRenameSource}
          onDelete={handleDeleteSource}
        />
      )}
    </div>
  );
}

export default App;
