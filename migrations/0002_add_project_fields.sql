-- Add per-project meta fields for the portfolio detail view.
ALTER TABLE projects ADD COLUMN role TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN stack TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN year TEXT NOT NULL DEFAULT '';
