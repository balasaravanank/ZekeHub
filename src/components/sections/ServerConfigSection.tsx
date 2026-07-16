'use client'

import { motion } from 'motion/react'
import { serverConfig } from '@/data/server'
import { useServerStats } from '@/hooks/useServerStats'

function ProgressLine({ percent, label }: { percent: number, label: string }) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <span className="text-xs font-mono text-text-muted uppercase tracking-widest">{label}</span>
        <span className="text-sm font-semibold text-text-primary">{Math.round(percent)}%</span>
      </div>
      <div className="h-1 w-full bg-surface-overlay rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  )
}

function StatBlock({ label, value }: { label: string, value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] sm:text-xs font-mono text-text-muted uppercase tracking-widest mb-1.5">{label}</p>
      <p className="text-sm sm:text-base font-medium text-text-primary">{value}</p>
    </div>
  )
}

export function ServerConfigSection() {
  const { stats, loading } = useServerStats()
  const config = serverConfig

  const osString = stats ? `${stats.os.distro} ${stats.os.release}` : config.os
  const kernelString = stats ? stats.os.kernel : config.kernel
  
  const memPercent = stats ? (stats.mem.used / stats.mem.total) * 100 : 42
  const cpuPercent = stats ? stats.cpu.load : 28

  return (
    <section className="relative py-32 px-6" id="config">
      <div className="max-w-[1100px] mx-auto">
        
        {/* Editorial Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tighter leading-tight mb-4">
              Infrastructure <br />
              <span className="text-text-muted">Overview</span>
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed">
              {loading ? 'Synchronizing core telemetry...' : 'Live hardware diagnostics and system configuration, monitored in real-time.'}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3 px-4 py-2 rounded-full border border-border-subtle bg-surface-overlay/20 backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
            </span>
            <span className="text-xs font-mono font-medium tracking-widest text-text-primary uppercase">Sys Active</span>
          </div>
        </motion.div>

        {/* Editorial Data Grid (Linear-style list) */}
        <div className="border-t border-border-subtle border-opacity-50">
          
          {/* Compute Row */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-10 md:py-14 border-b border-border-subtle border-opacity-50 group hover:bg-surface-raised/20 transition-colors -mx-6 px-6"
          >
            <div className="lg:col-span-3">
              <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest group-hover:text-text-primary transition-colors">Compute</h3>
            </div>
            <div className="lg:col-span-9 flex flex-col md:flex-row justify-between gap-10">
              <div className="flex-1">
                <p className="text-3xl md:text-4xl font-semibold text-text-primary tracking-tight mb-3">
                  {stats ? `${stats.cpu.manufacturer} ${stats.cpu.brand}` : config.cpu}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-text-secondary mb-8">
                  <span>{stats ? stats.os.arch : 'x86_64'} Arch</span>
                  <span className="hidden sm:block w-1 h-1 rounded-full bg-border-default" />
                  <span>38°C Thermal</span>
                  <span className="hidden sm:block w-1 h-1 rounded-full bg-border-default" />
                  <span className="text-accent">
                    Uptime: {stats ? Math.floor(stats.uptime / (3600 * 24)) : 0}d {stats ? Math.floor((stats.uptime % (3600 * 24)) / 3600) : 0}h
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <StatBlock label="Base Clock" value={stats && stats.cpu.speed !== '0' ? `${stats.cpu.speed} GHz` : '3.8 GHz'} />
                  <StatBlock label="Boost Clock" value={stats && stats.cpu.speedMax !== '0' ? `${stats.cpu.speedMax} GHz` : '4.5 GHz'} />
                  <StatBlock label="Threads" value={stats ? `${stats.cpu.cores} Threads` : '8 Threads'} />
                  <StatBlock label="L3 Cache" value={stats && stats.cpu.cache.l3 ? `${stats.cpu.cache.l3 / 1024 / 1024} MB` : '32 MB'} />
                </div>
              </div>
              <div className="w-full md:w-[240px] shrink-0 md:pt-2">
                <ProgressLine percent={cpuPercent} label="Core Load" />
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <StatBlock label="Load Avg (1m)" value={stats ? stats.load.avgLoad.toFixed(2) : '0.42'} />
                  <StatBlock label="Tasks" value={stats ? stats.load.tasks.total.toString() : '128'} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Memory & Storage Row */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-10 md:py-14 border-b border-border-subtle border-opacity-50 group hover:bg-surface-raised/20 transition-colors -mx-6 px-6"
          >
            <div className="lg:col-span-3">
              <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest group-hover:text-text-primary transition-colors">Memory & Storage</h3>
            </div>
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <p className="text-3xl md:text-4xl font-semibold text-text-primary tracking-tight mb-6">
                  {stats ? `${(stats.mem.total / 1024 / 1024 / 1024).toFixed(1)} GB RAM` : config.ram}
                </p>
                <ProgressLine percent={memPercent} label="Volatile Usage" />
                <div className="mt-8 grid grid-cols-3 gap-4">
                  <StatBlock label="Type" value="DDR ECC" />
                  <StatBlock label="Speed" value="High Perf." />
                  <StatBlock label="Swap Use" value={stats ? `${(stats.mem.swapused / 1024 / 1024 / 1024).toFixed(1)} GB` : '0.5 GB'} />
                </div>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-semibold text-text-primary tracking-tight mb-2">
                  {stats ? `${stats.disk.type.toUpperCase()}` : config.storage}
                </p>
                <p className="text-sm font-mono text-text-secondary mb-8">Direct Attached Storage</p>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <StatBlock label="File System" value={stats ? stats.disk.fs : 'ext4 / ZFS'} />
                  <StatBlock label="Read Seq." value="7,400 MB/s" />
                  <StatBlock label="Write Seq." value="6,800 MB/s" />
                  <StatBlock label="IOPS (4K)" value="1.2M / 1.0M" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Networking Row */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-10 md:py-14 border-b border-border-subtle border-opacity-50 group hover:bg-surface-raised/20 transition-colors -mx-6 px-6"
          >
            <div className="lg:col-span-3">
              <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest group-hover:text-text-primary transition-colors">Networking</h3>
            </div>
            <div className="lg:col-span-9 flex flex-col md:flex-row md:items-start justify-between gap-10">
              <div className="flex-1">
                <p className="text-3xl md:text-4xl font-semibold text-text-primary tracking-tight mb-2">
                  {stats && stats.network.ip4 !== '*.*.*.*' ? stats.network.ip4 : config.ip}
                </p>
                <p className="text-sm font-mono text-text-secondary uppercase tracking-widest mb-8">Public IPv4 Allocation</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <StatBlock label="Firewall" value="UFW Active" />
                  <StatBlock label="Rules" value="5 Enforced" />
                  <StatBlock label="Active Conn" value={stats ? `${stats.network.activeConnections} TCP` : '14,204 TCP'} />
                  <StatBlock label="Gateway" value="Default" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-x-12 gap-y-6 shrink-0 md:w-[240px]">
                <StatBlock label="Datacenter Region" value={config.region} />
                <StatBlock label="Peak Bandwidth" value="10 Gbps (Full Duplex)" />
                <StatBlock label="Avg Latency" value={<span className="text-accent">{'<'} 15ms</span>} />
              </div>
            </div>
          </motion.div>

          {/* Environment & Containers Row */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-10 md:py-14 border-b border-border-subtle border-opacity-50 group hover:bg-surface-raised/20 transition-colors -mx-6 px-6"
          >
            <div className="lg:col-span-3">
              <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest group-hover:text-text-primary transition-colors">Environment</h3>
            </div>
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-3">Operating System</p>
                <p className="text-2xl font-semibold text-text-primary tracking-tight mb-1">{osString}</p>
                <p className="text-sm font-mono text-text-secondary mb-8">{kernelString}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <StatBlock label="Proxy Server" value="Nginx v1.24.0" />
                  <StatBlock label="Process Mgr" value="PM2 Daemon" />
                </div>
                
                <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-3">Active Runtimes</p>
                <div className="flex flex-wrap gap-2">
                  {config.runtime.map(rt => (
                    <span key={rt} className="px-3 py-1.5 rounded-full border border-border-default text-xs font-mono text-text-primary bg-surface-overlay/20">
                      {rt}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-3">Container Engine</p>
                <p className="text-2xl font-semibold text-text-primary tracking-tight mb-8">Docker {config.docker.split('·')[0].trim()}</p>
                
                <div className="flex items-center gap-10 mb-8">
                  <div>
                    <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-1">Active</p>
                    <p className="text-3xl font-mono text-accent">{stats ? stats.docker.active : 4}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-1">Total</p>
                    <p className="text-3xl font-mono text-text-primary">{stats ? stats.docker.total : 8}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <StatBlock label="Orchestration" value="Docker Compose" />
                  <StatBlock label="Network Bridge" value="docker0 active" />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
