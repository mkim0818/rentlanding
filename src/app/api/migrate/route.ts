import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS kakao_id TEXT`;
    return NextResponse.json({ ok: true, message: 'kakao_id column added' });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
