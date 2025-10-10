const { spawn } = require('child_process');
const http = require('http');

const VITE_URL = 'http://localhost:5173';
const MAX_RETRIES = 30;
const RETRY_INTERVAL = 1000;

function checkServer(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => {
      resolve(false);
    });
  });
}

async function waitForServer() {
  console.log('Waiting for Vite dev server...');

  for (let i = 0; i < MAX_RETRIES; i++) {
    const isReady = await checkServer(VITE_URL);
    if (isReady) {
      console.log('Vite dev server is ready!');
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
    process.stdout.write('.');
  }

  console.error('\nFailed to connect to Vite dev server');
  return false;
}

async function startElectron() {
  const isServerReady = await waitForServer();

  if (!isServerReady) {
    process.exit(1);
  }

  console.log('Starting Electron...');

  // Windows 需要使用 .cmd 扩展名或 shell: true
  const electronCmd = process.platform === 'win32' ? 'electron.cmd' : 'electron';

  const electron = spawn(electronCmd, ['.'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' },
    shell: process.platform === 'win32'
  });

  electron.on('close', (code) => {
    process.exit(code);
  });
}

startElectron();
