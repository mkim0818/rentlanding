'use server';

import { sql } from '@/lib/db';

export async function getLeads(pass: string) {
  const adminPw = process.env.ADMIN_PASSWORD || 'admin123';
  if (pass !== adminPw) return { authorized: false, leads: [] };

  const leads = await sql`
    SELECT id, name, phone, car_type, customer_type, preferred_period,
           utm_source, car_slug, created_at
    FROM leads
    ORDER BY created_at DESC
    LIMIT 200
  `;
  return { authorized: true, leads: leads.rows };
}
