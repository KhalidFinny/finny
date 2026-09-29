#!/usr/bin/env bash
# One-shot remote D1 provisioning for finny.
# Reset schema + seed current data + record migrations. Idempotent — safe to re-run.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "== 1/4 reset schema (drop + recreate from local) =="
bunx wrangler d1 execute finny-db --remote --file=scripts/remote-reset.sql

echo "== 2/4 seed current data =="
bunx wrangler d1 execute finny-db --remote --file=scripts/seed-current.sql

echo "== 3/4 record migrations (future applies no-op) =="
bunx wrangler d1 execute finny-db --remote --command="INSERT OR IGNORE INTO d1_migrations (name) VALUES ('0001_init.sql'),('0002_add_project_fields.sql'),('0003_add_project_detail_fields.sql'),('0004_update_profile_identity.sql'),('0005_experiences_sync.sql'),('0006_experiences_sync.sql'),('0007_profile_cv_path.sql'),('0008_cache.sql'),('0009_reset_portfolio.sql'),('0010_seed_core_data.sql'),('0011_add_project_status.sql'),('0012_seed_techs.sql'),('0013_seed_experiences.sql');"

echo "== 4/4 verify =="
bunx wrangler d1 execute finny-db --remote --command="SELECT id,title,status FROM projects; SELECT COUNT(*) AS experiences FROM experiences; SELECT COUNT(*) AS techs FROM techs;"
