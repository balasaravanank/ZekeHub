import { useState, useEffect } from 'react'
import type { LiveServerStats } from '@/types'

export function useServerStats(pollingIntervalMs = 2000) {
  const [stats, setStats] = useState<LiveServerStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats')
        if (!res.ok) throw new Error('Network response was not ok')
        const data = await res.json()
        setStats(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch server stats', err)
        setError('Failed to fetch stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, pollingIntervalMs)
    return () => clearInterval(interval)
  }, [pollingIntervalMs])

  return { stats, loading, error }
}
