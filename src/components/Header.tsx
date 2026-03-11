import React, { useState } from 'react';
import { Home, Calendar, X as XIcon } from 'lucide-react';

interface HeaderProps {
  title?: string;
  dueDate?: string;
  breadcrumb?: string;
}

export function Header({ title = 'Referral Source Mapper', dueDate = '2024-03-15', breadcrumb = '10901 : Encompass Dental : Conversion 1' }: HeaderProps) {
  const [selectedDate, setSelectedDate] = useState<string>(dueDate);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const clearDate = () => {
    setSelectedDate('');
    setIsDatePickerOpen(false);
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const convertToInputFormat = (displayDate: string) => {
    if (!displayDate) return '';
    // Check if already in YYYY-MM-DD format
    if (displayDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return displayDate;
    }
    // Convert from DD/MM/YYYY to YYYY-MM-DD
    const [day, month, year] = displayDate.split('/');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 relative">
            <span className="text-sm text-gray-600">Due Date</span>
            <div className="relative">
              <button
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className="px-3 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded hover:bg-red-200 transition-colors flex items-center gap-2"
              >
                <Calendar size={14} />
                {selectedDate ? formatDisplayDate(selectedDate.match(/^\d{4}-\d{2}-\d{2}$/) ? selectedDate : convertToInputFormat(selectedDate).split('-').reverse().join('/')) : 'Select Date'}
              </button>

              {isDatePickerOpen && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-10">
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={convertToInputFormat(selectedDate)}
                      onChange={handleDateChange}
                      className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{ '--tw-ring-color': '#227e85' } as React.CSSProperties}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#227e85'}
                      onBlur={(e) => e.currentTarget.style.borderColor = ''}
                    />
                    {selectedDate && (
                      <button
                        onClick={clearDate}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Clear date"
                      >
                        <XIcon size={16} />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setIsDatePickerOpen(false)}
                    className="mt-2 w-full px-3 py-1.5 text-sm font-medium text-white rounded transition-colors"
                    style={{ backgroundColor: '#227e85' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a6268'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#227e85'}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Home size={16} />
            <span>{breadcrumb}</span>
          </div>

          <button
            className="px-4 py-2 text-white text-sm font-medium rounded transition-colors"
            style={{ backgroundColor: '#227e85' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a6268'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#227e85'}
          >
            Practice Info
          </button>
        </div>
      </div>
    </div>
  );
}
