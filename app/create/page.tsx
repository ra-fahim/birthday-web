import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import PublicNavbar from '@/components/navigation/PublicNavbar';
import { templatesByCategory } from '@/lib/templates';

const CATEGORY_META: Record<string, { label: string; emoji: string; description: string }> = {
  birthday: { label: 'Birthday', emoji: '🎂', description: 'Celebrate their day with a beautiful interactive birthday experience.' },
  proposal: { label: 'Proposal', emoji: '💍', description: 'Build a romantic reveal, question, or proposal they will remember.' },
  wedding: { label: 'Wedding', emoji: '💒', description: 'Turn your story, memories and moments into a shareable wedding experience.' },
  'miss-you': { label: 'Miss You', emoji: '💌', description: 'Send a thoughtful digital letter for the person you cannot stop missing.' },
  anniversary: { label: 'Anniversary', emoji: '💞', description: 'Celebrate the years, memories and little things that make your story yours.' },
  congratulations: { label: 'Congratulations', emoji: '🏆', description: 'Mark an achievement with a polished, personal celebration page.' },
  graduation: { label: 'Graduation', emoji: '🎓', description: 'Create a memorable digital celebration for a milestone worth sharing.' },
  friendship: { label: 'Friendship', emoji: '🤝', description: 'Make a page full of memories, inside jokes and reasons to smile.' },
  surprise: { label: 'Surprise', emoji: '🎁', description: 'Set up a reveal, message or experience that feels like a real surprise.' },
  sorry: { label: 'Sorry', emoji: '🥺', description: 'Say what you mean with a personal page made for one important person.' },
  'thank-you': { label: 'Thank You', emoji: '💐', description: 'Turn a simple thank-you into something they can keep and revisit.' },
  festival: { label: 'Festival', emoji: '🎊', description: 'Create a festive experience for a special day, event or celebration.' },
};

export default async function CreatePage() {
  const u = await getSessionUser().catch(() => null);
  if (!u) redirect('/signup?next=%2Fcreate');
  const categories = Object.entries(templatesByCategory).filter(([, templates]) => templates.length > 0);

  return (
    <main className="premium-site">
      <PublicNavbar user={u} />
      <section className="premium-container inner-hero create-hero">
        <p className="section-kicker">CREATE A WEBSITE</p>
        <h1>Choose what this moment<br /><span>is about.</span></h1>
        <p>Pick an occasion first. You will then see only the templates made for that kind of experience.</p>
      </section>

      <section className="premium-container occasion-library" aria-label="Website occasions">
        {categories.map(([category, templates]) => {
          const meta = CATEGORY_META[category] || { label: category, emoji: '✦', description: 'Choose a template for this kind of experience.' };
          return (
            <Link href={`/templates/${category}`} className="occasion-library-card" key={category}>
              <div className="occasion-library-art" style={{ ['--occasion-accent' as string]: templates[0]?.accent || '#ec4899' }}>
                <span className="occasion-library-emoji">{meta.emoji}</span>
                <span className="occasion-library-count">{templates.length} template{templates.length === 1 ? '' : 's'}</span>
              </div>
              <div className="occasion-library-copy">
                <div>
                  <p className="section-kicker">{category.replace('-', ' ')}</p>
                  <h2>{meta.label}</h2>
                  <p>{meta.description}</p>
                </div>
                <span className="occasion-library-arrow">View templates <b>→</b></span>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
