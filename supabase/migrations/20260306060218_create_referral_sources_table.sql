/*
  # Create Referral Sources Table

  1. New Tables
    - `referral_sources`
      - `id` (uuid, primary key) - Unique identifier for each referral source
      - `name` (text, unique, not null) - Name of the referral source
      - `created_at` (timestamptz) - When the source was created
      - `updated_at` (timestamptz) - When the source was last updated
  
  2. Security
    - Enable RLS on `referral_sources` table
    - Add policy for public read access (anyone can view referral sources)
    - Add policy for public write access (anyone can manage referral sources)
  
  3. Notes
    - This table stores custom referral source categories that can be used across all providers
    - Sources can be added, renamed, and deleted through the UI
    - The name field is unique to prevent duplicate sources
*/

CREATE TABLE IF NOT EXISTS referral_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE referral_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to referral sources"
  ON referral_sources
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to referral sources"
  ON referral_sources
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to referral sources"
  ON referral_sources
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to referral sources"
  ON referral_sources
  FOR DELETE
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_referral_sources_name ON referral_sources(name);
