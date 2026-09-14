// Reads the site-owner-configured ticket settings from the `config` query
// param the platform injects when this template is rendered inside the
// Studio/site iframe (see ExperienceTemplates.tsx -> MasterProposalTemplate).
// Falls back to the original template's own defaults when no config is
// present (e.g. when the template is opened directly).

export interface TicketConfig {
  recipientEmail: string;
  toName: string;
  fromName: string;
  fromLabel: string;
}

export const DEFAULT_TICKET_CONFIG: TicketConfig = {
  recipientEmail: 'rabbiahmedfahim44@gmail.com',
  toName: 'Rodney (The Best Boyfriend)',
  fromName: 'Sherry (Your Valentine)',
  fromLabel: 'Sherry',
};

let cached: TicketConfig | null = null;

export function getTicketConfig(): TicketConfig {
  if (cached) return cached;
  cached = { ...DEFAULT_TICKET_CONFIG };
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('config');
    if (raw) {
      const parsed = JSON.parse(raw);
      cached = {
        recipientEmail: typeof parsed.recipientEmail === 'string' && parsed.recipientEmail.trim() ? parsed.recipientEmail.trim() : cached.recipientEmail,
        toName: typeof parsed.toName === 'string' && parsed.toName.trim() ? parsed.toName : cached.toName,
        fromName: typeof parsed.fromName === 'string' && parsed.fromName.trim() ? parsed.fromName : cached.fromName,
        fromLabel: typeof parsed.fromLabel === 'string' && parsed.fromLabel.trim() ? parsed.fromLabel : cached.fromLabel,
      };
    }
  } catch {
    // ignore malformed config, keep defaults
  }
  return cached;
}
