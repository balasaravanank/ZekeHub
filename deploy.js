import { NodeSSH } from 'node-ssh';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ssh = new NodeSSH();

async function deploy() {
  try {
    console.log('Connecting to server...');
    await ssh.connect({
      host: '100.65.253.18',
      username: 'bala',
      password: 'zeke@2005'
    });
    console.log('Connected!');

    const remoteDir = '/home/bala/ServerHub';
    const archiveName = 'server-page.tar.gz';
    
    // Create remote directory
    console.log('Preparing remote directory...');
    await ssh.execCommand(`mkdir -p ${remoteDir}`);

    // Upload archive
    console.log('Uploading project archive...');
    await ssh.putFile(
      path.join(__dirname, archiveName),
      `${remoteDir}/${archiveName}`
    );
    console.log('Upload complete!');

    // Extract and run Docker
    console.log('Extracting and building Docker container...');
    const buildCmd = await ssh.execCommand(`
      cd ${remoteDir}
      tar -xzf ${archiveName}
      docker compose down
      docker compose build --no-cache
      docker compose up -d
    `);

    console.log('STDOUT:', buildCmd.stdout);
    if (buildCmd.stderr) console.error('STDERR:', buildCmd.stderr);

    console.log('Deployment successful!');
  } catch (err) {
    console.error('Deployment failed:', err);
  } finally {
    ssh.dispose();
  }
}

deploy();
