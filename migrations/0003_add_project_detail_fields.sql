-- Add detail-page fields for projects.
ALTER TABLE projects ADD COLUMN source_link TEXT;
ALTER TABLE projects ADD COLUMN gallery TEXT NOT NULL DEFAULT '[]';
