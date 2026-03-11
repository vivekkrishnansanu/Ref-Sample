import { useState } from 'react';
import { Database } from 'lucide-react';
import { referralProviderService } from '../services/referralProviderService';

const dummyProviders = [
  {
    first_name: 'Martinez',
    last_name: '',
    email: 'martinez@gmail.com',
    contact_info: '(555) 123-4567',
    npi: '7891234560',
    category: 'referral_provider' as const,
    sub_category: 'Dr. Martinez',
    linked_patients_count: 39,
    phone_number: '5551234567',
    fax: '5551234568',
    zip_code: '10001'
  },
  {
    first_name: 'Taylor',
    last_name: '',
    email: 'taylor@gmail.com',
    contact_info: '(555) 234-5678',
    npi: '8529637410',
    category: 'referral_provider' as const,
    sub_category: 'Dr. Taylor',
    linked_patients_count: 33,
    phone_number: '5552345678',
    fax: '5552345679',
    zip_code: '10002'
  },
  {
    first_name: '',
    last_name: 'Williams',
    email: 'rwilliams@medcenter.com',
    contact_info: '(555) 345-6789',
    npi: '3456789012',
    category: 'other' as const,
    sub_category: 'Cars',
    linked_patients_count: 42,
    phone_number: '5553456789',
    fax: '555345',
    zip_code: '10003'
  },
  {
    first_name: 'Clark',
    last_name: '',
    email: 'clark@gmail.com',
    contact_info: '(555) 456-7890',
    npi: '4561237890',
    category: 'referral_provider' as const,
    sub_category: 'Dr. Clark',
    linked_patients_count: 43,
    phone_number: '555456',
    fax: '5554567891',
    zip_code: '10004'
  },
  {
    first_name: 'Thomas',
    last_name: '',
    email: 'thomas@gmail.com',
    contact_info: '(555) 567-8901',
    npi: '3217896540',
    category: 'referral_provider' as const,
    sub_category: 'Dr. Thomas',
    linked_patients_count: 49,
    phone_number: '5555678901',
    fax: '5555678902',
    zip_code: '10005'
  },
  {
    first_name: 'Wilson',
    last_name: '',
    email: 'wilson@gmail.com',
    contact_info: '(555) 678-9012',
    npi: '1597534860',
    category: 'referral_provider' as const,
    sub_category: 'Dr. Wilson',
    linked_patients_count: 41,
    phone_number: '5556789012',
    fax: '5556789013',
    zip_code: '10006'
  },
  {
    first_name: '',
    last_name: '',
    email: '',
    contact_info: '(555) 789-0123',
    npi: '',
    category: 'other' as const,
    sub_category: 'Instagram',
    linked_patients_count: 36,
    phone_number: '5557890123',
    fax: '5557890124',
    zip_code: '123'
  },
  {
    first_name: '',
    last_name: 'Taylor',
    email: '',
    contact_info: '(555) 890-1234',
    npi: '7890123456',
    category: 'referral_provider' as const,
    sub_category: 'Google',
    linked_patients_count: 50,
    phone_number: '123',
    fax: '5558901235',
    zip_code: '10008'
  },
  {
    first_name: 'Lisa',
    last_name: 'Brown',
    email: 'lisa.brown.health',
    contact_info: '(555) 901-2345',
    npi: '890123',
    category: 'referral_provider' as const,
    sub_category: '',
    linked_patients_count: 28,
    phone_number: '5559012345',
    fax: '5559012346',
    zip_code: '10009'
  },
  {
    first_name: 'James',
    last_name: 'Wilson',
    email: 'wilson@gmail.com',
    contact_info: '(555) 012-3456',
    npi: '1597534860',
    category: 'referral_provider' as const,
    sub_category: 'Dr. Wilson',
    linked_patients_count: 41,
    phone_number: '5550123456',
    fax: '5550123457',
    zip_code: '10010'
  },
  {
    first_name: '',
    last_name: '',
    email: '',
    contact_info: '(555) 111-2222',
    npi: '',
    category: 'other' as const,
    sub_category: 'Internet',
    linked_patients_count: 44,
    phone_number: '5551112222',
    fax: '5551112223',
    zip_code: '10011'
  },
  {
    first_name: 'Sarah',
    last_name: '',
    email: 'wilson@gmail.com',
    contact_info: '',
    npi: '1597534860',
    category: 'referral_provider' as const,
    sub_category: 'Dr. Wilson',
    linked_patients_count: 41,
    phone_number: '',
    fax: '',
    zip_code: ''
  },
  {
    first_name: '',
    last_name: '',
    email: 'unknown@provider.com',
    contact_info: '(555) 333-4444',
    npi: '223344',
    category: 'other' as const,
    sub_category: '',
    linked_patients_count: 15,
    phone_number: '5553334444',
    fax: '5553334445',
    zip_code: '10013'
  },
  {
    first_name: 'Emily',
    last_name: 'Davis',
    email: 'emily.davis@clinic.com',
    contact_info: '(555) 444-5555',
    npi: '9876543210',
    category: 'referral_provider' as const,
    sub_category: 'Dr. Davis',
    linked_patients_count: 0,
    phone_number: '5554445555',
    fax: '5554445556',
    zip_code: '10014'
  },
  {
    first_name: 'Robert',
    last_name: 'Johnson',
    email: 'r.johnson@healthcare.com',
    contact_info: '(555) 555-6666',
    npi: '1472583690',
    category: 'other' as const,
    sub_category: 'Facebook',
    linked_patients_count: 0,
    phone_number: '5555556666',
    fax: '5555556667',
    zip_code: '10015'
  },
  {
    first_name: 'Michael',
    last_name: 'Anderson',
    email: 'wilson@gmail.com',
    contact_info: '(555) 666-7777',
    npi: '1597534860',
    category: 'referral_provider' as const,
    sub_category: 'Dr. Wilson',
    linked_patients_count: 35,
    phone_number: '5556667777',
    fax: '5556667778',
    zip_code: '10016'
  },
  {
    first_name: '',
    last_name: 'Martinez',
    email: 'martinez@gmail.com',
    contact_info: '(555) 777-8888',
    npi: '7891234560',
    category: 'referral_provider' as const,
    sub_category: 'Dr. Martinez',
    linked_patients_count: 22,
    phone_number: '5557778888',
    fax: '5557778889',
    zip_code: '10017'
  },
  {
    first_name: '',
    last_name: '',
    email: '',
    contact_info: '(555) 888-9999',
    npi: '',
    category: 'other' as const,
    sub_category: 'Yelp',
    linked_patients_count: 0,
    phone_number: '5558889999',
    fax: '5558889990',
    zip_code: '10018'
  }
];

export function DummyDataLoader() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function loadDummyData() {
    setLoading(true);
    setMessage('');

    try {
      for (const provider of dummyProviders) {
        await referralProviderService.create(provider);
      }
      setMessage(`Successfully loaded ${dummyProviders.length} dummy providers with various validation scenarios!`);
    } catch (error) {
      setMessage('Error loading dummy data: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Database className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Load Test Data</h3>
          <p className="text-sm text-slate-600">
            Load sample providers with validation issues for testing
          </p>
        </div>
      </div>

      <button
        onClick={loadDummyData}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading ? 'Loading...' : 'Load Dummy Data'}
      </button>

      {message && (
        <div className={`mt-4 p-3 rounded-lg ${
          message.includes('Error')
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      <div className="mt-4 text-xs text-slate-500">
        <p className="font-medium mb-2">Test data includes:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Duplicate emails (5 providers with wilson@gmail.com, 2 with martinez@gmail.com)</li>
          <li>Duplicate NPIs (4 providers with NPI 1597534860, 2 with 7891234560)</li>
          <li>Missing first names and last names</li>
          <li>Missing emails</li>
          <li>Invalid email formats</li>
          <li>Providers with 0 linked patients (auto-checked for Do Not Migrate)</li>
          <li>Mixed categories (Referral Provider / Other)</li>
          <li>Various sub-categories (Dr. Martinez, Dr. Taylor, Dr. Wilson, Dr. Davis, Cars, Instagram, Google, Internet, Facebook, Yelp)</li>
        </ul>
      </div>
    </div>
  );
}
