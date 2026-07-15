'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Server, Code2, Terminal } from 'lucide-react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass border-b border-border-subtle !rounded-none'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center group-hover:bg-accent/25 transition-colors duration-300">
            <Server className="w-4 h-4 text-accent" strokeWidth={2} />
          </div>
          <span className="text-lg font-semibold text-text-primary tracking-tight">
            Zeke<span className="text-accent">Hub</span>
          </span>
        </a>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: 'Config', href: '#config' },
            { label: 'Game', href: '#game' },
            { label: 'About', href: '#creator' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary rounded-[var(--radius-input)] hover:bg-surface-overlay transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-overlay transition-all duration-200"
            aria-label="GitHub"
          >
            <Code2 className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </a>
          <a
            href="#"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-overlay transition-all duration-200"
            aria-label="Terminal"
          >
            <Terminal className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </motion.nav>
  )
}
