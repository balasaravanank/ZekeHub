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
  name: 'Balak',
  role: 'Full-Stack Developer',
  bio: 'Building and self-hosting web apps from scratch. Passionate about clean code, efficient systems, and learning by building.',
  links: [
    { label: 'GitHub', url: 'https://github.com', icon: 'Code2' },
    { label: 'Portfolio', url: '#', icon: 'Globe' },
    { label: 'Email', url: 'mailto:hello@example.com', icon: 'Mail' },
  ],
}
