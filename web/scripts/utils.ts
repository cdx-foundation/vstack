import { type SpawnOptions, spawn } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const WEB_DIR = join(__dirname, '..');
export const ROOT_DIR = join(WEB_DIR, '..');

// --- Types ---
export interface ProjectInfo {
  name: string;
  version: string;
  author: string;
  prefix: string;
}

export interface ExecResult {
  code: number;
  signal: string;
  stdout: string;
  stderr: string;
}

// --- ANSI Colors ---
export const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
};

// --- Utilities ---

/**
 * Professional logger with prefix and color support
 */
export const logger = {
  info: (prefix: string, msg: string) =>
    console.log(`${COLORS.blue}${prefix}${COLORS.reset} ${msg}`),
  success: (prefix: string, msg: string) =>
    console.log(`${COLORS.green}${prefix}${COLORS.reset} ${msg}`),
  warn: (prefix: string, msg: string) =>
    console.log(`${COLORS.yellow}${prefix}${COLORS.reset} ${msg}`),
  error: (prefix: string, msg: string) =>
    console.error(`${COLORS.red}${prefix}${COLORS.reset} ${msg}`),
  dim: (prefix: string, msg: string) =>
    console.log(`${COLORS.gray}${prefix}${COLORS.reset} ${COLORS.dim}${msg}${COLORS.reset}`),
  header: (title: string) => {
    const line = '━'.repeat(Math.max(title.length + 4, 40));
    console.log(`\n${COLORS.cyan}${line}${COLORS.reset}`);
    console.log(`${COLORS.cyan}┃ ${COLORS.bold}${title.toUpperCase()}${COLORS.reset}`);
    console.log(`${COLORS.cyan}${line}${COLORS.reset}`);
  },
};

/**
 * Check if a filepath exists.
 */
export async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Executes a command asynchronously.
 */
export function exec(
  command: string,
  options: SpawnOptions & { stdio?: 'pipe' | 'inherit' } = {},
): Promise<ExecResult> {
  return new Promise((resolve, reject) => {
    const isPipe = options.stdio === 'pipe';
    const child = spawn(command, {
      stdio: options.stdio || 'inherit',
      shell: true,
      cwd: WEB_DIR,
      ...options,
    });

    let stdout = '';
    let stderr = '';

    if (isPipe) {
      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });
      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });
    }

    child.on('exit', (code, signal) => {
      if (code === 0) resolve({ code: code!, signal: signal!, stdout, stderr });
      else reject(new Error(`Command '${command}' failed with code ${code}`));
    });

    child.on('error', reject);
  });
}

/**
 * Get project metadata from package.json and fxmanifest.lua.
 */
export async function getProjectInfo(): Promise<ProjectInfo> {
  const pkgPath = join(WEB_DIR, 'package.json');
  const pkg = JSON.parse(await readFile(pkgPath, 'utf8'));
  const manifestPath = join(ROOT_DIR, 'fxmanifest.lua');
  const manifestContent = (await exists(manifestPath)) ? await readFile(manifestPath, 'utf8') : '';

  const author = manifestContent.match(/^authors?\s+['"](.+?)['"]/m)?.[1] || 'VStack';
  const version = manifestContent.match(/^version\s+['"](.+?)['"]/m)?.[1] || pkg.version;

  return {
    name: pkg.name,
    version,
    author,
    prefix: `[${author}]`,
  };
}

/**
 * Prompt user for input.
 */
export async function ask(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const coloredQuestion = `${COLORS.magenta}?${COLORS.reset} ${question}${COLORS.cyan}`;
  return new Promise((resolve) => {
    rl.question(coloredQuestion, (answer) => {
      process.stdout.write(COLORS.reset);
      rl.close();
      resolve(answer.trim());
    });
  });
}
