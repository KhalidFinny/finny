#!/bin/sh
# blake3-wasm@2.1.5 ships a broken ESM entry: esm/index.js re-exports from
# './node.js', but that file actually lives at './node/index.js'. Any bundler
# or optimizer that crawls wrangler (which requires 'blake3-wasm') trips over
# the missing relative module. Rewrite the entry to point at the real file.
# Idempotent — safe to run on every install.
set -e
FILE="node_modules/blake3-wasm/esm/index.js"
[ -f "$FILE" ] || exit 0
if grep -q "./node/index.js" "$FILE"; then
  exit 0
fi
sed -i "s|export \* from './node\.js'|export * from './node/index.js'|" "$FILE"
