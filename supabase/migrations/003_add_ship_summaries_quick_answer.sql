ALTER TABLE ships ADD COLUMN IF NOT EXISTS summary_en TEXT;
ALTER TABLE ships ADD COLUMN IF NOT EXISTS summary_bn TEXT;
ALTER TABLE ships ADD COLUMN IF NOT EXISTS details_en TEXT;
ALTER TABLE ships ADD COLUMN IF NOT EXISTS details_bn TEXT;
ALTER TABLE ships ADD COLUMN IF NOT EXISTS quick_answer JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN ships.summary_en IS 'English summary for ship page';
COMMENT ON COLUMN ships.summary_bn IS 'Bengali summary for ship page';
COMMENT ON COLUMN ships.details_en IS 'English detailed description (markdown supported)';
COMMENT ON COLUMN ships.details_bn IS 'Bengali detailed description (markdown supported)';
COMMENT ON COLUMN ships.quick_answer IS 'Quick Answer Q&A pairs as JSON array [[question, answer], ...] - markdown supported in answers';