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

import { getSiteConfig } from './siteConfig';

let cached: TicketConfig | null = null;

export function getTicketConfig(): TicketConfig {
  if (cached) return cached;
  const parsed = getSiteConfig();
  cached = {
    recipientEmail: parsed.recipientEmail?.trim() || DEFAULT_TICKET_CONFIG.recipientEmail,
    toName: parsed.toName?.trim() || DEFAULT_TICKET_CONFIG.toName,
    fromName: parsed.fromName?.trim() || DEFAULT_TICKET_CONFIG.fromName,
    fromLabel: parsed.fromLabel?.trim() || DEFAULT_TICKET_CONFIG.fromLabel,
  };
  return cached;
}
