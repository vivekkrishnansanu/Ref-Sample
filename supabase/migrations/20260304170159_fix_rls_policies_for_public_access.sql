/*
  # Fix RLS policies for public access

  1. Changes
    - Drop existing restrictive policies that require authentication
    - Add new policies that allow public access for demo purposes
    - This allows the application to work without authentication

  2. Security Notes
    - These policies allow public access for demonstration
    - In production, you would want to require authentication
    - All operations (SELECT, INSERT, UPDATE, DELETE) are now public
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view all referral providers" ON referral_providers;
DROP POLICY IF EXISTS "Authenticated users can insert referral providers" ON referral_providers;
DROP POLICY IF EXISTS "Authenticated users can update referral providers" ON referral_providers;
DROP POLICY IF EXISTS "Authenticated users can delete referral providers" ON referral_providers;

-- Create public access policies for demo purposes
CREATE POLICY "Public users can view all referral providers"
  ON referral_providers
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public users can insert referral providers"
  ON referral_providers
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public users can update referral providers"
  ON referral_providers
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public users can delete referral providers"
  ON referral_providers
  FOR DELETE
  TO public
  USING (true);
