/*
  # Add New Fields to Referral Providers Table

  1. New Columns Added
    - `sub_category` (text) - Referral sub category name (e.g., "Dr. Martinez", "Cars", "Instagram")
    - `referral_category` (text) - Selected category from dropdown for categorization
    - `merge_to_id` (uuid) - Reference to provider this should be merged into
    - `linked_patients_count` (integer) - Count of patients associated with this provider
    - `do_not_migrate` (boolean) - Flag to exclude this provider from migration
    - `skipped` (boolean) - Flag indicating this record was skipped during processing
    - `phone_number` (text) - Phone number for validation
    - `fax` (text) - Fax number for validation
    - `zip_code` (text) - Zip code for validation

  2. Purpose
    - Enable comprehensive referral source mapping functionality
    - Support categorization and merging workflows
    - Track validation issues for phone, fax, and zip data
    - Allow users to exclude specific providers from migration
*/

-- Add new columns to referral_providers table
DO $$
BEGIN
  -- Add sub_category column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referral_providers' AND column_name = 'sub_category'
  ) THEN
    ALTER TABLE referral_providers ADD COLUMN sub_category text;
  END IF;

  -- Add referral_category column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referral_providers' AND column_name = 'referral_category'
  ) THEN
    ALTER TABLE referral_providers ADD COLUMN referral_category text;
  END IF;

  -- Add merge_to_id column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referral_providers' AND column_name = 'merge_to_id'
  ) THEN
    ALTER TABLE referral_providers ADD COLUMN merge_to_id uuid REFERENCES referral_providers(id);
  END IF;

  -- Add linked_patients_count column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referral_providers' AND column_name = 'linked_patients_count'
  ) THEN
    ALTER TABLE referral_providers ADD COLUMN linked_patients_count integer DEFAULT 0;
  END IF;

  -- Add do_not_migrate column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referral_providers' AND column_name = 'do_not_migrate'
  ) THEN
    ALTER TABLE referral_providers ADD COLUMN do_not_migrate boolean DEFAULT false;
  END IF;

  -- Add skipped column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referral_providers' AND column_name = 'skipped'
  ) THEN
    ALTER TABLE referral_providers ADD COLUMN skipped boolean DEFAULT false;
  END IF;

  -- Add phone_number column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referral_providers' AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE referral_providers ADD COLUMN phone_number text;
  END IF;

  -- Add fax column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referral_providers' AND column_name = 'fax'
  ) THEN
    ALTER TABLE referral_providers ADD COLUMN fax text;
  END IF;

  -- Add zip_code column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referral_providers' AND column_name = 'zip_code'
  ) THEN
    ALTER TABLE referral_providers ADD COLUMN zip_code text;
  END IF;
END $$;