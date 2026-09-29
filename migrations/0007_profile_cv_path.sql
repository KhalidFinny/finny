-- Admin: persist the CV path on the profile row so the header/footer can point at it.
ALTER TABLE profile ADD COLUMN cv_path TEXT NOT NULL DEFAULT '/CV%20-%20Muhammad%20Khalid%20Atthoriq.pdf';
