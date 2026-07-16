'use client'

import { motion } from 'motion/react'
import { Server, ChevronDown, Activity, Cpu, Network, ShieldCheck } from 'lucide-react'
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
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden py-24" id="hero">
      {/* Background effects - kept minimal and flat */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      <div className="relative max-w-[1100px] w-full mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center z-10">
        {/* Left Column: Text and CTA */}
        <div className="text-left space-y-8 flex flex-col items-start pt-12 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-border-default bg-surface-overlay/20"
          >
            <span className={`w-2 h-2 rounded-full ${stats || loading ? 'bg-accent animate-pulse' : 'bg-danger'}`} />
            <span className="text-[11px] font-mono text-text-primary uppercase tracking-widest font-medium mt-0.5">
              {stats || loading ? 'System Online' : 'System Offline'}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-text-primary tracking-tighter leading-[1.05]"
          >
            Command<br />
            Center for<br />
            <span className="text-text-muted">
              ZekeHub
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
            className="text-lg text-text-secondary max-w-[42ch] leading-relaxed"
          >
            Your personal, self-hosted infrastructure. Running 24/7 with zero downtime, absolute control, and extreme performance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            <a href="#config" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[var(--radius-button)] bg-text-primary text-surface-base font-semibold text-sm hover:opacity-90 transition-opacity duration-200 active:scale-[0.98]">
              <Activity className="w-4 h-4" />
              View Telemetry
            </a>
            <a href="#creator" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[var(--radius-button)] bg-surface-overlay text-text-primary font-medium text-sm border border-border-default hover:border-border-accent transition-all duration-200 active:scale-[0.98]">
              About Creator
            </a>
          </motion.div>
        </div>

        {/* Right Column: Structural Status Readout */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.3 }}
          className="w-full flex flex-col justify-center lg:justify-end mt-12 lg:mt-0"
        >
          <div className="w-full max-w-[460px] ml-auto border-t border-border-subtle border-opacity-50">
            
            {/* Uptime Row */}
            <div className="py-8 border-b border-border-subtle border-opacity-50 flex items-start justify-between group hover:bg-surface-raised/20 transition-colors -mx-6 px-6">
              <div>
                <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Server className="w-3.5 h-3.5" strokeWidth={1.5} /> System Uptime
                </p>
                <p className="text-3xl font-semibold text-text-primary tracking-tight">
                  {stats ? formatUptime(stats.uptime) : loading ? 'Connecting...' : 'Error'}
                </p>
              </div>
            </div>

            {/* Core Compute Row */}
            <div className="py-8 border-b border-border-subtle border-opacity-50 flex items-start justify-between group hover:bg-surface-raised/20 transition-colors -mx-6 px-6">
              <div className="w-full">
                <div className="flex justify-between items-end mb-4">
                  <p className="text-xs font-mono text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5" strokeWidth={1.5} /> Core Compute
                  </p>
                  <span className="text-sm font-semibold text-text-primary">{stats ? Math.round(stats.cpu.load) : 0}%</span>
                </div>
                <div className="h-1 w-full bg-surface-overlay rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${stats ? stats.cpu.load : 0}%` }}
                    transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                  />
                </div>
              </div>
            </div>

            {/* Network & Security Row */}
            <div className="py-8 border-b border-border-subtle border-opacity-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:bg-surface-raised/20 transition-colors -mx-6 px-6">
              
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Network className="w-3.5 h-3.5 text-text-muted" strokeWidth={1.5} />
                  <p className="text-xs font-mono text-text-muted uppercase tracking-widest">Network Line</p>
                </div>
                <p className="text-sm font-medium text-text-primary flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Active Uplink
                </p>
              </div>

              <div className="sm:border-l sm:border-border-subtle sm:pl-8">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-text-muted" strokeWidth={1.5} />
                  <p className="text-xs font-mono text-text-muted uppercase tracking-widest">Security</p>
                </div>
                <p className="text-sm font-medium text-text-primary">
                  E2E Encrypted Protocol
                </p>
              </div>

            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.a
          href="#config"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 group cursor-pointer"
        >
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted group-hover:text-text-primary transition-colors">Scroll</span>
          <ChevronDown className="w-5 h-5 text-text-muted group-hover:text-text-primary transition-colors" strokeWidth={1.5} />
        </motion.a>
      </motion.div>
    </section>
  )
}
