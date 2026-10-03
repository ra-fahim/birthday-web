export function normalizeAppUrl(value?: string | null): string {
  let v = String(value || '').trim().replace(/\/+$/, '');
  if (!v) return '';
  if (!/^https?:\/\//i.test(v)) v = `${/^(localhost|127\.0\.0\.1)(:|$)/i.test(v) ? 'http' : 'https'}://${v}`;
  try { return new URL(v).origin; } catch { return ''; }
}
