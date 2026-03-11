import React from 'react';
import { X, Database, GitMerge, Ban, ArrowRight, ChevronRight } from 'lucide-react';

interface SourceStats {
  name: string;
  total: number;
  toMigrate: number;
  merged: number;
  skipped: number;
}

interface MigrationSummaryProps {
  isOpen: boolean;
  onToggle: () => void;
  sourceStats: SourceStats[];
  totalSources: number;
  toMigrate: number;
  merged: number;
  skipped: number;
}

export function MigrationSummary({
  isOpen,
  onToggle,
  sourceStats,
  totalSources,
  toMigrate,
  merged,
  skipped
}: MigrationSummaryProps) {
  return (
    <>
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed right-0 top-1/2 -translate-y-1/2 bg-white border border-l-0 border-gray-300 rounded-l-lg shadow-lg px-2 py-6 hover:bg-gray-50 transition-colors z-40 flex items-center gap-1"
          style={{ writingMode: 'vertical-rl' }}
        >
          <ChevronRight size={16} className="text-gray-600" style={{ transform: 'rotate(90deg)' }} />
          <span className="text-xs font-semibold text-gray-700">Migration Summary</span>
        </button>
      )}

      <div
        className={`fixed right-0 top-0 h-full bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: '400px' }}
      >
        <div className="h-full flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5" style={{ color: '#227e85' }} />
              <h2 className="text-lg font-semibold text-gray-900">Migration Summary</h2>
            </div>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="px-6 py-4 bg-white border-b border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-800">{totalSources}</div>
                <div className="text-xs text-gray-600 mt-1">Total</div>
              </div>

              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#e6f3f4' }}>
                <div className="text-xl font-bold" style={{ color: '#227e85' }}>{toMigrate}</div>
                <div className="text-xs text-gray-600 mt-1">To Migrate</div>
              </div>

              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{merged}</div>
                <div className="text-xs text-gray-600 mt-1">Merged</div>
              </div>

              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-xl font-bold text-red-600">{skipped}</div>
                <div className="text-xs text-gray-600 mt-1">Skipped</div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">By Referral Source</h3>
            <div className="space-y-2">
              {sourceStats.map((source) => (
                <div
                  key={source.name}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
                >
                  <div className="font-medium text-gray-900 text-sm mb-2">{source.name}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Total</span>
                      <span className="px-2 py-0.5 bg-white text-gray-800 font-semibold rounded">
                        {source.total}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Migrate</span>
                      <span
                        className="px-2 py-0.5 text-white font-semibold rounded"
                        style={{ backgroundColor: '#227e85' }}
                      >
                        {source.toMigrate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Merged</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-semibold rounded">
                        {source.merged}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Skipped</span>
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 font-semibold rounded">
                        {source.skipped}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
