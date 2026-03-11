import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ProviderWithIssues } from '../types/referralProvider';

interface ProviderEditModalProps {
  provider: ProviderWithIssues;
  onClose: () => void;
  onSave: (id: string, updates: Partial<ProviderWithIssues>) => void;
}

export function ProviderEditModal({ provider, onClose, onSave }: ProviderEditModalProps) {
  const [formData, setFormData] = useState({
    prefix: provider.prefix || '',
    first_name: provider.first_name || '',
    last_name: provider.last_name || '',
    speciality: provider.speciality || '',
    email: provider.email || '',
    npi: provider.npi || '',
    phone_number: provider.phone_number || '',
    fax: provider.fax || '',
    address_line_1: provider.address_line_1 || '',
    address_line_2: provider.address_line_2 || '',
    zip_code: provider.zip_code || '',
    city: provider.city || '',
    state: provider.state || '',
    business_name: provider.business_name || '',
    login_enabled: provider.login_enabled || false,
    additional_info: provider.additional_info || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(provider.id, formData);
    onClose();
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFirstNameRequired = !formData.first_name.trim();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Edit Provider</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-6 flex-1 overflow-hidden">
            <div className="space-y-4 overflow-y-auto h-full pr-2" style={{ maxHeight: 'calc(90vh - 180px)' }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-3">
                    <select
                      value={formData.prefix}
                      onChange={(e) => handleChange('prefix', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:border-transparent bg-white"
                      style={{ '--tw-ring-color': '#227e85' } as React.CSSProperties}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#227e85'}
                      onBlur={(e) => e.currentTarget.style.borderColor = ''}
                    >
                      <option value="">Prefix</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Miss">Miss</option>
                    </select>
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => handleChange('first_name', e.target.value)}
                      placeholder="First Name"
                      required
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:border-transparent ${
                        isFirstNameRequired ? 'border-red-500' : 'border-gray-300'
                      }`}
                      style={{ '--tw-ring-color': '#227e85' } as React.CSSProperties}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#227e85'}
                      onBlur={(e) => e.currentTarget.style.borderColor = isFirstNameRequired ? '#ef4444' : ''}
                    />
                  </div>
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => handleChange('last_name', e.target.value)}
                      placeholder="Last Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{ '--tw-ring-color': '#227e85' } as React.CSSProperties}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#227e85'}
                      onBlur={(e) => e.currentTarget.style.borderColor = ''}
                    />
                  </div>
                </div>
                {isFirstNameRequired && (
                  <p className="text-xs text-red-600 mt-1">This field is mandatory</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Speciality
                </label>
                <input
                  type="text"
                  value={formData.speciality}
                  onChange={(e) => handleChange('speciality', e.target.value)}
                  placeholder="Input text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#227e85' } as React.CSSProperties}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#227e85'}
                  onBlur={(e) => e.currentTarget.style.borderColor = ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NPI
                </label>
                <input
                  type="text"
                  value={formData.npi}
                  onChange={(e) => handleChange('npi', e.target.value)}
                  placeholder="Input text"
                  maxLength={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#227e85' } as React.CSSProperties}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#227e85'}
                  onBlur={(e) => e.currentTarget.style.borderColor = ''}
                />
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone_number}
                  onChange={(e) => handleChange('phone_number', e.target.value)}
                  placeholder="Input text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#227e85' } as React.CSSProperties}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#227e85'}
                  onBlur={(e) => e.currentTarget.style.borderColor = ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fax
                </label>
                <input
                  type="text"
                  value={formData.fax}
                  onChange={(e) => handleChange('fax', e.target.value)}
                  placeholder="Input text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#227e85' } as React.CSSProperties}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#227e85'}
                  onBlur={(e) => e.currentTarget.style.borderColor = ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Input text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#227e85' } as React.CSSProperties}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#227e85'}
                  onBlur={(e) => e.currentTarget.style.borderColor = ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={formData.address_line_1}
                  onChange={(e) => handleChange('address_line_1', e.target.value)}
                  placeholder="Input text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#227e85' } as React.CSSProperties}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#227e85'}
                  onBlur={(e) => e.currentTarget.style.borderColor = ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={formData.address_line_2}
                  onChange={(e) => handleChange('address_line_2', e.target.value)}
                  placeholder="Input text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#227e85' } as React.CSSProperties}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#227e85'}
                  onBlur={(e) => e.currentTarget.style.borderColor = ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zip Code
                </label>
                <input
                  type="text"
                  value={formData.zip_code}
                  onChange={(e) => handleChange('zip_code', e.target.value)}
                  placeholder="Input text"
                  maxLength={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#227e85' } as React.CSSProperties}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#227e85'}
                  onBlur={(e) => e.currentTarget.style.borderColor = ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Input text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#227e85' } as React.CSSProperties}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#227e85'}
                  onBlur={(e) => e.currentTarget.style.borderColor = ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="Input text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#227e85' } as React.CSSProperties}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#227e85'}
                  onBlur={(e) => e.currentTarget.style.borderColor = ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) => handleChange('business_name', e.target.value)}
                  placeholder="Input text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#227e85' } as React.CSSProperties}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#227e85'}
                  onBlur={(e) => e.currentTarget.style.borderColor = ''}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <span>Login</span>
                  <div className="relative inline-block w-10 h-6 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={formData.login_enabled}
                      onChange={(e) => handleChange('login_enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div
                      onClick={() => handleChange('login_enabled', !formData.login_enabled)}
                      className={`block w-10 h-6 rounded-full cursor-pointer transition-colors ${
                        formData.login_enabled ? 'bg-teal-600' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          formData.login_enabled ? 'transform translate-x-4' : ''
                        }`}
                      />
                    </div>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Info
                </label>
                <textarea
                  value={formData.additional_info}
                  onChange={(e) => handleChange('additional_info', e.target.value)}
                  placeholder="Type content here"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                  style={{ '--tw-ring-color': '#227e85' } as React.CSSProperties}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#227e85'}
                  onBlur={(e) => e.currentTarget.style.borderColor = ''}
                />
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white rounded transition-colors"
              style={{ backgroundColor: '#227e85' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a6268'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#227e85'}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
