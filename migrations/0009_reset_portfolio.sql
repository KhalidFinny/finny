-- Reset the portfolio to a blank slate (2026-08-19): seeded projects are
-- removed so content can be re-entered from scratch through the admin panel.
-- Profile, categories, experiences, socials, and techs are kept - the admin
-- category dropdown and identity copy depend on them.
DELETE FROM projects;
