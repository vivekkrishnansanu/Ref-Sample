import React from 'react';

interface FooterProps {
  onSubmit: () => void;
  hasChanges: boolean;
}

export function Footer({ onSubmit, hasChanges }: FooterProps) {
  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex justify-end">
        <button
          onClick={onSubmit}
          disabled={!hasChanges}
          className={`px-8 py-2.5 rounded font-medium text-sm transition-colors ${
            hasChanges
              ? 'bg-teal-600 text-white hover:bg-teal-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
