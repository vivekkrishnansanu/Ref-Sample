export const REFERRAL_CATEGORIES = [
  'Referral Provider',
  'General Dentist',
  'Migrated Category',
  'Social Media'
] as const;

export const MERGE_TO_OPTIONS = [
  'Do Not Merge',
  'Merge to Existing Provider'
] as const;

export type ReferralCategory = typeof REFERRAL_CATEGORIES[number];
export type MergeToOption = typeof MERGE_TO_OPTIONS[number];
