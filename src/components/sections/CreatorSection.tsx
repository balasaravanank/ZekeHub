'use client'

import { motion } from 'motion/react'
import { Code2, Globe, Mail } from 'lucide-react'
import { creator } from '@/data/server'
import { GlassCard } from '@/components/ui/GlassCard'

const iconMap: Record<string, React.ElementType> = {
  Code2,
  Globe,
  Mail,
}

export function CreatorSection() {
  return (
    <section className="relative py-24 px-6" id="creator">
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
            Built by
          </h2>
        </motion.div>

        {/* Creator card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
        >
          <GlassCard hover={false} className="p-8 text-center">
            {/* Avatar placeholder — initials */}
            <div className="mx-auto mb-5 w-20 h-20 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-accent tracking-tight">
                {creator.name.charAt(0)}
              </span>
            </div>

            <h3 className="text-xl font-bold text-text-primary tracking-tight mb-1">
              {creator.name}
            </h3>
            <p className="text-sm font-mono text-accent mb-4">{creator.role}</p>
            <p className="text-sm text-text-secondary max-w-[45ch] mx-auto leading-relaxed mb-6">
              {creator.bio}
            </p>

            {/* Links */}
            <div className="flex items-center justify-center gap-2">
              {creator.links.map((link) => {
                const Icon = iconMap[link.icon] || Globe
                return (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[var(--radius-button)] bg-surface-overlay text-text-secondary text-xs font-medium border border-border-subtle hover:border-border-accent hover:text-accent transition-all duration-200 active:scale-[0.98]"
                  >
                    <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                    {link.label}
                  </a>
                )
              })}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}
