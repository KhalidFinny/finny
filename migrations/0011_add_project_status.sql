-- Add build-status label to projects (2026-08-19).
-- Existing rows default to 'done'; the admin form can switch to 'ongoing'.
ALTER TABLE projects ADD COLUMN status TEXT NOT NULL DEFAULT 'done' CHECK (status IN ('ongoing', 'done'));
