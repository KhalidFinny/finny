-- Sync experiences to the CV (2026-08-13): add Intelix as the current role,
-- fix Surabaya Autocomp end date, align sort_order, education expected end year.
INSERT OR IGNORE INTO "experiences" ("id","role","company","location","period","description","type","sort_order") VALUES('exp0','Front-end Developer Intern','PT Intelix Global Crossing','Ngoro, Indonesia','July 2026 - Present','["Optimized front-end performance using TanStack libraries.", "Modernized product UI designs with modern UX principles.", "Optimized query handling with TanStack Query for faster API queries."]','work',0);
UPDATE "experiences" SET period = 'January 2026 - June 2026', sort_order = 1 WHERE id = 'exp1';
UPDATE "experiences" SET sort_order = 2 WHERE id = 'exp2';
UPDATE "experiences" SET sort_order = 3 WHERE id = 'exp3';
UPDATE "experiences" SET sort_order = 4 WHERE id = 'exp4';
UPDATE "experiences" SET period = 'August 2023 - 2027', sort_order = 5 WHERE id = 'exp5';
