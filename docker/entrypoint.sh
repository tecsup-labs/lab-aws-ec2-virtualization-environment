#!/bin/sh
set -e

echo "⏳ Waiting for PostgreSQL database to be ready..."

# Parse host and port from DATABASE_URL
# Example format: postgresql://postgres:postgres123@db:5432/contacts_db
DB_HOST=$(echo $DATABASE_URL | sed -e 's|.*@||' -e 's|/.*||' -e 's|:.*||')
DB_PORT=$(echo $DATABASE_URL | sed -e 's|.*@||' -e 's|/.*||' -e 's|.*:||')

if [ -z "$DB_HOST" ]; then
  DB_HOST="db"
fi

if [ -z "$DB_PORT" ]; then
  DB_PORT="5432"
fi

echo "Connecting to database at $DB_HOST:$DB_PORT"

until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "⚠️ Database is unavailable - sleeping 2 seconds"
  sleep 2
done

echo "✅ Database is up and running!"

# Run migrations/schema sync
echo "🔄 Synchronizing database schema with Prisma..."
npx prisma db push --accept-data-loss

# Run seeding
echo "🌱 Running database seeding..."
npx prisma db seed

echo "🚀 Starting Next.js Standalone Production Server..."
exec node server.js
