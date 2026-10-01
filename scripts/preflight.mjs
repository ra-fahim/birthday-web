import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
if(pkg.dependencies?.['Supabase']||pkg.devDependencies?.Supabase) throw new Error('Supabase must not be present in Supabase-only build.');
if(pkg.dependencies?.bcryptjs) throw new Error('bcryptjs is not needed; Supabase Auth owns passwords.');
const required=['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY','SUPABASE_SERVICE_ROLE_KEY'];
const env=fs.readFileSync(path.join(root,'.env.example'),'utf8');
for(const k of required) if(!env.includes(k)) throw new Error(`Missing ${k} in .env.example`);
if(!fs.existsSync(path.join(root,'supabase_schema.sql'))) throw new Error('supabase_schema.sql is missing.');
const requiredFiles = [
  'public/templates/master-birthday/runtime.html',
  'public/templates/master-birthday/original.html',
  'public/master-template.html',
  'public/templates/master-proposal/index.html',
  'public/templates/miss-you-1/index.html',
  'public/templates/wedding-proposal-original.html',
];
for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Required template file is missing: ${file}`);
}
const masterTemplate = fs.readFileSync(path.join(root, 'public/master-template.html'), 'utf8');
const masterTemplateMarkers = [
  "const isEditorMode =",
  "let demoAudioEnabled = false;",
  "demoBirthdayTarget = isDemoMode ? new Date(Date.now() + 10000)",
  "BB_DEMO_AUDIO_ENABLED",
  "bbEditorNav",
  "BigBuckBunny.mp4",
  "anime1/800/600"
];
for (const marker of masterTemplateMarkers) {
  if (!masterTemplate.includes(marker)) throw new Error(`Master Template marker is missing: ${marker}`);
}
const runtime = fs.readFileSync(path.join(root, 'public/templates/master-birthday/runtime.html'), 'utf8');
const demoGuards = [
  'let musicEnabled = !window.__BB_FORCE_DEMO && !window.__BB_EDITOR_MODE;',
  'ca.muted = !state.countdown.audioEnabled || (!!window.__BB_FORCE_DEMO && !musicEnabled) || !!window.__BB_EDITOR_MODE;',
  "if(data.type==='BB_DEMO_AUDIO_ENABLED'){ setMusicEnabled(data.enabled !== false); return; }",
  "if(data.type==='BB_DEMO_PLAY_AUDIO'){ return; }",
  'if (window.__BB_FORCE_DEMO || micAutoRequested',
];
for (const marker of demoGuards) {
  if (!runtime.includes(marker)) throw new Error(`Master Birthday demo-safety guard is missing: ${marker}`);
}
console.log('Birthday Builder Supabase preflight: PASS');
