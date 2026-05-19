import { execSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer, { type Browser, type Page } from 'puppeteer-core';
import { ask, COLORS, getProjectInfo, logger, WEB_DIR } from './utils';

// --- Configuration ---
const IS_WIN = process.platform === 'win32';
const PORT = 8337;
const CHROMIUM_DIR = path.join(WEB_DIR, 'bin');
const CHROMIUM_PATH = IS_WIN
  ? path.join(CHROMIUM_DIR, 'chrome-win/chrome.exe')
  : path.join(CHROMIUM_DIR, 'chrome-mac/Chromium.app/Contents/MacOS/Chromium');

const DOWNLOAD_URLS = {
  win32:
    'https://github.com/StarlingCityDevelopment/vstack-template/releases/download/chromium-storage/chrome-win.zip',
  darwin:
    'https://github.com/StarlingCityDevelopment/vstack-template/releases/download/chromium-storage/chrome-mac.zip',
};

// --- Utilities ---
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Downloads a file with parallel chunks and a throttled progress bar
 */
async function downloadFile(url: string, dest: string, prefix: string) {
  const head = await fetch(url, { method: 'HEAD' });
  const total = Number(head.headers.get('content-length') || 0);
  if (!total) throw new Error(`${prefix} Cannot determine file size`);

  const CHUNKS = 8;
  const chunkSize = Math.ceil(total / CHUNKS);
  const downloaded = new Array(CHUNKS).fill(0);

  let lastUpdate = 0;
  const printProgress = () => {
    const now = Date.now();
    if (now - lastUpdate < 100) return;
    lastUpdate = now;
    const current = downloaded.reduce((a, b) => a + b, 0);
    const pct = Math.round((current / total) * 100);
    const bar = '█'.repeat(Math.floor(pct / 5)) + '░'.repeat(20 - Math.floor(pct / 5));
    process.stdout.write(
      `\r${COLORS.blue}${prefix}${COLORS.reset} ${COLORS.cyan}[${bar}] ${pct}%${COLORS.reset} ${COLORS.dim}${(current / 1024 / 1024).toFixed(2)} MB / ${(total / 1024 / 1024).toFixed(2)} MB${COLORS.reset}`,
    );
  };

  const buffers = await Promise.all(
    Array.from({ length: CHUNKS }, async (_, i) => {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize - 1, total - 1);
      const res = await fetch(url, { headers: { Range: `bytes=${start}-${end}` } });
      if (!res.ok) throw new Error(`${prefix} Chunk ${i} failed`);

      const reader = res.body!.getReader();
      const parts: Uint8Array[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        parts.push(value);
        downloaded[i] += value.length;
        printProgress();
      }
      return Buffer.concat(parts);
    }),
  );

  process.stdout.write('\n');
  const fd = fs.openSync(dest, 'w');
  for (const buf of buffers) fs.writeSync(fd, buf);
  fs.closeSync(fd);
}

async function ensureChromium(prefix: string) {
  if (fs.existsSync(CHROMIUM_PATH)) return;

  logger.warn(prefix, 'Chromium v103 not found in ./bin/');
  const url = DOWNLOAD_URLS[process.platform as keyof typeof DOWNLOAD_URLS];
  if (!url) throw new Error(`${prefix} No download URL for ${process.platform}`);

  const answer = await ask('Download Chromium v103 now? (y/n): ');
  if (answer.toLowerCase() !== 'y') {
    logger.error(prefix, 'Aborted. Simulation requires Chromium v103.');
    process.exit(1);
  }

  if (!fs.existsSync(CHROMIUM_DIR)) fs.mkdirSync(CHROMIUM_DIR, { recursive: true });

  const zipPath = path.join(CHROMIUM_DIR, 'chromium.zip');
  logger.info(prefix, 'Starting parallel download...');
  await downloadFile(url, zipPath, prefix);

  logger.info(prefix, 'Extracting archive content...');
  try {
    const cmd = IS_WIN
      ? `powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${CHROMIUM_DIR}' -Force"`
      : `tar -xf "${zipPath}" -C "${CHROMIUM_DIR}" && chmod +x "${CHROMIUM_PATH}"`;
    execSync(cmd);
    logger.success(prefix, 'Environment initialized successfully.');
  } catch (err) {
    logger.error(prefix, `Extraction failed: ${err}`);
    throw err;
  }

  const deleteArchive = await ask('Delete the archive to save space? (y/n): ');
  if (deleteArchive.toLowerCase() === 'y') {
    fs.unlinkSync(zipPath);
    logger.dim(prefix, 'Cleaned up archive.');
  }
}

async function triggerVisibility(page: Page) {
  for (let i = 0; i < 5; i++) {
    await delay(500 * i);
    await page
      .evaluate(() => {
        window.dispatchEvent(
          new MessageEvent('message', { data: { action: 'setVisible', data: true } }),
        );
      })
      .catch(() => {});
  }
}

// --- Main ---
async function main() {
  const { prefix } = await getProjectInfo();

  logger.header('Chromium NUI Simulator');
  console.log(`${COLORS.dim}This environment emulates the legacy FiveM CEF environment (v103).`);
  console.log(
    `It allows for testing CSS/JS compatibility and performs lifecycle sync with Vite.${COLORS.reset}\n`,
  );

  const proceed = await ask('Ready to launch simulation? (y/n): ');
  if (proceed.toLowerCase() !== 'y') {
    logger.info(prefix, 'Simulation aborted.');
    process.exit(0);
  }

  await ensureChromium(prefix);

  logger.info(prefix, `Booting Vite server on :${PORT}...`);
  const vite = spawn(
    'npm',
    ['run', 'dev', '--', '--port', PORT.toString(), '--host', '127.0.0.1'],
    {
      cwd: WEB_DIR,
      stdio: 'inherit',
      shell: true,
    },
  );

  const shutdown = async (browser?: Browser) => {
    logger.info(prefix, 'Terminating simulation sequence...');
    if (browser) await browser.close().catch(() => {});
    vite.kill();
    process.exit(0);
  };

  await delay(2000);

  try {
    logger.info(prefix, 'Launching Chromium v103 instance...');
    const browser = await puppeteer.launch({
      executablePath: CHROMIUM_PATH,
      headless: false,
      defaultViewport: null,
      ignoreDefaultArgs: ['--enable-automation'],
      args: [
        `--user-data-dir=${path.join(WEB_DIR, '.chromium_profile')}`,
        '--remote-debugging-port=0',
      ],
    });

    const [page] = await browser.pages();
    browser.on('disconnected', () => shutdown());
    process.on('SIGINT', () => shutdown(browser));
    process.on('SIGTERM', () => shutdown(browser));

    page.on('console', (msg) =>
      process.stdout.write(`${COLORS.gray}[Chromium:CONSOLE] ${msg.text()}${COLORS.reset}\n`),
    );
    page.on('pageerror', (err) => logger.error('[Chromium:ERR]', err.toString()));

    await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: 'load', timeout: 15000 });

    logger.success(prefix, `Simulation active at http://127.0.0.1:${PORT}`);
    await triggerVisibility(page);
  } catch (err) {
    logger.error(prefix, `Launch failure: ${err}`);
    await shutdown();
  }
}

main();
