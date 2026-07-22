import { sql } from '@vercel/postgres';

async function setupDb() {
  console.log('Setting up database...');

  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      car_type TEXT,
      budget TEXT,
      contract_period TEXT,
      contact_method TEXT,
      customer_type TEXT,
      preferred_period TEXT,
      car_slug TEXT,
      kakao_id TEXT,
      utm_source TEXT,
      utm_campaign TEXT,
      utm_medium TEXT,
      utm_term TEXT,
      created_at TIMESTAMPTZ DEFAULT now(),
      status TEXT DEFAULT 'new'
    )
  `;

  // Migration: add kakao_id to existing tables
  try {
    await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS kakao_id TEXT`;
  } catch { /* column already exists */ }

  console.log('Database setup complete: leads table ready.');
  process.exit(0);
}

setupDb().catch((err) => {
  console.error('Database setup failed:', err);
  process.exit(1);
});
