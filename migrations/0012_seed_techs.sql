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
