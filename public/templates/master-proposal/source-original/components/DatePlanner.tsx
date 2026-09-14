import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Map, BookOpen, Send, Ticket, Heart, Clock, Sparkles, Palette, Coffee, Building2, Feather, Gamepad2, Loader2 } from 'lucide-react';
import { Toast } from './Toast';
import { getTicketConfig } from '../utils/ticketConfig';

interface DateOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  planTitle: string;
  planDescription: string;
  budget: string;
  isSpecial?: boolean;
}

// Student & Budget Friendly Options
const DATE_OPTIONS: DateOption[] = [
  {
    id: 'massage',
    label: 'Massage & Class',
    icon: <Feather className="w-6 h-6" />,
    planTitle: "The Stress Melter",
    planDescription: "Multitasking at its finest. While you attend your online class, I'll be your personal masseur. I'll give you a full body massage to help you relax and recharge before you have to clock in at 5 PM.",
    budget: "Free"
  },
  {
    id: 'preshift',
    label: 'Pre-Work Recharge',
    icon: <Coffee className="w-6 h-6" />,
    planTitle: "The 30-Minute Power Date",
    planDescription: "I know you're busy between class and work. I'll meet you right in that gap. I'll bring you food/coffee, we'll sit for a bit, and I'll hype you up before your 5 PM shift starts.",
    budget: "$"
  },
  {
    id: 'color',
    label: 'Color Challenge',
    icon: <Palette className="w-6 h-6" />,
    planTitle: "The Color Snack Challenge",
    planDescription: "We pick a random color (Pink? Blue? Red?) and head to the nearest convenience store. We can only buy and eat snacks/drinks that match that color!",
    budget: "$$"
  },
  {
    id: 'arcade',
    label: 'Arcade & Ice Cream',
    icon: <Gamepad2 className="w-6 h-6" />,
    planTitle: "Retro Arcade Duel",
    planDescription: "We hit the arcade. Air hockey, basketball, and crane games. Loser buys the winner ice cream afterwards (but let's be honest, I'll buy it anyway).",
    budget: "$$"
  },
  {
    id: 'movie',
    label: 'Laptop Cinema',
    icon: <Ticket className="w-6 h-6" />,
    planTitle: "Dorm/Room Movie Night",
    planDescription: "I'll bring the popcorn and snacks. We build a blanket nest and watch that movie you've been wanting to see on your laptop.",
    budget: "$"
  },
  {
    id: 'study',
    label: 'Study & Sip',
    icon: <BookOpen className="w-6 h-6" />,
    planTitle: "Coffee Shop Focus Date",
    planDescription: "We'll find a quiet corner at a cute cafe. I'll buy the coffee/boba, you bring the notes. 50% studying, 50% holding hands under the table.",
    budget: "$"
  },
  // VIP Option: Capital Town Date
  {
    id: 'capitaltown',
    label: 'Capital Town',
    icon: <Building2 className="w-6 h-6" />,
    planTitle: "Capital Town Anniversary Redo",
    planDescription: "We missed going here for our anniversary, but we're making up for it now. Let's finally have that date at Capital Town Pampanga. We'll walk around, grab food, and enjoy the vibe before your schedule gets busy.",
    budget: "$$",
    isSpecial: true
  }
];

export const DatePlanner: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('Afternoon (Before Work)');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isSending, setIsSending] = useState(false);

  const selectedOption = DATE_OPTIONS.find(opt => opt.id === selected);

  const handleSendTicket = async () => {
    if (!selectedOption || isSending) return;
    setIsSending(true);

    const config = getTicketConfig();
    const recipient = config.recipientEmail;
    const subject = `Date Ticket: ${selectedOption.planTitle}`;

    // Straightforward, modern ticket design
    const ticketBody = `
🎫  OFFICIAL DATE TICKET
----------------------------------------

📅  DATE ISSUED: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
🎟️  TICKET ID:   #${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}

----------------------------------------

👤  TO:   ${config.toName}
👤  FROM: ${config.fromName}

----------------------------------------

📍  EVENT
${selectedOption.planTitle}

📝  DETAILS
${selectedOption.planDescription}

🕐  TIME
${selectedTime}

💰  BUDGET
${selectedOption.isSpecial ? 'Extra Special ✨' : selectedOption.budget}

----------------------------------------

✅  ADMISSION INCLUDES:
• One Couple (VIP Access)
• Unlimited Hugs & Kisses
• 100% Quality Time

----------------------------------------

💳  PAYMENT: Paid in Full with Love ❤️

Reply to confirm! 💌

Love always,
${config.fromLabel}
    `;

    const htmlBody = `<pre style="font-family:ui-monospace,monospace;white-space:pre-wrap;font-size:14px;line-height:1.5;">${ticketBody
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')}</pre>`;

    try {
      const res = await fetch('/api/send-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: recipient, subject, text: ticketBody, html: htmlBody }),
      });
      if (!res.ok) throw new Error('send failed');
      setToastType('success');
      setToastMessage(`Date ticket sent! "${selectedOption.planTitle}" is on its way to ${config.toName.split(' (')[0]}!`);
      setShowToast(true);
    } catch {
      // Automatic delivery failed (e.g. no SMTP configured yet) — fall back to
      // the visitor's own mail app so the ticket is never silently lost.
      const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(ticketBody)}`;
      window.location.href = mailtoUrl;
      setToastType('error');
      setToastMessage('Auto-send is unavailable right now, opening your mail app instead.');
      setShowToast(true);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto text-center px-4">
      <div className="mb-12">
        <h2 className="font-serif text-3xl md:text-5xl mb-4 text-love-text dark:text-love-dark-text">
          Let's Plan Our Date Together
        </h2>
        <p className="text-love-accent dark:text-love-dark-accent/80 mb-2">
          Pick what your heart desires.
        </p>
      </div>

      {/* Grid Layout: 6 Regular options (3 columns x 2 rows on desktop) + 1 Special (Full width) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {DATE_OPTIONS.map((option) => (
          <motion.button
            key={option.id}
            onClick={() => setSelected(option.id)}
            className={`
              relative p-6 rounded-xl border transition-all duration-300
              flex flex-col items-center gap-3 group
              ${option.isSpecial
                ? 'col-span-1 sm:col-span-2 lg:col-span-3 border-amber-400/50 bg-amber-50/50 dark:bg-amber-900/10 dark:border-amber-500/30'
                : selected === option.id
                  ? 'border-love-accent bg-love-accent/5 dark:bg-love-dark-accent/10 shadow-lg scale-[1.02]'
                  : 'border-love-accent/20 bg-white/40 dark:bg-love-dark-card/30 hover:border-love-accent/50 dark:hover:border-love-dark-accent/50 backdrop-blur-sm'}
            `}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            animate={option.isSpecial ? {
              boxShadow: ["0px 0px 0px rgba(251, 191, 36, 0)", "0px 0px 15px rgba(251, 191, 36, 0.3)", "0px 0px 0px rgba(251, 191, 36, 0)"],
            } : {}}
            transition={option.isSpecial ? { duration: 2, repeat: Infinity } : {}}
          >
            {option.isSpecial && (
              <div className="absolute top-3 right-3 text-amber-500 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div className={`
              p-3 rounded-full transition-colors duration-300
              ${option.isSpecial
                ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400'
                : selected === option.id
                  ? 'bg-love-accent text-white dark:bg-love-dark-accent dark:text-love-dark-bg'
                  : 'bg-love-accent/10 text-love-accent dark:bg-love-dark-accent/10 dark:text-love-dark-accent group-hover:bg-love-accent group-hover:text-white'}
            `}>
              {option.icon}
            </div>
            <div className="flex flex-col">
              <span className={`font-serif text-lg leading-tight ${option.isSpecial ? 'font-bold text-amber-800 dark:text-amber-200' : 'text-love-text dark:text-love-dark-text'}`}>
                {option.label}
              </span>
              <span className="text-xs uppercase tracking-wider text-love-accent/60 dark:text-love-dark-accent/60 mt-2">
                {option.isSpecial ? 'Extra Special' : `Budget: ${option.budget}`}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="min-h-[450px] flex justify-center items-start">
        <AnimatePresence mode="wait">
          {selectedOption ? (
            <motion.div
              key="ticket"
              initial={{ opacity: 0, rotateX: -90, y: -20 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, rotateX: 90, y: 20 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative w-full max-w-md mx-auto"
            >
              {/* Ticket UI */}
              <div className={`
                 rounded-xl overflow-hidden shadow-2xl border-2 border-dashed relative z-10
                 ${selectedOption.isSpecial
                  ? 'bg-amber-50 dark:bg-[#1a1500] border-amber-400 dark:border-amber-600'
                  : 'bg-love-card dark:bg-love-dark-card border-love-accent/30 dark:border-love-dark-accent/30'}
              `}>
                {/* Header Strip */}
                <div className={`
                  p-4 text-white flex justify-between items-center
                  ${selectedOption.isSpecial ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-love-accent dark:bg-love-dark-accent dark:text-love-dark-bg'}
                `}>
                  <span className="text-xs font-bold tracking-[0.2em] uppercase">Admit One</span>
                  <Heart className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase">{selectedOption.isSpecial ? 'VIP Date' : 'Date Night'}</span>
                </div>

                {/* Content */}
                <div className="p-8 text-center relative">
                  {/* Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <Heart className="w-48 h-48" />
                  </div>

                  <h3 className="font-serif text-2xl md:text-3xl text-love-text dark:text-love-dark-text mb-4">
                    {selectedOption.planTitle}
                  </h3>
                  <p className="text-sm md:text-base text-love-text/70 dark:text-love-dark-text/70 leading-relaxed mb-6">
                    {selectedOption.planDescription}
                  </p>

                  {/* Time Selector */}
                  <div className="mb-6 p-4 bg-love-bg dark:bg-black/20 rounded-lg border border-love-accent/10 dark:border-love-dark-accent/10">
                    <div className="flex items-center justify-center gap-2 mb-2 text-love-accent dark:text-love-dark-accent">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Select Time</span>
                    </div>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full bg-white dark:bg-love-dark-card border border-love-accent/20 dark:border-love-dark-accent/20 rounded px-3 py-2 text-sm text-love-text dark:text-love-dark-text focus:outline-none focus:ring-1 focus:ring-love-accent"
                    >
                      <option value="Online Class (Before 5 PM)">During Online Class (Before 5 PM)</option>
                      <option value="Morning (10:00 AM - 12:00 PM)">Morning (10 AM - 12 PM)</option>
                      <option value="Lunch Break (12:00 PM - 2:00 PM)">Lunch Break (12 PM - 2 PM)</option>
                      <option value="Early Afternoon (2:00 PM - 4:00 PM)">Early Afternoon (2 PM - 4 PM)</option>
                      <option value="After Work (After 5:00 PM)">After Work (Post 5 PM)</option>
                      <option value="Weekend (All Day)">Weekend (All Day)</option>
                    </select>
                    {selectedTime.includes("Morning") || selectedTime.includes("Afternoon") || selectedTime.includes("Lunch") || selectedTime.includes("Class") ? (
                      <p className="mt-2 text-[10px] text-love-accent dark:text-love-dark-accent">
                        *Will ensure you're ready for work by 5:00 PM
                      </p>
                    ) : null}
                  </div>

                  <div className="w-full h-px bg-love-accent/20 dark:bg-love-dark-accent/20 mb-6" />

                  {/* Action Button */}
                  <motion.button
                    onClick={handleSendTicket}
                    disabled={isSending}
                    className={`
                      w-full py-4 rounded-lg flex items-center justify-center gap-3 font-medium uppercase tracking-widest text-xs transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed
                      ${selectedOption.isSpecial
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-love-text dark:bg-love-dark-text text-white dark:text-love-dark-bg hover:bg-love-accent dark:hover:bg-love-dark-accent'}
                    `}
                    whileHover={{ scale: isSending ? 1 : 1.02 }}
                    whileTap={{ scale: isSending ? 1 : 0.98 }}
                  >
                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {isSending ? 'Sending…' : 'Send Ticket'}
                  </motion.button>

                  <p className="mt-4 text-[10px] text-love-text/40 dark:text-love-dark-text/40 uppercase">
                    {selectedOption.isSpecial ? 'One Time Special Offer' : 'Valid for 1 Romantic Date'}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-love-text/30 dark:text-love-dark-text/30"
            >
              <Ticket className="w-16 h-16 mb-4 opacity-50" strokeWidth={1} />
              <p className="text-sm uppercase tracking-widest">Select an option above</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        duration={4000}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};