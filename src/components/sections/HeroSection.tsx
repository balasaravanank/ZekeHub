'use client'

import { motion } from 'motion/react'
import { Server, ChevronDown } from 'lucide-react'
import { useServerStats } from '@/hooks/useServerStats'

function formatUptime(seconds: number) {
  const days = Math.floor(seconds / (3600 * 24))
  const hours = Math.floor((seconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${days}d ${hours}h ${minutes}m`
}

export function HeroSection() {
  const { stats, loading } = useServerStats()

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden" id="hero">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute inset-0 bg-radial-glow" />

      {/* Top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="relative max-w-[900px] mx-auto px-6 text-center">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 16 }}
          className="mx-auto mb-8 w-20 h-20 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center"
        >
          <Server className="w-10 h-10 text-accent" strokeWidth={1.5} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold text-text-primary tracking-tighter leading-[1.05] mb-4"
        >
          {stats?.os?.hostname || 'Zeke'}<span className="text-accent">Hub</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
          className="text-base md:text-lg text-text-secondary max-w-[45ch] mx-auto leading-relaxed mb-8"
        >
          A personal server running 24/7. Self-hosted, self-managed, always online.
        </motion.p>

        {/* Uptime badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-badge glass"
        >
          <span className={`w-2 h-2 rounded-full ${stats || loading ? 'bg-accent status-pulse' : 'bg-danger'}`} />
          <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
            {stats || loading ? 'Online' : 'Offline'}
          </span>
          <span className="w-px h-4 bg-border-subtle" />
          <span className="text-xs font-mono text-accent tracking-wide">
            {stats ? formatUptime(stats.uptime) : loading ? 'Connecting...' : 'Error'}
          </span>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5 text-text-dim" strokeWidth={1.5} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
