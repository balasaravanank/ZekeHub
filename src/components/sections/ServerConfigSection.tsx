'use client'

import { motion } from 'motion/react'
import {
  Monitor, Cpu, HardDrive, MemoryStick,
  Container, MapPin, Network, Terminal,
} from 'lucide-react'
import { serverConfig } from '@/data/server'
import { useServerStats } from '@/hooks/useServerStats'
import { GlassCard } from '@/components/ui/GlassCard'

interface ConfigRowProps {
  icon: React.ElementType
  label: string
  value: string | React.ReactNode
  delay: number
}

function ConfigRow({ icon: Icon, label, value, delay }: ConfigRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 120, damping: 18, delay }}
      className="flex items-center gap-4 py-3.5 border-b border-border-subtle last:border-0"
    >
      <div className="w-9 h-9 rounded-lg bg-surface-overlay flex items-center justify-center shrink-0 border border-border-subtle">
        <Icon className="w-4 h-4 text-accent" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-text-muted uppercase tracking-wider font-mono mb-0.5">{label}</p>
        <div className="text-sm text-text-primary font-medium">{value}</div>
      </div>
    </motion.div>
  )
}

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="flex items-center gap-3 mt-1">
      <div className="flex-1 h-1.5 bg-surface-overlay rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>
      <span className="text-xs font-mono text-text-muted w-8">{Math.round(percent)}%</span>
    </div>
  )
}

export function ServerConfigSection() {
  const { stats, loading } = useServerStats()
  const config = serverConfig

  // Fallback to static config if API is loading or fails
  const osString = stats ? `${stats.os.distro} ${stats.os.release} · ${stats.os.kernel}` : `${config.os} · ${config.kernel}`
  
  const memPercent = stats ? (stats.mem.used / stats.mem.total) * 100 : 0
  const memValue = stats 
    ? <ProgressBar percent={memPercent} />
    : config.ram

  const cpuValue = stats
    ? <ProgressBar percent={stats.cpu.load} />
    : config.cpu

  const dockerValue = stats
    ? `${stats.docker.active} running / ${stats.docker.total} total`
    : config.docker

  const rows = [
    { icon: Monitor, label: 'Hostname', value: stats?.os?.hostname || config.hostname },
    { icon: Terminal, label: 'Operating System', value: osString },
    { icon: Cpu, label: 'CPU Load', value: cpuValue },
    { icon: MemoryStick, label: 'Memory Usage', value: memValue },
    { icon: HardDrive, label: 'Storage', value: config.storage },
    { icon: Container, label: 'Docker Containers', value: dockerValue },
    { icon: MapPin, label: 'Region', value: config.region },
    { icon: Network, label: 'Public IP', value: config.ip },
  ]

  return (
    <section className="relative py-24 px-6" id="config">
      <div className="max-w-[700px] mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight mb-2">
            Server Configuration
          </h2>
          <p className="text-sm text-text-secondary max-w-[40ch] mx-auto">
            {loading ? 'Fetching real-time metrics...' : 'Live hardware telemetry and specs.'}
          </p>
        </motion.div>

        {/* Config card */}
        <GlassCard hover={false} className="p-6 md:p-8">
          {rows.map((row, i) => (
            <ConfigRow
              key={row.label}
              icon={row.icon}
              label={row.label}
              value={row.value}
              delay={i * 0.04}
            />
          ))}

          {/* Runtimes */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.35 }}
            className="pt-3.5"
          >
            <p className="text-xs text-text-muted uppercase tracking-wider font-mono mb-3">Runtimes</p>
            <div className="flex flex-wrap gap-2">
              {config.runtime.map((rt) => (
                <span
                  key={rt}
                  className="inline-flex items-center px-3 py-1 rounded-badge bg-accent-muted text-accent text-xs font-mono font-medium"
                >
                  {rt}
                </span>
              ))}
            </div>
          </motion.div>
        </GlassCard>
      </div>
    </section>
  )
}
