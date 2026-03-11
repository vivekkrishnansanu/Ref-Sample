import React, { useState } from 'react';
import { X, Plus, CreditCard as Edit2, Trash2, Check } from 'lucide-react';

interface ReferralSource {
  id: string;
  name: string;
  created_at: string;
}

interface ReferralSourceManagerProps {
  onClose: () => void;
  sources: ReferralSource[];
  onAdd: (name: string) => Promise<void>;
  onRename: (id: string, newName: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ReferralSourceManager({
  onClose,
  sources,
  onAdd,
  onRename,
  onDelete
}: ReferralSourceManagerProps) {
  const [newSourceName, setNewSourceName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newSourceName.trim()) return;

    setIsAdding(true);
    try {
      await onAdd(newSourceName.trim());
      setNewSourceName('');
    } catch (error) {
      console.error('Failed to add source:', error);
      alert('Failed to add referral source. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRename = async (id: string) => {
    if (!editingName.trim()) return;

    try {
      await onRename(id, editingName.trim());
      setEditingId(null);
      setEditingName('');
    } catch (error) {
      console.error('Failed to rename source:', error);
      alert('Failed to rename referral source. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this referral source? This action cannot be undone.')) {
      return;
    }

    try {
      await onDelete(id);
    } catch (error) {
      console.error('Failed to delete source:', error);
      alert('Failed to delete referral source. Please try again.');
    }
  };

  const startEditing = (source: ReferralSource) => {
    setEditingId(source.id);
    setEditingName(source.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Manage Referral Sources</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSourceName}
              onChange={(e) => setNewSourceName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Enter new referral source name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#227e85' } as React.CSSProperties}
              onFocus={(e) => e.currentTarget.style.borderColor = '#227e85'}
              onBlur={(e) => e.currentTarget.style.borderColor = ''}
              disabled={isAdding}
            />
            <button
              onClick={handleAdd}
              disabled={!newSourceName.trim() || isAdding}
              className="px-4 py-2 text-white text-sm font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{ backgroundColor: '#227e85' }}
              onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#1a6268')}
              onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#227e85')}
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-2">
            {sources.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No custom referral sources yet. Add one above to get started.
              </div>
            ) : (
              sources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                >
                  {editingId === source.id ? (
                    <>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRename(source.id);
                          if (e.key === 'Escape') cancelEditing();
                        }}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': '#227e85' } as React.CSSProperties}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#227e85'}
                        onBlur={(e) => e.currentTarget.style.borderColor = ''}
                        autoFocus
                      />
                      <button
                        onClick={() => handleRename(source.id)}
                        className="p-2 rounded transition-colors"
                        style={{ color: '#227e85' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0fdfa'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        title="Save"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        title="Cancel"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm text-gray-900">{source.name}</span>
                      <button
                        onClick={() => startEditing(source)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Rename"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(source.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
