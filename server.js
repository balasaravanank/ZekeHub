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
    const [cpuInfo, cpuLoad, mem, os, time, docker, procs, netInterfaces, netConn, fs] = await Promise.all([
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
    const mainFs = fs.length > 0 ? fs[0] : { fs: 'unknown', type: 'unknown' };

    res.json({
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
    });
  } catch (error) {
    console.error('Error fetching system stats:', error);
    res.status(500).json({ error: 'Failed to fetch system stats' });
  }
});

// Setup Survey Data File
const surveyFile = path.join(__dirname, 'survey-data.json');
import fs from 'fs/promises';

async function getSurveyData() {
  try {
    const data = await fs.readFile(surveyFile, 'utf8');
    return JSON.parse(data);
  } catch {
    const defaultData = { yes: 0, no: 0 };
    await fs.writeFile(surveyFile, JSON.stringify(defaultData));
    return defaultData;
  }
}

app.get('/api/survey', async (req, res) => {
  try {
    const data = await getSurveyData();
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch survey data' });
  }
});

app.post('/api/survey', async (req, res) => {
  try {
    const { vote } = req.body;
    if (vote !== 'yes' && vote !== 'no') {
      return res.status(400).json({ error: 'Invalid vote' });
    }
    
    const data = await getSurveyData();
    data[vote] += 1;
    
    await fs.writeFile(surveyFile, JSON.stringify(data));
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to save survey data' });
  }
});

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));

  app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`ServerHub backend running on port ${PORT}`);
});