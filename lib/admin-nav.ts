export const ADMIN_MODULES: [string, string][] = [
  ['User Management', '/admin/users'],
  ['Admin & Support Accounts', '/admin/accounts'],
  ['Website Management', '/admin/websites'],
  ['Template Spotlight', '/admin/templates'],
  ['Categories', '/admin/categories'],
  ['Demo Website Manager', '/admin/demo'],
  ['Media Library', '/admin/media'],
  ['Content Moderation', '/admin/reports'],
  ['Analytics', '/admin/analytics'],
  ['Notifications', '/admin/notifications'],
  ['Email Templates', '/admin/email'],
  ['SEO Defaults', '/admin/seo'],
  ['Website Settings', '/admin/settings'],
  ['Storage Overview', '/admin/cloudinary'],
  ['System Health', '/admin/supabase'],
  ['Maintenance Mode', '/admin/maintenance'],
];

/** Grouped navigation used by the admin sidebar: [group, [[label, href, icon], ...]] */
export const ADMIN_GROUPS: [string, [string, string, string][]][] = [
  ['Overview', [
    ['Dashboard', '/admin', '🏠'],
    ['Analytics', '/admin/analytics', '📈'],
  ]],
  ['People', [
    ['User Management', '/admin/users', '👥'],
    ['Admin & Support Accounts', '/admin/accounts', '🛡️'],
  ]],
  ['Content', [
    ['Website Management', '/admin/websites', '🌐'],
    ['Template Spotlight', '/admin/templates', '✨'],
    ['Categories', '/admin/categories', '🗂️'],
    ['Demo Website Manager', '/admin/demo', '🎬'],
    ['Media Library', '/admin/media', '🖼️'],
    ['Content Moderation', '/admin/reports', '🚩'],
  ]],
  ['Communication', [
    ['Notifications', '/admin/notifications', '🔔'],
    ['Email Templates', '/admin/email', '✉️'],
    ['SEO Defaults', '/admin/seo', '🔍'],
  ]],
  ['System', [
    ['Website Settings', '/admin/settings', '⚙️'],
    ['Storage Overview', '/admin/cloudinary', '☁️'],
    ['System Health', '/admin/supabase', '💚'],
    ['Maintenance Mode', '/admin/maintenance', '🛠️'],
  ]],
];
