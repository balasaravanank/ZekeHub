'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Gamepad2, RotateCcw, Trophy, Zap } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'

const GRID_SIZE = 4
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE
const SHOW_DURATION = 800 // ms to show the pattern
const BASE_TILES = 3      // starting number of lit tiles

type Phase = 'idle' | 'showing' | 'input' | 'success' | 'fail'

export function MemoryGame() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem('zekehub_highscore')) || 0
    } catch {
      return 0
    }
  })
  const [pattern, setPattern] = useState<Set<number>>(new Set())
  const [playerInput, setPlayerInput] = useState<Set<number>>(new Set())
  const [showingCells, setShowingCells] = useState<Set<number>>(new Set())
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Generate a random pattern for the current level
  const generatePattern = useCallback((lvl: number) => {
    const count = Math.min(BASE_TILES + lvl - 1, TOTAL_CELLS - 1)
    const indices = new Set<number>()
    while (indices.size < count) {
      indices.add(Math.floor(Math.random() * TOTAL_CELLS))
    }
    return indices
  }, [])

  // Start a new round
  const startRound = useCallback((lvl: number) => {
    const newPattern = generatePattern(lvl)
    setPattern(newPattern)
    setPlayerInput(new Set())
    setPhase('showing')
    setShowingCells(newPattern)

    // Hide after delay, enter input phase
    timeoutRef.current = setTimeout(() => {
      setShowingCells(new Set())
      setPhase('input')
    }, SHOW_DURATION + lvl * 100) // slightly longer for harder levels
  }, [generatePattern])

  // Start the game
  const startGame = useCallback(() => {
    setLevel(1)
    setScore(0)
    startRound(1)
  }, [startRound])

  // Handle cell click during input phase
  const handleCellClick = useCallback((index: number) => {
    if (phase !== 'input') return
    if (playerInput.has(index)) return // already clicked

    const newInput = new Set(playerInput)
    newInput.add(index)
    setPlayerInput(newInput)

    if (!pattern.has(index)) {
      // Wrong cell — game over
      setPhase('fail')
      setShowingCells(pattern) // reveal the correct answer
      if (score > highScore) {
        setHighScore(score)
        try { localStorage.setItem('zekehub_highscore', String(score)) } catch { /* noop */ }
      }
      return
    }

    // Correct cell
    if (newInput.size === pattern.size) {
      // Completed the level
      const newScore = score + level * 10
      setScore(newScore)
      setPhase('success')

      if (newScore > highScore) {
        setHighScore(newScore)
        try { localStorage.setItem('zekehub_highscore', String(newScore)) } catch { /* noop */ }
      }

      timeoutRef.current = setTimeout(() => {
        const nextLevel = level + 1
        setLevel(nextLevel)
        startRound(nextLevel)
      }, 600)
    }
  }, [phase, playerInput, pattern, score, level, highScore, startRound])

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Cell state styling
  const getCellStyle = (index: number) => {
    const isShowing = showingCells.has(index)
    const isPlayerCorrect = phase === 'input' && playerInput.has(index) && pattern.has(index)
    const isWrong = phase === 'fail' && playerInput.has(index) && !pattern.has(index)
    const isRevealed = phase === 'fail' && pattern.has(index)
    const isSuccess = phase === 'success' && pattern.has(index)

    if (isWrong) return 'bg-danger/40 border-danger/50 scale-95'
    if (isShowing || isRevealed || isSuccess) return 'bg-accent/30 border-accent/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
    if (isPlayerCorrect) return 'bg-accent/25 border-accent/35'

    return 'bg-surface-overlay border-border-subtle hover:border-border-default hover:bg-surface-hover'
  }

  return (
    <section className="relative py-24 px-6" id="game">
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
            Memory Matrix
          </h2>
          <p className="text-sm text-text-secondary max-w-[40ch] mx-auto">
            Test your memory. Remember the pattern, then tap the correct cells.
          </p>
        </motion.div>

        {/* Game card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
        >
          <GlassCard hover={false} className="p-6 md:p-8">
            {/* Stats bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs font-mono text-text-muted">
                  <Zap className="w-3.5 h-3.5 text-accent" strokeWidth={1.5} />
                  <span>LVL <span className="text-text-primary font-semibold">{level}</span></span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-text-muted">
                  <Gamepad2 className="w-3.5 h-3.5 text-accent" strokeWidth={1.5} />
                  <span>Score <span className="text-text-primary font-semibold">{score}</span></span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-text-muted">
                <Trophy className="w-3.5 h-3.5 text-warn" strokeWidth={1.5} />
                <span>Best <span className="text-warn font-semibold">{highScore}</span></span>
              </div>
            </div>

            {/* Grid */}
            <div
              className="grid gap-2.5 mx-auto mb-6"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                maxWidth: '320px',
              }}
            >
              {Array.from({ length: TOTAL_CELLS }, (_, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleCellClick(i)}
                  disabled={phase !== 'input'}
                  whileTap={phase === 'input' ? { scale: 0.92 } : undefined}
                  className={`aspect-square rounded-xl border transition-all duration-200 cursor-pointer disabled:cursor-default ${getCellStyle(i)}`}
                  aria-label={`Cell ${i + 1}`}
                />
              ))}
            </div>

            {/* Phase message + action */}
            <div className="text-center min-h-[60px] flex flex-col items-center justify-center gap-3">
              <AnimatePresence mode="wait">
                {phase === 'idle' && (
                  <motion.button
                    key="start"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    onClick={startGame}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius-button)] bg-accent text-surface-base font-medium text-sm hover:bg-accent-hover transition-colors duration-200 active:scale-[0.98] cursor-pointer"
                  >
                    <Gamepad2 className="w-4 h-4" strokeWidth={2} />
                    Start Game
                  </motion.button>
                )}

                {phase === 'showing' && (
                  <motion.p
                    key="memorize"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-mono text-accent animate-pulse"
                  >
                    Memorize the pattern...
                  </motion.p>
                )}

                {phase === 'input' && (
                  <motion.p
                    key="input"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-mono text-text-secondary"
                  >
                    Tap the cells you remember ({playerInput.size}/{pattern.size})
                  </motion.p>
                )}

                {phase === 'success' && (
                  <motion.p
                    key="nice"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-mono text-accent font-semibold"
                  >
                    ✓ Level {level} cleared! +{level * 10} pts
                  </motion.p>
                )}

                {phase === 'fail' && (
                  <motion.div
                    key="fail"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <p className="text-sm font-mono text-danger">
                      Game over — reached level {level} with {score} pts
                    </p>
                    <button
                      onClick={startGame}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-[var(--radius-button)] bg-surface-overlay text-text-primary text-xs font-medium border border-border-default hover:border-border-accent transition-all duration-200 active:scale-[0.98] cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
                      Play Again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}
