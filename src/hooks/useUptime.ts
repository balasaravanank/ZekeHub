import { useState, useEffect } from 'react'

export function useUptime(startDate: Date = new Date('2024-01-15T00:00:00Z')) {
  const [elapsed, setElapsed] = useState('')

  useEffect(() => {
    function calculate() {
      const now = new Date()
      const diff = now.getTime() - startDate.getTime()

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setElapsed(`${days}d ${hours}h ${minutes}m ${seconds}s`)
    }

    calculate()
    const interval = setInterval(calculate, 1000)
    return () => clearInterval(interval)
  }, [startDate])

  return elapsed
}
