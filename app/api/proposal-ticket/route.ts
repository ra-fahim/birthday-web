import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function clean(v: unknown, max = 2000) {
  return String(v ?? '').trim().slice(0, max);
}

function escapeHtml(v: string) {
  return v.replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char] || char));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const to = clean(body.to, 320);
    if (!/^\S+@\S+\.\S+$/.test(to) || /[\r\n]/.test(to)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });

    const recipient = clean(body.recipient, 200) || 'My Dearest';
    const sender = clean(body.sender, 200) || 'Someone who loves you';
    const dateTitle = clean(body.dateTitle, 300) || 'Our Date';
    const dateDetails = clean(body.dateDetails, 1200);
    const budget = clean(body.budget, 100);
    const time = clean(body.time, 200);
    const siteName = clean(body.siteName, 300) || `${recipient} — Master proposal`;
    const ticketId = `MP-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
    const issued = new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });

    const text = [
      'MASTER PROPOSAL — DATE TICKET',
      '--------------------------------',
      `Ticket ID: ${ticketId}`,
      `Issued: ${issued}`,
      `To: ${recipient}`,
      `From: ${sender}`,
      '',
      `Date: ${dateTitle}`,
      `Details: ${dateDetails}`,
      `Budget: ${budget}`,
      `Time: ${time}`,
      '',
      'This ticket was generated automatically by Birthday Builder.',
      `Experience: ${siteName}`,
    ].join('\n');

    await sendEmail({
      to,
      subject: `Your Master Proposal Date Ticket — ${dateTitle}`,
      text,
      html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;padding:32px;border:1px solid #eee;border-radius:20px"><div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#c08081">Master Proposal</div><h1 style="font-weight:400">Date Ticket</h1><p><b>Ticket ID:</b> ${escapeHtml(ticketId)}</p><p><b>To:</b> ${escapeHtml(recipient)}<br><b>From:</b> ${escapeHtml(sender)}</p><hr><h2 style="font-weight:400">${escapeHtml(dateTitle)}</h2><p>${escapeHtml(dateDetails)}</p><p><b>Budget:</b> ${escapeHtml(budget)}<br><b>Time:</b> ${escapeHtml(time)}</p><p style="font-size:12px;color:#777">This ticket was sent automatically through Birthday Builder SMTP.</p></div>`,
    });

    return NextResponse.json({ ok: true, ticketId });
  } catch (error) {
    console.error('proposal ticket email failed', error);
    return NextResponse.json({ error: 'Ticket email could not be sent. Please check the SMTP configuration.' }, { status: 500 });
  }
}
