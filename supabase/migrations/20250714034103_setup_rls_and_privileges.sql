-- Enable RLS on bundles table
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts only for published bundles with null user_id
CREATE POLICY "Anonymous inserts for published bundles"
ON bundles FOR INSERT
TO anon
WITH CHECK (user_id IS NULL AND published = true);

-- Policy: Allow public reads only on published bundles
CREATE POLICY "Public reads on published bundles"
ON bundles FOR SELECT
TO anon
USING (published = true);

-- Forbid updates/deletes on bundles (prevent tampering after publish)
CREATE POLICY "No updates or deletes on bundles"
ON bundles FOR UPDATE, DELETE
TO anon
USING (false);  -- Always false, effectively blocking

-- Enable RLS on bundle_links table
ALTER TABLE bundle_links ENABLE ROW LEVEL SECURITY;

-- Policy: Allow inserts tied to a valid bundle
CREATE POLICY "Anonymous inserts for bundle links"
ON bundle_links FOR INSERT
TO anon
WITH CHECK (EXISTS (SELECT 1 FROM bundles WHERE bundles.id = bundle_id AND bundles.user_id IS NULL AND bundles.published = true));

-- Policy: Public reads only for links in published bundles
CREATE POLICY "Public reads on bundle links"
ON bundle_links FOR SELECT
TO anon
USING (EXISTS (SELECT 1 FROM bundles WHERE bundles.id = bundle_id AND bundles.published = true));

-- Forbid updates/deletes on bundle_links
CREATE POLICY "No updates or deletes on bundle links"
ON bundle_links FOR UPDATE, DELETE
TO anon
USING (false);

-- Column-Level Privileges: Revoke table-level UPDATE on bundles, grant only on description
REVOKE UPDATE ON TABLE bundles FROM anon;
GRANT UPDATE (description) ON TABLE bundles TO anon;

-- Revoke updates on sensitive columns (e.g., prevent changing vanity_url or published)
REVOKE UPDATE (vanity_url, published) ON TABLE bundles FROM anon;

-- Similar for bundle_links (e.g., allow updating title/description, revoke on url)
REVOKE UPDATE ON TABLE bundle_links FROM anon;
GRANT UPDATE (title, description) ON TABLE bundle_links TO anon;
REVOKE UPDATE (url, bundle_id, position) ON TABLE bundle_links FROM anon;

-- Add indexes for performance (as per RLS doc recommendations)
CREATE INDEX IF NOT EXISTS idx_bundles_published ON bundles (published);
CREATE INDEX IF NOT EXISTS idx_bundle_links_bundle_id ON bundle_links (bundle_id);