'use client'

import { motion } from 'motion/react'
import { Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="max-w-[700px] mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="text-xs text-text-dim font-mono">
            © {new Date().getFullYear()} ZekeHub — self-hosted with{' '}
            <Heart className="w-3 h-3 inline text-accent" strokeWidth={2} fill="currentColor" />
          </p>
          <p className="text-xs text-text-dim font-mono">
            React · Tailwind · Motion
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
