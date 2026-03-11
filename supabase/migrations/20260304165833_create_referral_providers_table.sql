/*
  # Create referral providers table

  1. New Tables
    - `referral_providers`
      - `id` (uuid, primary key) - Unique identifier for each provider
      - `first_name` (text) - Provider's first name
      - `last_name` (text) - Provider's last name
      - `email` (text) - Provider's email address
      - `contact_info` (text) - Phone number or other contact information
      - `npi` (text) - National Provider Identifier
      - `category` (text) - Either 'referral_provider' or 'other'
      - `is_merged` (boolean) - Flag to indicate if provider has been merged into another
      - `merged_into_id` (uuid) - Reference to the provider this was merged into
      - `created_at` (timestamptz) - Timestamp of creation
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Security
    - Enable RLS on `referral_providers` table
    - Add policies for authenticated users to:
      - View all referral providers
      - Insert new referral providers
      - Update existing referral providers
      - Delete referral providers

  3. Important Notes
    - NPI is a 10-digit number used in the US healthcare system
    - The table allows duplicates to demonstrate validation scenarios
    - Merged providers are soft-deleted (marked as is_merged=true)
*/

CREATE TABLE IF NOT EXISTS referral_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text DEFAULT '',
  last_name text DEFAULT '',
  email text DEFAULT '',
  contact_info text DEFAULT '',
  npi text DEFAULT '',
  category text DEFAULT 'referral_provider',
  is_merged boolean DEFAULT false,
  merged_into_id uuid REFERENCES referral_providers(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE referral_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all referral providers"
  ON referral_providers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert referral providers"
  ON referral_providers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update referral providers"
  ON referral_providers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete referral providers"
  ON referral_providers
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_referral_providers_email ON referral_providers(email);
CREATE INDEX IF NOT EXISTS idx_referral_providers_npi ON referral_providers(npi);
CREATE INDEX IF NOT EXISTS idx_referral_providers_is_merged ON referral_providers(is_merged);
