#!/bin/sh
# Menjalankan mock storage + server produksi untuk pengujian. Butuh .env.local (DATABASE_URL, SESSION_SECRET) dan `npm run build`.
cd "$(dirname "$0")/.."
export MOCK_SERVICE_KEY=test-service-role-key-SECRET-XYZ
setsid node tests/mock-storage.mjs > /tmp/mock.log 2>&1 < /dev/null &
SUPABASE_URL=http://127.0.0.1:54321 SUPABASE_SERVICE_ROLE_KEY=$MOCK_SERVICE_KEY SUPABASE_STORAGE_BUCKET=media \
  setsid npx next start -p 3000 > /tmp/next.log 2>&1 < /dev/null &
