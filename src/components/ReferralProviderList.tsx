import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Mail, Phone, Hash, Users, Trash2 } from 'lucide-react';
import { referralProviderService } from '../services/referralProviderService';
import { ReferralProvider, ProviderWithIssues, ValidationIssue } from '../types/referralProvider';
import { MergeModal } from './MergeModal';

const issueLabels: Record<ValidationIssue, string> = {
  missing_first_name: 'Missing First Name',
  missing_last_name: 'Missing Last Name',
  duplicate_email: 'Duplicate Email',
  duplicate_npi: 'Duplicate NPI',
  invalid_npi: 'Invalid NPI Format',
  missing_email: 'Missing Email',
  invalid_email: 'Invalid Email Format',
  invalid_zip: 'Invalid Zip',
  invalid_fax: 'Invalid Fax',
  invalid_phone: 'Invalid Phone Number',
};

const issueColors: Record<ValidationIssue, string> = {
  missing_first_name: 'bg-red-100 text-red-800 border-red-300',
  missing_last_name: 'bg-red-100 text-red-800 border-red-300',
  duplicate_email: 'bg-orange-100 text-orange-800 border-orange-300',
  duplicate_npi: 'bg-orange-100 text-orange-800 border-orange-300',
  invalid_npi: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  missing_email: 'bg-red-100 text-red-800 border-red-300',
  invalid_email: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  invalid_zip: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  invalid_fax: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  invalid_phone: 'bg-yellow-100 text-yellow-800 border-yellow-300',
};

export function ReferralProviderList() {
  const [providers, setProviders] = useState<ProviderWithIssues[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [mergeModalOpen, setMergeModalOpen] = useState(false);
  const [providerToMerge, setProviderToMerge] = useState<ProviderWithIssues | null>(null);

  useEffect(() => {
    loadProviders();
  }, []);

  async function loadProviders() {
    try {
      setLoading(true);
      const data = await referralProviderService.getAll();
      const analyzed = referralProviderService.analyzeProviders(data);
      setProviders(analyzed);
    } catch (error) {
      console.error('Error loading providers:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCategoryChange(id: string, category: 'referral_provider' | 'other') {
    try {
      await referralProviderService.update(id, { category });
      await loadProviders();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this provider?')) return;

    try {
      await referralProviderService.delete(id);
      await loadProviders();
    } catch (error) {
      console.error('Error deleting provider:', error);
    }
  }

  function handleMergeClick(provider: ProviderWithIssues) {
    setProviderToMerge(provider);
    setMergeModalOpen(true);
  }

  async function handleMerge(sourceId: string, targetId: string) {
    try {
      await referralProviderService.merge(sourceId, targetId);
      setMergeModalOpen(false);
      setProviderToMerge(null);
      await loadProviders();
    } catch (error) {
      console.error('Error merging providers:', error);
    }
  }

  const issueCount = providers.reduce((sum, p) => sum + p.issues.length, 0);
  const cleanProviders = providers.filter(p => p.issues.length === 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-slate-600">Loading providers...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Referral Provider Management</h1>
          <p className="text-slate-600">Review and manage your referral provider list with validation and merge capabilities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Providers</p>
                <p className="text-2xl font-bold text-slate-900">{providers.length}</p>
              </div>
              <Users className="w-8 h-8 text-slate-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Clean Records</p>
                <p className="text-2xl font-bold text-green-600">{cleanProviders.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Action Items</p>
                <p className="text-2xl font-bold text-orange-600">{issueCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">NPI</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Issues</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {providers.map((provider) => (
                  <tr
                    key={provider.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      selectedProvider === provider.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedProvider(provider.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">
                          {provider.first_name || <span className="text-red-500 italic">Missing</span>}{' '}
                          {provider.last_name || <span className="text-red-500 italic">Missing</span>}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4" />
                          {provider.email || <span className="text-red-500 italic">Missing</span>}
                        </div>
                        {provider.contact_info && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <Phone className="w-4 h-4" />
                            {provider.contact_info}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Hash className="w-4 h-4" />
                        {provider.npi || <span className="text-slate-400 italic">Not provided</span>}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={provider.category}
                        onChange={(e) => handleCategoryChange(provider.id, e.target.value as 'referral_provider' | 'other')}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm border border-slate-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="referral_provider">Referral Provider</option>
                        <option value="other">Other</option>
                      </select>
                    </td>

                    <td className="px-6 py-4">
                      {provider.issues.length === 0 ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Clean</span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {provider.issues.map((issue) => (
                            <div
                              key={issue}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${issueColors[issue]}`}
                            >
                              <AlertCircle className="w-3 h-3" />
                              {issueLabels[issue]}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {provider.duplicateWith && provider.duplicateWith.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMergeClick(provider);
                            }}
                            className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors border border-blue-200"
                          >
                            Merge
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(provider.id);
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete provider"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {mergeModalOpen && providerToMerge && (
        <MergeModal
          provider={providerToMerge}
          allProviders={providers}
          onMerge={handleMerge}
          onClose={() => {
            setMergeModalOpen(false);
            setProviderToMerge(null);
          }}
        />
      )}
    </div>
  );
}
