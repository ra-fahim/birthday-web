# Wedding Proposal – audio option + new defaults

- Click "🎧 Best experienced with sound on" (Intro hint) in the editor -> the panel now has
  Background audio: upload a file or paste a URL, preview it, or go back to the default music.
  The chosen audio (content.proposalAudioUrl) loops after the receiver taps Begin; the 🔊 button mutes it.
  Empty = the built-in synthesized music (unchanged).
- New Wedding Proposal sites and "Reset" now start with receiver "Anarkoli" and sender "Salim"
  (lib/types.ts -> weddingProposalDefaults). Existing drafts keep their own names until Reset.
