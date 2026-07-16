'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, CloudLightning } from 'lucide-react'

export function WorkshopPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasVoted, setHasVoted] = useState(true) // Default true to prevent flash

  useEffect(() => {
    const voted = localStorage.getItem('zekehub_survey_voted')
    if (!voted) {
      setHasVoted(false)
    }

    const handleScroll = () => {
      // Trigger when scrolling past the config section (roughly 1200px deep)
      // or we can just use a simple threshold
      if (window.scrollY > 800 && !hasVoted) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasVoted])

  const handleVote = async (vote: 'yes' | 'no') => {
    try {
      await fetch('/api/pulse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote }),
      })
      localStorage.setItem('zekehub_survey_voted', 'true')
      setHasVoted(true)
      setIsVisible(false)
    } catch (err) {
      console.error('Failed to vote', err)
    }
  }

  return (
    <AnimatePresence>
      {isVisible && !hasVoted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-surface-base/80 backdrop-blur-xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="relative w-full max-w-3xl p-10 md:p-16 glass border-accent/30 rounded-3xl shadow-2xl bg-surface-overlay border-t-accent/40"
          >
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-6 right-6 text-text-muted hover:text-text-primary transition-colors p-2"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-20 h-20 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-8 shadow-[inset_0_0_30px_rgba(16,185,129,0.15)]">
                <CloudLightning className="w-10 h-10 text-accent" strokeWidth={1.5} />
              </div>
              
              <h4 className="text-sm font-mono text-text-primary font-bold uppercase tracking-widest mb-4">DevOps & Cloud Computing Initiative</h4>
              
              <p className="text-3xl md:text-5xl font-bold text-text-primary leading-[1.15] tracking-tight max-w-[20ch]">
                Are you ready for exclusive workshops from <br />
                <span className="text-accent inline-block mt-3 bg-accent/10 px-4 py-2 rounded-xl border border-accent/20">AWS SBG @SEC</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <button
                onClick={() => handleVote('yes')}
                className="flex-1 py-4 px-8 rounded-[var(--radius-button)] bg-accent text-surface-base font-bold text-lg hover:bg-accent-hover transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                Yes, I'm Ready
              </button>
              <button
                onClick={() => handleVote('no')}
                className="flex-1 py-4 px-8 rounded-[var(--radius-button)] bg-surface-base border border-border-subtle text-text-primary font-medium text-lg hover:bg-surface-raised transition-all active:scale-[0.98]"
              >
                No, Thanks
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
