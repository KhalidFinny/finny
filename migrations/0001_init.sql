CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  see_more_link TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id),
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  youtube_embed TEXT,
  instagram_link TEXT,
  google_drive_link TEXT,
  link TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE experiences (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '[]',
  type TEXT NOT NULL CHECK (type IN ('work', 'education', 'organization')),
  sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE socials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE techs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('programming', 'design', 'video')),
  sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  about_headline TEXT NOT NULL DEFAULT '',
  about_profile TEXT NOT NULL DEFAULT '',
  about_study TEXT NOT NULL DEFAULT '',
  approach TEXT NOT NULL DEFAULT '',
  approach_detail TEXT NOT NULL DEFAULT '',
  approach_detail_2 TEXT NOT NULL DEFAULT ''
);
