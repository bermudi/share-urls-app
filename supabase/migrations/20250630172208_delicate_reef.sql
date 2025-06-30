/*
  # Make UrlList completely open and public

  1. Database Changes
    - Make user_id nullable in bundles table
    - Remove user-based restrictions

  2. Security Changes
    - Drop all existing user-based policies
    - Create new public policies allowing anonymous access
    - Allow anyone to create and publish bundles
    - Allow anyone to read published bundles and their links

  3. Notes
    - Bundles can now be created without authentication
    - Published bundles are publicly accessible
    - No user ownership restrictions
*/

-- Make user_id nullable and remove foreign key constraint
ALTER TABLE bundles ALTER COLUMN user_id DROP NOT NULL;

-- Drop ALL existing policies for both tables
DROP POLICY IF EXISTS "Users can read own bundles" ON bundles;
DROP POLICY IF EXISTS "Users can create own bundles" ON bundles;
DROP POLICY IF EXISTS "Users can update own bundles" ON bundles;
DROP POLICY IF EXISTS "Users can delete own bundles" ON bundles;
DROP POLICY IF EXISTS "Anyone can read published bundles" ON bundles;

DROP POLICY IF EXISTS "Users can read own bundle links" ON bundle_links;
DROP POLICY IF EXISTS "Users can create links for own bundles" ON bundle_links;
DROP POLICY IF EXISTS "Users can update links for own bundles" ON bundle_links;
DROP POLICY IF EXISTS "Users can delete links for own bundles" ON bundle_links;
DROP POLICY IF EXISTS "Anyone can read links for published bundles" ON bundle_links;

-- Create new public policies for bundles
CREATE POLICY "Public can create bundles"
  ON bundles
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can read published bundles"
  ON bundles
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Public can update bundles"
  ON bundles
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create new public policies for bundle_links
CREATE POLICY "Public can create bundle links"
  ON bundle_links
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can read published bundle links"
  ON bundle_links
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bundles 
      WHERE bundles.id = bundle_links.bundle_id 
      AND bundles.published = true
    )
  );

CREATE POLICY "Public can update bundle links"
  ON bundle_links
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete bundle links"
  ON bundle_links
  FOR DELETE
  TO anon, authenticated
  USING (true);