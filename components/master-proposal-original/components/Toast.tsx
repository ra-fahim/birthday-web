import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Music, X, AlertCircle } from 'lucide-react';

export interface ToastProps {
    message: string;
    type?: 'success' | 'info' | 'error';
    duration?: number;
    onClose: () => void;
    isVisible: boolean;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'success',
    duration = 3000,
    onClose,
    isVisible
}) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    const config = {
        success: {
            icon: <CheckCircle className="w-5 h-5" />,
            // Enterprise emerald - high contrast in both modes
            lightBg: 'bg-emerald-50',
            darkBg: 'dark:bg-emerald-950',
            lightText: 'text-emerald-900',
            darkText: 'dark:text-emerald-50',
            lightBorder: 'border-emerald-200',
            darkBorder: 'dark:border-emerald-800',
            lightIcon: 'text-emerald-600',
            darkIcon: 'dark:text-emerald-400'
        },
        info: {
            icon: <Music className="w-5 h-5" />,
            // Enterprise indigo - professional and vibrant
            lightBg: 'bg-indigo-50',
            darkBg: 'dark:bg-indigo-950',
            lightText: 'text-indigo-900',
            darkText: 'dark:text-indigo-50',
            lightBorder: 'border-indigo-200',
            darkBorder: 'dark:border-indigo-800',
            lightIcon: 'text-indigo-600',
            darkIcon: 'dark:text-indigo-400'
        },
        error: {
            icon: <AlertCircle className="w-5 h-5" />,
            // Enterprise red - clear error indication
            lightBg: 'bg-red-50',
            darkBg: 'dark:bg-red-950',
            lightText: 'text-red-900',
            darkText: 'dark:text-red-50',
            lightBorder: 'border-red-200',
            darkBorder: 'dark:border-red-800',
            lightIcon: 'text-red-600',
            darkIcon: 'dark:text-red-400'
        }
    };

    const currentConfig = config[type];

    return createPortal(
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fixed top-6 left-0 w-full flex justify-center z-[99999] pointer-events-none"
                >
                    <div className="pointer-events-auto w-[90vw] sm:w-auto max-w-md">
                        <div className={`
            ${currentConfig.lightBg} ${currentConfig.darkBg}
            ${currentConfig.lightText} ${currentConfig.darkText}
            px-6 py-4 rounded-xl shadow-2xl
            border-2 ${currentConfig.lightBorder} ${currentConfig.darkBorder}
            flex items-center gap-3 min-w-[320px] max-w-md
          `}>
                            <div className={`shrink-0 ${currentConfig.lightIcon} ${currentConfig.darkIcon}`}>
                                {currentConfig.icon}
                            </div>
                            <p className="flex-1 font-medium text-sm leading-relaxed">
                                {message}
                            </p>
                            <button
                                onClick={onClose}
                                className={`
                shrink-0 p-1 rounded-full transition-colors
                ${currentConfig.lightText} ${currentConfig.darkText}
                hover:bg-black/10 dark:hover:bg-white/10
              `}
                                aria-label="Close notification"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};
