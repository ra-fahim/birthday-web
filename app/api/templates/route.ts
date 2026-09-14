export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { templateCatalog } from '@/lib/templates';

export async function GET() {
  const builtIn = templateCatalog.map((x, i) => ({ ...x, id: String(i), active: true, config: {} }));
  try {
    const existing = await db.template.findMany({ where: { active: true } });
    const known = new Set(existing.map((x:any) => x.slug));
    return NextResponse.json([...existing, ...builtIn.filter(x => !known.has(x.slug))]);
  } catch {
    return NextResponse.json(builtIn);
  }
}
