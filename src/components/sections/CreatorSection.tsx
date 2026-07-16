'use client'

import { motion } from 'motion/react'
import { Code2, Globe, Mail, Fingerprint } from 'lucide-react'
import { creator } from '@/data/server'
import { GlassCard } from '@/components/ui/GlassCard'

const iconMap: Record<string, React.ElementType> = {
  Code2,
  Globe,
  Mail,
}

export function CreatorSection() {
  return (
    <section className="relative py-24 px-6 z-10" id="creator">
      <div className="max-w-[800px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="flex items-center gap-4 mb-8"
        >
          <Fingerprint className="w-6 h-6 text-accent" strokeWidth={1.5} />
          <h2 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">
            System Architect
          </h2>
          <div className="flex-1 h-px bg-border-subtle ml-4" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
        >
          <GlassCard hover={false} className="p-1 md:p-1.5 rounded-[20px]">
            <div className="flex flex-col md:flex-row bg-surface-base rounded-[16px] overflow-hidden border border-border-subtle">
              
              {/* Left Column: Avatar & Basic Info */}
              <div className="p-8 md:p-10 flex flex-col items-center md:items-start justify-center md:border-r border-border-subtle bg-surface-overlay/50 md:min-w-[300px]">
                <div className="w-24 h-24 rounded-full bg-surface-overlay border-2 border-border-default flex items-center justify-center mb-6 relative overflow-hidden group">
                  <img src="/profile.jpg" alt="Profile" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                
                <h3 className="text-2xl font-bold text-text-primary tracking-tight text-center md:text-left mb-1">
                  {creator.name}
                </h3>
                <p className="text-sm font-mono text-accent text-center md:text-left">
                  {creator.role}
                </p>
              </div>

              {/* Right Column: Bio & Links */}
              <div className="p-8 md:p-10 flex flex-col justify-center flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-text-muted" />
                  <p className="text-[11px] font-mono text-text-muted uppercase tracking-widest">
                    Clearance Level 9
                  </p>
                </div>
                
                <p className="text-base text-text-secondary leading-relaxed mb-8">
                  {creator.bio}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-auto">
                  {creator.links.map((link) => {
                    const Icon = iconMap[link.icon] || Globe
                    return (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-button)] bg-surface-overlay text-text-primary text-xs font-medium border border-border-default hover:border-accent hover:text-accent transition-all duration-200 active:scale-[0.98]"
                      >
                        <Icon className="w-4 h-4" strokeWidth={1.5} />
                        {link.label}
                      </a>
                    )
                  })}
                </div>
              </div>

            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}
