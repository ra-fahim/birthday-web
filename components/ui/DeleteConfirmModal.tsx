'use client';
import { useEffect, useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({
  label = 'Delete',
  title = 'Delete this website?',
  description = 'This action permanently removes the website and its uploaded media.',
  confirmText = 'Delete permanently',
  onConfirm,
}: {
  label?: string;
  title?: string;
  description?: string;
  confirmText?: string;
  onConfirm: () => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = previousOverflow; };
  }, [open, busy]);

  async function confirm() {
    setBusy(true); setError('');
    try { await onConfirm(); setOpen(false); }
    catch (e: any) { setError(e?.message || 'Something went wrong.'); }
    finally { setBusy(false); }
  }

  return <>
    <button type="button" className="studio-danger-btn" onClick={() => setOpen(true)}><Trash2 size={14}/> {label}</button>
    {open && <div className="confirm-backdrop" role="presentation" onClick={(e) => { if (!busy && e.target === e.currentTarget) setOpen(false); }}>
      <div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description">
        <button className="confirm-close" type="button" aria-label="Close" onClick={() => !busy && setOpen(false)}><X size={17}/></button>
        <div className="confirm-icon"><AlertTriangle size={22}/></div>
        <h2 id="delete-title">{title}</h2>
        <p id="delete-description">{description}</p>
        <div className="confirm-warning">Photos, videos, music, gallery records and other media linked to this website will also be removed.</div>
        {error && <div className="confirm-error">{error}</div>}
        <div className="confirm-actions">
          <button type="button" className="confirm-cancel" disabled={busy} onClick={() => setOpen(false)}>Cancel</button>
          <button type="button" className="confirm-delete" disabled={busy} onClick={confirm}>{busy ? 'Deleting…' : confirmText}</button>
        </div>
      </div>
    </div>}
  </>;
}
