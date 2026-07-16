'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Server, Users } from 'lucide-react'

export function SurveyResultsSection() {
  const [results, setResults] = useState({ yes: 0, no: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch('/api/pulse')
        if (res.ok) {
          const data = await res.json()
          setResults(data)
        }
      } catch (err) {
        console.error('Failed to fetch survey results', err)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
    // Poll every 5 seconds for live updates
    const interval = setInterval(fetchResults, 5000)
    return () => clearInterval(interval)
  }, [])

  const total = results.yes + results.no
  const yesPercent = total > 0 ? (results.yes / total) * 100 : 0
  const noPercent = total > 0 ? (results.no / total) * 100 : 0

  return (
    <section className="relative py-24 px-6 border-t border-border-subtle border-opacity-50">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center"
        >
          <div className="md:col-span-5">
            <h2 className="text-3xl font-bold text-text-primary tracking-tight mb-3">
              Community Pulse
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Live telemetry tracking interest in DevOps and Cloud Computing workshops powered by AWS SBG @ SEC.
            </p>
          </div>

          <div className="md:col-span-7 w-full">
            {loading ? (
              <div className="text-sm font-mono text-text-muted animate-pulse">Syncing data...</div>
            ) : (
              <div className="space-y-6">
                {/* Yes Bar */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-mono text-text-primary uppercase tracking-widest flex items-center gap-2">
                      <Server className="w-3.5 h-3.5 text-accent" /> Ready for Workshops
                    </span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-text-primary mr-3">{results.yes} Votes</span>
                      <span className="text-xs font-mono text-accent">{Math.round(yesPercent)}%</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-surface-overlay rounded-full overflow-hidden border border-border-subtle">
                    <motion.div
                      className="h-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${yesPercent}%` }}
                      transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                    />
                  </div>
                </div>

                {/* No Bar */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-mono text-text-muted uppercase tracking-widest flex items-center gap-2">
                      <Users className="w-3.5 h-3.5" /> Not Interested
                    </span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-text-secondary mr-3">{results.no} Votes</span>
                      <span className="text-xs font-mono text-text-muted">{Math.round(noPercent)}%</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-surface-overlay rounded-full overflow-hidden border border-border-subtle">
                    <motion.div
                      className="h-full bg-text-muted opacity-30"
                      initial={{ width: 0 }}
                      animate={{ width: `${noPercent}%` }}
                      transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
