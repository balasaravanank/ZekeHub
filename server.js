import express from 'express';
import cors from 'cors';
import si from 'systeminformation';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API route for server stats
app.get('/api/stats', async (req, res) => {
  try {
    const [cpu, mem, os, time, docker] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.osInfo(),
      si.time(),
      si.dockerContainers().catch(() => []) // Fallback if docker is not available
    ]);

    res.json({
      uptime: time.uptime, // in seconds
      cpu: {
        load: cpu.currentLoad,
      },
      mem: {
        total: mem.total,
        used: mem.active,
        free: mem.available,
      },
      os: {
        platform: os.platform,
        distro: os.distro,
        release: os.release,
        kernel: os.kernel,
        hostname: os.hostname,
      },
      docker: {
        total: docker.length,
        active: docker.filter((c) => c.state === 'running').length,
      }
    });
  } catch (error) {
    console.error('Error fetching system stats:', error);
    res.status(500).json({ error: 'Failed to fetch system stats' });
  }
});

// In production, serve the Vite built files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`ServerHub backend running on port ${PORT}`);
});
