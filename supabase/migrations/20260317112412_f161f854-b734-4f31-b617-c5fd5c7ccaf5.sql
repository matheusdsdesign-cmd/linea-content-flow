
-- Create storage bucket for script attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('roteiros', 'roteiros', true);

-- Allow anyone to upload files (no auth required for now)
CREATE POLICY "Anyone can upload roteiros"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'roteiros');

-- Allow anyone to read roteiros
CREATE POLICY "Anyone can read roteiros"
ON storage.objects FOR SELECT
USING (bucket_id = 'roteiros');

-- Allow anyone to delete roteiros
CREATE POLICY "Anyone can delete roteiros"
ON storage.objects FOR DELETE
USING (bucket_id = 'roteiros');
