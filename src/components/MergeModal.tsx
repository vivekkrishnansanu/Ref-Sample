import { useState } from 'react';
import { X, ArrowRight, AlertTriangle } from 'lucide-react';
import { ProviderWithIssues } from '../types/referralProvider';

interface MergeModalProps {
  provider: ProviderWithIssues;
  allProviders: ProviderWithIssues[];
  onMerge: (sourceId: string, targetId: string) => void;
  onClose: () => void;
}

export function MergeModal({ provider, allProviders, onMerge, onClose }: MergeModalProps) {
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');

  const duplicateProviders = allProviders.filter(
    p => provider.duplicateWith?.includes(p.id)
  );

  const handleMerge = () => {
    if (!selectedTargetId) return;
    onMerge(provider.id, selectedTargetId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Merge Duplicate Provider</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Merging will permanently mark the source provider as merged.</p>
              <p>The source provider record will be hidden from the list but retained in the database for audit purposes.</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">Source Provider (Will be merged)</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Name:</span>
                  <p className="font-medium text-slate-900">{provider.first_name} {provider.last_name}</p>
                </div>
                <div>
                  <span className="text-slate-600">Email:</span>
                  <p className="font-medium text-slate-900">{provider.email}</p>
                </div>
                <div>
                  <span className="text-slate-600">Contact:</span>
                  <p className="font-medium text-slate-900">{provider.contact_info || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-slate-600">NPI:</span>
                  <p className="font-medium text-slate-900">{provider.npi || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center mb-6">
            <ArrowRight className="w-6 h-6 text-slate-400" />
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
              Select Target Provider (Keep this one)
            </h3>
            <div className="space-y-3">
              {duplicateProviders.map((dup) => (
                <label
                  key={dup.id}
                  className={`block border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedTargetId === dup.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="targetProvider"
                    value={dup.id}
                    checked={selectedTargetId === dup.id}
                    onChange={(e) => setSelectedTargetId(e.target.value)}
                    className="sr-only"
                  />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Name:</span>
                      <p className="font-medium text-slate-900">{dup.first_name} {dup.last_name}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Email:</span>
                      <p className="font-medium text-slate-900">{dup.email}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Contact:</span>
                      <p className="font-medium text-slate-900">{dup.contact_info || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">NPI:</span>
                      <p className="font-medium text-slate-900">{dup.npi || 'N/A'}</p>
                    </div>
                  </div>
                  {dup.issues.length === 0 && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                      Recommended: Clean record
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleMerge}
              disabled={!selectedTargetId}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              Merge Providers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
