'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Gamepad2, RotateCcw, Trophy, Zap, Activity } from 'lucide-react'

type Difficulty = 'easy' | 'medium' | 'difficult'

const DIFFICULTY_SETTINGS = {
  easy: { grid: 3, baseTiles: 3, showDuration: 1000, label: 'Easy' },
  medium: { grid: 4, baseTiles: 4, showDuration: 800, label: 'Medium' },
  difficult: { grid: 5, baseTiles: 5, showDuration: 600, label: 'Difficult' }
}

type Phase = 'idle' | 'showing' | 'input' | 'success' | 'fail'

function StatBlock({ label, value, icon: Icon, colorClass = "text-text-primary" }: { label: string, value: React.ReactNode, icon?: any, colorClass?: string }) {
  return (
    <div>
      <p className="text-[10px] sm:text-xs font-mono text-text-muted uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />}
        {label}
      </p>
      <p className={`text-2xl sm:text-3xl font-semibold tracking-tight ${colorClass}`}>{value}</p>
    </div>
  )
}

export function MemoryGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [phase, setPhase] = useState<Phase>('idle')
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  
  const [highScores, setHighScores] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('zekehub_highscores')
      return stored ? JSON.parse(stored) : { easy: 0, medium: 0, difficult: 0 }
    } catch {
      return { easy: 0, medium: 0, difficult: 0 }
    }
  })

  const [pattern, setPattern] = useState<Set<number>>(new Set())
  const [playerInput, setPlayerInput] = useState<Set<number>>(new Set())
  const [showingCells, setShowingCells] = useState<Set<number>>(new Set())
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const currentConfig = DIFFICULTY_SETTINGS[difficulty]
  const TOTAL_CELLS = currentConfig.grid * currentConfig.grid

  // Generate a random pattern for the current level
  const generatePattern = useCallback((lvl: number, config: typeof currentConfig) => {
    const total = config.grid * config.grid
    const count = Math.min(config.baseTiles + lvl - 1, total - 1)
    const indices = new Set<number>()
    while (indices.size < count) {
      indices.add(Math.floor(Math.random() * total))
    }
    return indices
  }, [])

  const updateHighScore = useCallback((newScore: number) => {
    setHighScores(prev => {
      const currentHigh = prev[difficulty] || 0
      if (newScore > currentHigh) {
        const next = { ...prev, [difficulty]: newScore }
        try { localStorage.setItem('zekehub_highscores', JSON.stringify(next)) } catch { /* noop */ }
        return next
      }
      return prev
    })
  }, [difficulty])

  // Start a new round
  const startRound = useCallback((lvl: number, diff: Difficulty = difficulty) => {
    const config = DIFFICULTY_SETTINGS[diff]
    const newPattern = generatePattern(lvl, config)
    setPattern(newPattern)
    setPlayerInput(new Set())
    setPhase('showing')
    setShowingCells(newPattern)

    // Hide after delay, enter input phase
    timeoutRef.current = setTimeout(() => {
      setShowingCells(new Set())
      setPhase('input')
    }, config.showDuration + lvl * 100)
  }, [difficulty, generatePattern])

  // Start the game
  const startGame = useCallback(() => {
    setLevel(1)
    setScore(0)
    startRound(1)
  }, [startRound])

  // Handle cell click during input phase
  const handleCellClick = useCallback((index: number) => {
    if (phase !== 'input') return
    if (playerInput.has(index)) return

    const newInput = new Set(playerInput)
    newInput.add(index)
    setPlayerInput(newInput)

    if (!pattern.has(index)) {
      setPhase('fail')
      setShowingCells(pattern)
      updateHighScore(score)
      return
    }

    if (newInput.size === pattern.size) {
      const newScore = score + level * 10 * (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3)
      setScore(newScore)
      setPhase('success')
      updateHighScore(newScore)

      timeoutRef.current = setTimeout(() => {
        const nextLevel = level + 1
        setLevel(nextLevel)
        startRound(nextLevel)
      }, 600)
    }
  }, [phase, playerInput, pattern, score, level, difficulty, startRound, updateHighScore])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const getCellStyle = (index: number) => {
    const isShowing = showingCells.has(index)
    const isPlayerCorrect = phase === 'input' && playerInput.has(index) && pattern.has(index)
    const isWrong = phase === 'fail' && playerInput.has(index) && !pattern.has(index)
    const isRevealed = phase === 'fail' && pattern.has(index)
    const isSuccess = phase === 'success' && pattern.has(index)

    if (isWrong) return 'bg-danger/20 border-danger/40 scale-95'
    if (isShowing || isRevealed || isSuccess) return 'bg-accent border-accent'
    if (isPlayerCorrect) return 'bg-accent/40 border-accent/60'

    return 'bg-surface-overlay border-border-subtle hover:border-border-default hover:bg-surface-hover'
  }

  return (
    <section className="relative py-32 px-6" id="game">
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
              Memory <br />
              <span className="text-text-muted">Matrix</span>
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed">
              Test your cognitive retention. Memorize the neural pattern, then reconstruct it accurately under pressure.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3 px-4 py-2 rounded-full border border-border-subtle bg-surface-overlay/20 backdrop-blur-sm">
            <Activity className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span className="text-xs font-mono font-medium tracking-widest text-text-primary uppercase">Cognitive Test</span>
          </div>
        </motion.div>

        {/* Editorial Data Grid (Linear-style list) */}
        <div className="border-t border-border-subtle border-opacity-50">
          
          {/* Telemetry Row */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-10 md:py-14 border-b border-border-subtle border-opacity-50 group hover:bg-surface-raised/20 transition-colors -mx-6 px-6"
          >
            <div className="lg:col-span-3">
              <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest group-hover:text-text-primary transition-colors">Telemetry</h3>
            </div>
            <div className="lg:col-span-9 flex flex-col md:flex-row justify-between gap-10">
              <div className="flex-1 grid grid-cols-3 gap-6">
                <StatBlock label="Level" value={level.toString().padStart(2, '0')} icon={Zap} />
                <StatBlock label="Score" value={score.toString().padStart(4, '0')} icon={Gamepad2} />
                <StatBlock label="High Score" value={(highScores[difficulty] || 0).toString().padStart(4, '0')} icon={Trophy} colorClass="text-warn" />
              </div>

              {/* Difficulty Selector */}
              <div className="w-full md:w-[300px] shrink-0 md:pt-2">
                <p className="text-[10px] sm:text-xs font-mono text-text-muted uppercase tracking-widest mb-3">Parameters</p>
                <div className="flex gap-2">
                  {(Object.keys(DIFFICULTY_SETTINGS) as Difficulty[]).map(d => (
                    <button
                      key={d}
                      onClick={() => phase === 'idle' && setDifficulty(d)}
                      disabled={phase !== 'idle'}
                      className={`flex-1 py-2 rounded-[var(--radius-button)] text-xs font-medium transition-all duration-200 border ${
                        difficulty === d
                          ? 'bg-accent/10 border-accent/30 text-accent'
                          : 'bg-surface-overlay border-border-subtle text-text-muted hover:border-border-default hover:text-text-secondary'
                      } ${phase !== 'idle' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {DIFFICULTY_SETTINGS[d].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Neural Grid Row */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-10 md:py-14 border-b border-border-subtle border-opacity-50 group hover:bg-surface-raised/20 transition-colors -mx-6 px-6"
          >
            <div className="lg:col-span-3">
              <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest group-hover:text-text-primary transition-colors">Neural Grid</h3>
            </div>
            <div className="lg:col-span-9 flex flex-col md:flex-row gap-12 items-start">
              
              {/* The Matrix */}
              <div className="flex-1 w-full max-w-[400px]">
                <div
                  className="grid gap-2.5 mx-auto"
                  style={{
                    gridTemplateColumns: `repeat(${currentConfig.grid}, 1fr)`,
                  }}
                >
                  {Array.from({ length: TOTAL_CELLS }, (_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => handleCellClick(i)}
                      disabled={phase !== 'input'}
                      whileTap={phase === 'input' ? { scale: 0.92 } : undefined}
                      className={`aspect-square rounded-xl border transition-all duration-300 cursor-pointer disabled:cursor-default ${getCellStyle(i)}`}
                      aria-label={`Cell ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Console Output */}
              <div className="w-full md:w-[300px] shrink-0 bg-surface-overlay/30 border border-border-subtle rounded-[20px] p-6 min-h-[200px] flex flex-col">
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-6">Console Output</p>
                
                <div className="flex-1 flex flex-col justify-center gap-4">
                  <AnimatePresence mode="wait">
                    {phase === 'idle' && (
                      <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
                        <p className="text-sm text-text-secondary leading-relaxed">System ready. Await visual pattern and reconstruct.</p>
                        <button
                          onClick={startGame}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[var(--radius-button)] bg-text-primary text-surface-base font-semibold text-sm hover:opacity-90 transition-opacity duration-200 active:scale-[0.98] cursor-pointer w-full"
                        >
                          <Gamepad2 className="w-4 h-4" strokeWidth={2} />
                          Initialize Sequence
                        </button>
                      </motion.div>
                    )}

                    {phase === 'showing' && (
                      <motion.div key="memorize" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <p className="text-sm font-mono text-accent animate-pulse">
                          [WAIT] Mapping pattern sequence to grid...
                        </p>
                      </motion.div>
                    )}

                    {phase === 'input' && (
                      <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <p className="text-sm font-mono text-text-primary mb-2">
                          [INPUT REQUIRED]
                        </p>
                        <div className="h-1.5 w-full bg-surface-overlay rounded-full overflow-hidden mb-2">
                          <motion.div
                            className="h-full bg-text-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${(playerInput.size / pattern.size) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs font-mono text-text-secondary">
                          Nodes linked: {playerInput.size} / {pattern.size}
                        </p>
                      </motion.div>
                    )}

                    {phase === 'success' && (
                      <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <p className="text-sm font-mono text-accent font-semibold mb-1">
                          ✓ SEQUENCE VERIFIED
                        </p>
                        <p className="text-xs font-mono text-text-secondary">
                          Advancing to sector {level + 1}...
                        </p>
                      </motion.div>
                    )}

                    {phase === 'fail' && (
                      <motion.div key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
                        <div>
                          <p className="text-sm font-mono text-danger font-semibold mb-1">
                            ⨯ CRITICAL FAILURE
                          </p>
                          <p className="text-xs font-mono text-text-secondary">
                            Pattern corrupted at Level {level}.
                          </p>
                        </div>
                        <button
                          onClick={startGame}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[var(--radius-button)] bg-surface-overlay text-text-primary font-medium text-sm border border-border-default hover:border-border-accent transition-all duration-200 active:scale-[0.98] cursor-pointer w-full"
                        >
                          <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
                          Re-Initialize
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

