/*
  # Add Additional Provider Contact Fields

  1. New Columns Added
    - `prefix` (text) - Professional prefix (e.g., "Dr.", "Mr.", "Ms.")
    - `middle_name` (text) - Middle name of the provider
    - `speciality` (text) - Medical or professional speciality
    - `address_line_1` (text) - Primary street address
    - `address_line_2` (text) - Secondary address line (apt, suite, etc.)
    - `city` (text) - City
    - `state` (text) - State or province
    - `business_name` (text) - Business or practice name
    - `login_enabled` (boolean) - Whether login is enabled for this provider
    - `additional_info` (text) - Additional notes or information

  2. Purpose
    - Expand provider contact information capabilities
    - Support comprehensive address management
    - Enable login functionality tracking
    - Provide space for additional notes and information
*/

-- Add new columns to referral_providers table
DO $$
BEGIN
  -- Add prefix column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referral_providers' AND column_name = 'prefix'
  ) THEN
    ALTER TABLE referral_providers ADD COLUMN prefix text;
  END IF;

  -- Add middle_name column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referral_providers' AND column_name = 'middle_name'
  ) THEN
    ALTER TABLE referral_providers ADD COLUMN middle_name text;
  END IF;

  -- Add speciality column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referral_providers' AND column_name = 'speciality'
  ) THEN
    ALTER TABLE referral_providers ADD COLUMN speciality text;
  END IF;

  -- Add address_line_1 column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referral_providers' AND column_name = 'address_line_1'
  ) THEN
    ALTER TABLE referral_providers ADD COLUMN address_line_1 text;
  END IF;

  -- Add address_line_2 column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referral_providers' AND column_name = 'address_line_2'
  ) THEN
    ALTER TABLE referral_providers ADD COLUMN address_line_2 text;
  END IF;

  -- Add city column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referral_providers' AND column_name = 'city'
  ) THEN
    ALTER TABLE referral_providers ADD COLUMN city text;
  END IF;

  -- Add state column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referral_providers' AND column_name = 'state'
  ) THEN
    ALTER TABLE referral_providers ADD COLUMN state text;
  END IF;

  -- Add business_name column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referral_providers' AND column_name = 'business_name'
  ) THEN
    ALTER TABLE referral_providers ADD COLUMN business_name text;
  END IF;

  -- Add login_enabled column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referral_providers' AND column_name = 'login_enabled'
  ) THEN
    ALTER TABLE referral_providers ADD COLUMN login_enabled boolean DEFAULT false;
  END IF;

  -- Add additional_info column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referral_providers' AND column_name = 'additional_info'
  ) THEN
    ALTER TABLE referral_providers ADD COLUMN additional_info text;
  END IF;
END $$;