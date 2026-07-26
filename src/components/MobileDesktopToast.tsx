import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Monitor, X } from 'lucide-react';

export default function MobileDesktopToast() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if device is mobile and toast hasn't been dismissed in this session
    const isMobile = window.innerWidth < 768;
    const hasDismissed = sessionStorage.getItem('mobile_desktop_toast_dismissed');

    if (isMobile && !hasDismissed) {
      // Small delay for smooth entry
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      // Auto dismiss after 6 seconds + 1s delay = 7s
      const autoDismiss = setTimeout(() => {
        handleDismiss();
      }, 7000);

      return () => {
        clearTimeout(timer);
        clearTimeout(autoDismiss);
      };
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('mobile_desktop_toast_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-4 right-4 z-[9999] md:hidden"
        >
          <div className="bg-black/95 border border-neon-cyan/40 rounded p-4 flex items-start gap-3 relative backdrop-blur-md shadow-[0_0_20px_rgba(0,255,255,0.15)]">
            <div className="flex-shrink-0 mt-0.5">
              <Monitor className="w-5 h-5 text-neon-cyan" />
            </div>
            <div className="flex-1 pr-6">
              <p className="text-xs text-gray-300 font-sans leading-relaxed">
                <strong className="text-white block mb-1">Desktop Recommended</strong>
                For the best interactive VDC dashboard & computational pipeline experience, viewing on a desktop or laptop is recommended.
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-cyan rounded-l" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
