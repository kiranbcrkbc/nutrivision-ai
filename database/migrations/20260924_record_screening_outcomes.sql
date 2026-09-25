-- Apply once to an existing database if schema auto-update is disabled.
-- Back up the database first and review the schema with the deployment operator.
ALTER TABLE assessments ADD COLUMN screening_result_json LONGTEXT NULL;
