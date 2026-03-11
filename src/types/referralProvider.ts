export interface ReferralProvider {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  contact_info: string;
  npi: string;
  category: 'referral_provider' | 'other';
  is_merged: boolean;
  merged_into_id: string | null;
  sub_category: string | null;
  referral_category: string | null;
  merge_to_id: string | null;
  linked_patients_count: number;
  do_not_migrate: boolean;
  skipped: boolean;
  phone_number: string | null;
  fax: string | null;
  zip_code: string | null;
  address: string | null;
  prefix: string | null;
  speciality: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state: string | null;
  business_name: string | null;
  login_enabled: boolean;
  additional_info: string | null;
  created_at: string;
  updated_at: string;
}

export type ValidationIssue =
  | 'missing_first_name'
  | 'missing_last_name'
  | 'duplicate_email'
  | 'duplicate_npi'
  | 'missing_email'
  | 'invalid_email'
  | 'invalid_npi'
  | 'invalid_zip'
  | 'invalid_fax'
  | 'invalid_phone';

export interface ProviderWithIssues extends ReferralProvider {
  issues: ValidationIssue[];
  duplicateWith?: string[];
}
