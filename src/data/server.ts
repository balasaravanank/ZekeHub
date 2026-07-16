import type { ServerConfig, Creator } from '@/types'

export const serverConfig: ServerConfig = {
  hostname: 'zekehub-01',
  os: 'Ubuntu 24.04 LTS',
  kernel: '6.8.0-generic',
  cpu: 'AMD EPYC · 4 vCPU',
  ram: '8 GB DDR5',
  storage: '160 GB NVMe SSD',
  runtime: ['Node.js 22 LTS', 'Python 3.12', 'Go 1.22'],
  docker: 'v27.0 · Compose v2.28',
  region: 'AP-South-1 (Mumbai)',
  ip: '*.*.*.42',
}

export const creator: Creator = {
  name: 'Bala Saravanan K',
  role: 'AI & Full Stack Developer',
  bio: 'Building systems that defy gravity. Crafting digital experiences from code to canvas with a focus on Full Stack, AI/ML, Cloud Architecture, and UI/UX design.',
  links: [
    { label: 'Portfolio', url: 'https://www.baladev.me/', icon: 'Globe' },
    { label: 'Transmission', url: 'https://www.baladev.me/#contact', icon: 'Code2' },
    { label: 'Email', url: 'mailto:balasaravanank@example.com', icon: 'Mail' },
  ],
}
