import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mail';

export const runtime = 'nodejs';

// Public endpoint used by the Master Proposal (Valentine) template's
// "Send Ticket" button. The template runs in a sandboxed iframe on the
// visitor's device and cannot hold SMTP credentials, so it posts the ticket
// here and the server sends it automatically over the same SMTP connection
// used elsewhere in the app (see lib/mail.ts).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = 20000;

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const to = typeof body?.to === 'string' ? body.to.trim() : '';
  const subject = typeof body?.subject === 'string' ? body.subject.trim() : '';
  const text = typeof body?.text === 'string' ? body.text : '';
  const html = typeof body?.html === 'string' ? body.html : undefined;

  if (!to || !EMAIL_RE.test(to)) {
    return NextResponse.json({ error: 'A valid recipient email is required' }, { status: 400 });
  }
  if (!subject || subject.length > 300) {
    return NextResponse.json({ error: 'Subject is required (max 300 characters)' }, { status: 400 });
  }
  if (!text || text.length > MAX_LEN || (html && html.length > MAX_LEN)) {
    return NextResponse.json({ error: 'Message body is required and must be reasonably sized' }, { status: 400 });
  }

  try {
    await sendEmail({ to, subject, text, html });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('send-ticket failed', error);
    return NextResponse.json({ error: 'Could not send the ticket automatically' }, { status: 502 });
  }
}
