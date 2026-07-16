export interface ServerConfig {
  hostname: string
  os: string
  kernel: string
  cpu: string
  ram: string
  storage: string
  runtime: string[]
  docker: string
  region: string
  ip: string
}

export interface Creator {
  name: string
  role: string
  bio: string
  links: { label: string; url: string; icon: string }[]
}

export interface MemoryGameState {
  level: number
  score: number
  phase: 'idle' | 'showing' | 'input' | 'success' | 'fail'
  pattern: number[]
  playerInput: number[]
  gridSize: number
  highScore: number
}

export interface LiveServerStats {
  uptime: number
  cpu: { 
    load: number
    manufacturer: string
    brand: string
    speed: string
    speedMax: string
    cores: number
    physicalCores: number
    cache: { l3: number }
  }
  load: {
    avgLoad: number
    currentLoad: number
    tasks: { total: number; running: number }
  }
  mem: { 
    total: number
    used: number
    free: number
    swaptotal: number
    swapused: number
  }
  os: { 
    platform: string
    distro: string
    release: string
    kernel: string
    hostname: string
    arch: string
  }
  network: {
    ip4: string
    activeConnections: number
  }
  disk: {
    fs: string
    type: string
  }
  docker: { 
    total: number
    active: number 
  }
}
