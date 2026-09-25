-- Apply once if Hibernate schema update is disabled. New uploads are durable in TiDB.
ALTER TABLE assessment_images ADD COLUMN image_data LONGBLOB NULL;
-- Existing files need explicit backfill while their original disk data is available.
