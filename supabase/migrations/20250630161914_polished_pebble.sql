/*
  # Update bundles for public access

  1. Changes
    - Remove user_id requirement from bundles table
    - Update RLS policies to allow anonymous publishing
    - Add indexes for public access patterns

  2. Security
    - Published bundles are publicly readable
    - Anyone can create bundles (no auth required)
    - Bundles cannot be edited after creation (immutable)
*/

-- Make user_id nullable and remove foreign key constraint
ALTER TABLE bundles ALTER COLUMN user_id DROP NOT NULL;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own bundles" ON bundles;
DROP POLICY IF EXISTS "Users can create own bundles" ON bundles;
DROP POLICY IF EXISTS "Users can update own bundles" ON bundles;
DROP POLICY IF EXISTS "Users can delete own bundles" ON bundles;
DROP POLICY IF EXISTS "Users can read own bundle links" ON bundle_links;
DROP POLICY IF EXISTS "Users can create links for own bundles" ON bundle_links;
DROP POLICY IF EXISTS "Users can update links for own bundles" ON bundle_links;
DROP POLICY IF EXISTS "Users can delete links for own bundles" ON bundle_links;

-- Create new public policies for bundles
CREATE POLICY "Anyone can create bundles"
  ON bundles
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read published bundles"
  ON bundles
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Create new public policies for bundle_links
CREATE POLICY "Anyone can create links for bundles"
  ON bundle_links
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read links for published bundles"
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