/*
  # Create URL bundles schema

  1. New Tables
    - `bundles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `vanity_url` (text, unique, optional)
      - `title` (text, optional)
      - `description` (text, optional)
      - `published` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `bundle_links`
      - `id` (uuid, primary key)
      - `bundle_id` (uuid, references bundles)
      - `url` (text)
      - `title` (text)
      - `description` (text)
      - `favicon` (text)
      - `og_image` (text, optional)
      - `position` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own bundles
    - Add policies for public read access to published bundles
*/

-- Create bundles table
CREATE TABLE IF NOT EXISTS bundles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  vanity_url text UNIQUE,
  title text,
  description text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bundle_links table
CREATE TABLE IF NOT EXISTS bundle_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id uuid REFERENCES bundles(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  favicon text DEFAULT '',
  og_image text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_links ENABLE ROW LEVEL SECURITY;

-- Bundles policies
CREATE POLICY "Users can read own bundles"
  ON bundles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bundles"
  ON bundles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bundles"
  ON bundles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bundles"
  ON bundles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read published bundles"
  ON bundles
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Bundle links policies
CREATE POLICY "Users can read own bundle links"
  ON bundle_links
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bundles 
      WHERE bundles.id = bundle_links.bundle_id 
      AND bundles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create links for own bundles"
  ON bundle_links
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bundles 
      WHERE bundles.id = bundle_links.bundle_id 
      AND bundles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update links for own bundles"
  ON bundle_links
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bundles 
      WHERE bundles.id = bundle_links.bundle_id 
      AND bundles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bundles 
      WHERE bundles.id = bundle_links.bundle_id 
      AND bundles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete links for own bundles"
  ON bundle_links
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bundles 
      WHERE bundles.id = bundle_links.bundle_id 
      AND bundles.user_id = auth.uid()
    )
  );

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS bundles_user_id_idx ON bundles(user_id);
CREATE INDEX IF NOT EXISTS bundles_vanity_url_idx ON bundles(vanity_url);
CREATE INDEX IF NOT EXISTS bundles_published_idx ON bundles(published);
CREATE INDEX IF NOT EXISTS bundle_links_bundle_id_idx ON bundle_links(bundle_id);
CREATE INDEX IF NOT EXISTS bundle_links_position_idx ON bundle_links(bundle_id, position);

-- Create updated_at trigger for bundles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bundles_updated_at
  BEFORE UPDATE ON bundles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();