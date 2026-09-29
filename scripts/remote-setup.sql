-- Add per-project meta fields for the portfolio detail view.
ALTER TABLE projects ADD COLUMN role TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN stack TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN year TEXT NOT NULL DEFAULT '';

-- Add detail-page fields for projects.
ALTER TABLE projects ADD COLUMN source_link TEXT;
ALTER TABLE projects ADD COLUMN gallery TEXT NOT NULL DEFAULT '[]';

-- Sync profile identity copy to the personal brand direction (2026-08-11).
UPDATE profile SET about_headline = 'I design interfaces and build them to work' WHERE id = 1;
UPDATE profile SET approach = 'Build it clean. Make it workable. Give it character, soul, and life.' WHERE id = 1;

-- Sync experiences to the CV (2026-08-13): add Intelix as the current role,
-- fix Surabaya Autocomp end date, align sort_order, education expected end year.
INSERT OR IGNORE INTO "experiences" ("id","role","company","location","period","description","type","sort_order") VALUES('exp0','Front-end Developer Intern','PT Intelix Global Crossing','Ngoro, Indonesia','July 2026 - Present','["Optimized front-end performance using TanStack libraries.", "Modernized product UI designs with modern UX principles.", "Optimized query handling with TanStack Query for faster API queries."]','work',0);
UPDATE "experiences" SET period = 'January 2026 - June 2026', sort_order = 1 WHERE id = 'exp1';
UPDATE "experiences" SET sort_order = 2 WHERE id = 'exp2';
UPDATE "experiences" SET sort_order = 3 WHERE id = 'exp3';
UPDATE "experiences" SET sort_order = 4 WHERE id = 'exp4';
UPDATE "experiences" SET period = 'August 2023 - 2027', sort_order = 5 WHERE id = 'exp5';

-- Sync experiences to the updated CV (2026-08-13): Intelix base location is Malang.
UPDATE "experiences" SET location = 'Malang, Indonesia' WHERE id = 'exp0';

-- Admin: persist the CV path on the profile row so the header/footer can point at it.
ALTER TABLE profile ADD COLUMN cv_path TEXT NOT NULL DEFAULT '/CV%20-%20Muhammad%20Khalid%20Atthoriq.pdf';

-- Cache table for external data (GitHub stats) with atomic get-or-set semantics.
CREATE TABLE IF NOT EXISTS cache (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);

-- Reset the portfolio to a blank slate (2026-08-19): seeded projects are
-- removed so content can be re-entered from scratch through the admin panel.
-- Profile, categories, experiences, socials, and techs are kept - the admin
-- category dropdown and identity copy depend on them.
DELETE FROM projects;

-- Seed core data required by the app (2026-08-19): categories for the
-- project FK constraint and profile for the site identity copy.
-- Uses INSERT OR IGNORE so re-applying is safe.
INSERT OR IGNORE INTO "categories" ("id","title","see_more_link","sort_order") VALUES('programming','Programming','https://drive.google.com/drive/folders/1GKB7l--fYM1Pk6oBs9qdE7w8sXbMIDRM?usp=sharing',0);
INSERT OR IGNORE INTO "categories" ("id","title","see_more_link","sort_order") VALUES('ui-ux','UI/UX Design','https://drive.google.com/file/d/1chC-iyWf599BFjHn7WU3EnQocImydr4s/view?usp=sharing',1);
INSERT OR IGNORE INTO "categories" ("id","title","see_more_link","sort_order") VALUES('videography','Videography','https://drive.google.com/drive/folders/1nJ36224aH9--g42N2PEbcAlc2ipyWLwo?usp=sharing',2);
INSERT OR IGNORE INTO "categories" ("id","title","see_more_link","sort_order") VALUES('photography','Photography','https://instagram.com/finny.picss',3);
INSERT OR IGNORE INTO "profile" ("id","name","title","about_headline","about_profile","about_study","approach","approach_detail","approach_detail_2") VALUES(1,'Khalid Atthoriq','Fullstack Creative Developer','I design interfaces and build them to work.','I build fullstack apps, design interfaces, and create visual content.','I study Informatics Engineering at State Polytechnic of Malang. My work blends engineering with creative direction, so the result is functional and still has personality.','Build it clean. Make it workable. Give it character, soul, and life.','I keep layouts editorial and structured, but still easy for people to use.','I care about clear hierarchy, strong visuals, and smooth interactions.');

-- Add build-status label to projects (2026-08-19).
-- Existing rows default to 'done'; the admin form can switch to 'ongoing'.
ALTER TABLE projects ADD COLUMN status TEXT NOT NULL DEFAULT 'done' CHECK (status IN ('ongoing', 'done'));

-- Seed the techs table (2026-08-19): the admin stack dropdown selects from
-- these rows, so techs are now core data required by the app. Mirrors the
-- remote D1 export in scripts/seed.sql. INSERT OR IGNORE so re-applying is safe.
INSERT OR IGNORE INTO "techs" ("id","name","category","sort_order") VALUES(1,'React','programming',0);
INSERT OR IGNORE INTO "techs" ("id","name","category","sort_order") VALUES(2,'JavaScript','programming',1);
INSERT OR IGNORE INTO "techs" ("id","name","category","sort_order") VALUES(3,'TypeScript','programming',2);
INSERT OR IGNORE INTO "techs" ("id","name","category","sort_order") VALUES(4,'Next.js','programming',3);
INSERT OR IGNORE INTO "techs" ("id","name","category","sort_order") VALUES(5,'Tailwind CSS','programming',4);
INSERT OR IGNORE INTO "techs" ("id","name","category","sort_order") VALUES(6,'Angular','programming',5);
INSERT OR IGNORE INTO "techs" ("id","name","category","sort_order") VALUES(7,'Python','programming',6);
INSERT OR IGNORE INTO "techs" ("id","name","category","sort_order") VALUES(8,'Astro','programming',7);
INSERT OR IGNORE INTO "techs" ("id","name","category","sort_order") VALUES(9,'Laravel','programming',8);
INSERT OR IGNORE INTO "techs" ("id","name","category","sort_order") VALUES(10,'PostgreSQL','programming',9);
INSERT OR IGNORE INTO "techs" ("id","name","category","sort_order") VALUES(11,'Figma','design',10);
INSERT OR IGNORE INTO "techs" ("id","name","category","sort_order") VALUES(12,'Photoshop','design',11);
INSERT OR IGNORE INTO "techs" ("id","name","category","sort_order") VALUES(13,'After Effects','video',12);
INSERT OR IGNORE INTO "techs" ("id","name","category","sort_order") VALUES(14,'Premiere Pro','video',13);
INSERT OR IGNORE INTO "techs" ("id","name","category","sort_order") VALUES(15,'Capcut','video',14);

-- Seed the experiences table (2026-08-19): work / organization / education
-- history from the CV (public/CV - Muhammad Khalid Atthoriq.pdf). Mirrors the
-- remote D1 export in scripts/seed.sql. INSERT OR IGNORE so re-applying is safe.
INSERT OR IGNORE INTO "experiences" ("id","role","company","location","period","description","type","sort_order") VALUES('exp0','Front-end Developer Intern','PT Intelix Global Crossing','Malang, Indonesia','July 2026 - Present','["Optimized front-end performance using TanStack libraries.", "Modernized product UI designs with modern UX principles.", "Optimized query handling with TanStack Query for faster API queries."]','work',0);
INSERT OR IGNORE INTO "experiences" ("id","role","company","location","period","description","type","sort_order") VALUES('exp1','Fullstack Web Developer Internship','PT Surabaya Autocomp Indonesia','Ngoro, Indonesia','January 2026 - June 2026','["Developed a simulator to efficiency in production preparation.", "Optimized website performance to ensure users work smoothly in preparing mass production documents.", "Optimized workers workflow in automating documents generation."]','work',1);
INSERT OR IGNORE INTO "experiences" ("id","role","company","location","period","description","type","sort_order") VALUES('exp2','Freelance Web Developer & UI/UX Designer','Self-Employed','Malang, Indonesia','February 2024 - February 2026','["Developed and launched responsive client websites praised for clarity, speed, and strong brand alignment.", "Optimized front-end performance and accessibility, improving user satisfaction and SEO visibility.", "Delivered a food security system recognized for its reliability and ease of data handling by field users."]','work',2);
INSERT OR IGNORE INTO "experiences" ("id","role","company","location","period","description","type","sort_order") VALUES('exp3','UI/UX Designer Internship','PT Molca Teknologi Nusantara','Surabaya, Indonesia','August 2025 - October 2025','["Created Digital Twin dashboards that enhanced monitoring flow and simplified industrial decision-making.", "Collaborated closely with developers to refine design consistency, building a unified system."]','work',3);
INSERT OR IGNORE INTO "experiences" ("id","role","company","location","period","description","type","sort_order") VALUES('exp4','Creative Team Lead','Workshop Riset Informatika','Malang, Indonesia','February 2024 - February 2026','["Led the creative division to build a unified and professional brand identity across WRI''s platforms.", "Developed an adaptable content framework that encouraged consistent output and team collaboration.", "Produced and directed video campaigns well-received for storytelling and visual quality."]','organization',4);
INSERT OR IGNORE INTO "experiences" ("id","role","company","location","period","description","type","sort_order") VALUES('exp5','Informatics Engineering (BAS)','Politeknik Negeri Malang','Malang, Indonesia','August 2023 - 2027','["Focusing on Applied Informatics with a cumulative GPA of 3.7/4.0.", "Engaging in various software development projects and research workshops."]','education',5);

