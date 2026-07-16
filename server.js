import express from 'express';
import cors from 'cors';
import si from 'systeminformation';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ==========================================
// 1. HARDWARE DIAGNOSTICS CACHE
// ==========================================
let cachedStats = null;

async function updateHardwareStats() {
  try {
    const [cpuInfo, cpuLoad, mem, os, time, docker, procs, netInterfaces, netConn, fileSys] = await Promise.all([
      si.cpu(),
      si.currentLoad(),
      si.mem(),
      si.osInfo(),
      si.time(),
      si.dockerContainers().catch(() => []),
      si.processes().catch(() => ({ list: [], running: 0, all: 0 })),
      si.networkInterfaces().catch(() => []),
      si.networkConnections().catch(() => []),
      si.fsSize().catch(() => [])
    ]);

    // Format Network IP (Find first non-internal IPv4)
    let ip4 = '*.*.*.*';
    if (Array.isArray(netInterfaces)) {
      const defaultIface = netInterfaces.find(iface => !iface.internal && iface.ip4);
      if (defaultIface) ip4 = defaultIface.ip4;
    }

    // Format FS Size (Grab root or first)
    const mainFs = fileSys.length > 0 ? fileSys[0] : { fs: 'unknown', type: 'unknown' };

    cachedStats = {
      uptime: time.uptime,
      cpu: {
        load: cpuLoad.currentLoad,
        manufacturer: cpuInfo.manufacturer || 'Unknown',
        brand: cpuInfo.brand || 'Processor',
        speed: cpuInfo.speed || '0',
        speedMax: cpuInfo.speedMax || '0',
        cores: cpuInfo.cores || 0,
        physicalCores: cpuInfo.physicalCores || 0,
        cache: { l3: cpuInfo.cache?.l3 || 0 }
      },
      load: {
        avgLoad: cpuLoad.avgLoad || 0,
        currentLoad: cpuLoad.currentLoad || 0,
        tasks: { total: procs.all || 0, running: procs.running || 0 }
      },
      mem: {
        total: mem.total,
        used: mem.active,
        free: mem.available,
        swaptotal: mem.swaptotal || 0,
        swapused: mem.swapused || 0
      },
      os: {
        platform: os.platform,
        distro: os.distro,
        release: os.release,
        kernel: os.kernel,
        hostname: os.hostname,
        arch: os.arch || 'x64'
      },
      network: {
        ip4,
        activeConnections: netConn.length || 0
      },
      disk: {
        fs: mainFs.fs || 'ext4',
        type: mainFs.type || 'SSD'
      },
      docker: {
        total: docker.length,
        active: docker.filter((c) => c.state === 'running').length,
      }
    };
  } catch (error) {
    console.error('Error updating hardware stats:', error);
  }
}

// Start background polling for hardware stats every 2 seconds
updateHardwareStats();
setInterval(updateHardwareStats, 2000);

// API route for server stats (Instantly returns memory cache)
app.get('/api/diagnostics', (req, res) => {
  if (!cachedStats) {
    return res.status(503).json({ error: 'Server stats initializing...' });
  }
  res.json(cachedStats);
});


// ==========================================
// 2. SURVEY DATA CACHE
// ==========================================
const surveyFile = path.join(__dirname, 'survey-data.json');
let cachedSurvey = { yes: 0, no: 0 };
let surveyNeedsSave = false;

async function loadInitialSurveyData() {
  try {
    const data = await fs.readFile(surveyFile, 'utf8');
    cachedSurvey = JSON.parse(data);
  } catch {
    await fs.writeFile(surveyFile, JSON.stringify(cachedSurvey));
  }
}

// Background worker to save survey to disk every 5 seconds if changed
setInterval(async () => {
  if (surveyNeedsSave) {
    try {
      await fs.writeFile(surveyFile, JSON.stringify(cachedSurvey));
      surveyNeedsSave = false;
    } catch (error) {
      console.error('Failed to save survey to disk:', error);
    }
  }
}, 5000);

loadInitialSurveyData();

// API routes for survey (Instantly read/write memory)
app.get('/api/pulse', (req, res) => {
  res.json(cachedSurvey);
});

app.post('/api/pulse', (req, res) => {
  const { vote } = req.body;
  if (vote !== 'yes' && vote !== 'no') {
    return res.status(400).json({ error: 'Invalid vote' });
  }
  
  cachedSurvey[vote] += 1;
  surveyNeedsSave = true; // Flag for background worker
  
  res.json(cachedSurvey);
});


// ==========================================
// 3. FRONTEND SERVING (PRODUCTION)
// ==========================================
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));

  app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`ZekeHub backend running on port ${PORT}`);
});