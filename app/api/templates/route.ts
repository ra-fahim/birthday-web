export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { templateCatalog } from '@/lib/templates';

export async function GET() {
  try {
    const existing = await db.template.findMany({ where: { active: true } });
    const bySlug = new Map<string, any>(existing.map((template: any) => [template.slug, template] as [string, any]));
    return NextResponse.json(templateCatalog.map((definition, index) => ({
      ...definition,
      ...(bySlug.get(definition.slug) || {}),
      id: bySlug.get(definition.slug)?.id ?? String(index),
      active: true,
      config: bySlug.get(definition.slug)?.config ?? {},
    })));
  } catch {
    return NextResponse.json(templateCatalog.map((x, i) => ({ ...x, id: String(i), active: true, config: {} })));
  }
}
