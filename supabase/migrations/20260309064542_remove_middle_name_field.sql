/*
  # Remove Middle Name Field

  1. Changes
    - Drop `middle_name` column from referral_providers table

  2. Purpose
    - Remove unused middle_name field from provider records
*/

-- Remove middle_name column if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referral_providers' AND column_name = 'middle_name'
  ) THEN
    ALTER TABLE referral_providers DROP COLUMN middle_name;
  END IF;
END $$;