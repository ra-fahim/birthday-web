import React, { useEffect, useState } from 'react';
import { ExternalLink, MoreVertical, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

export const InAppBrowserGuard: React.FC = () => {
    const [isInAppBrowser, setIsInAppBrowser] = useState(false);

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

        // Patterns for common in-app browsers
        const inAppPatterns = [
            /FBAN/, // Facebook App
            /FBAV/, // Facebook App
            /Instagram/,
            /Line/,
            /Twitter/,
            /LinkedIn/,
            /Messenger/
        ];

        const isDetected = inAppPatterns.some(pattern => pattern.test(userAgent));
        setIsInAppBrowser(isDetected);
    }, []);

    if (!isInAppBrowser) return null;

    return (
        <div className="fixed inset-0 z-[100000] bg-love-bg dark:bg-love-dark-bg flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-love-card dark:bg-love-dark-card p-8 rounded-3xl shadow-2xl border border-love-pink/20"
            >
                <div className="w-16 h-16 bg-love-pink/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Smartphone className="w-8 h-8 text-love-accent dark:text-love-dark-accent" />
                </div>

                <h2 className="font-serif text-2xl mb-4 text-love-text dark:text-love-dark-text">
                    Open in System Browser
                </h2>

                <p className="text-love-text/80 dark:text-love-dark-text/80 mb-8 leading-relaxed">
                    For the best experience (especially the music!), please open this link in your phone's native browser.
                </p>

                <div className="flex flex-col gap-4 items-center text-sm text-love-text/70 dark:text-love-dark-text/70">
                    <div className="flex items-center gap-3 w-full p-4 bg-love-bg/50 dark:bg-love-dark-bg/50 rounded-xl">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-love-accent text-white font-bold text-xs shrink-0">1</span>
                        <span className="text-left flex-1">Tap the <MoreVertical className="w-4 h-4 inline mx-1" /> menu icon usually in the top right</span>
                    </div>

                    <div className="flex items-center gap-3 w-full p-4 bg-love-bg/50 dark:bg-love-dark-bg/50 rounded-xl">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-love-accent text-white font-bold text-xs shrink-0">2</span>
                        <span className="text-left flex-1">Select <span className="font-semibold inline-flex items-center gap-1"><ExternalLink className="w-3 h-3" /> Open in Chrome/Safari</span></span>
                    </div>
                </div>

                <button
                    onClick={() => setIsInAppBrowser(false)}
                    className="mt-8 text-xs text-love-text/50 underline hover:text-love-text/80"
                >
                    Continue anyway (Experience might be limited)
                </button>
            </motion.div>
        </div>
    );
};
