/*
  # Add Address Field to Referral Providers

  1. New Column
    - `address` (text) - Physical address for the provider

  2. Purpose
    - Store provider address information for data validation and mapping
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referral_providers' AND column_name = 'address'
  ) THEN
    ALTER TABLE referral_providers ADD COLUMN address text;
  END IF;
END $$;
