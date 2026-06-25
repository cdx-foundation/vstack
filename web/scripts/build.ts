import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { ask, COLORS, exec, exists, getProjectInfo, logger, WEB_DIR } from './utils';

async function build() {
  const { name, version, prefix } = await getProjectInfo();
  const isInteractive = process.argv.includes('--interactive');

  logger.header('Production Build');
  console.log(`${COLORS.dim}Compiling: ${COLORS.reset}${COLORS.bold}${name}${COLORS.reset}`);
  console.log(`${COLORS.dim}Version:   ${COLORS.reset}${COLORS.cyan}${version}${COLORS.reset}\n`);

  if (isInteractive) {
    const proceed = await ask('Proceed with production build? (y/n): ');
    if (proceed.toLowerCase() !== 'y') {
      logger.info(prefix, 'Build sequence aborted.');
      process.exit(0);
    }
  }

  try {
    logger.info(prefix, 'Triggering Vite production pipeline...');
    await exec('vite build');

    const distDir = join(WEB_DIR, '../dist');
    const debugBg = join(distDir, 'mock-bg.png');

    if (await exists(debugBg)) {
      await rm(debugBg, { force: true });
      logger.dim(prefix, 'Removed debug background image from build.');
    }

    logger.success(prefix, 'Production build optimized and ready!');
  } catch (err) {
    const error = err as Error;
    logger.error(prefix, `Build sequence failed: ${error.message}`);
    process.exit(1);
  }
}

build();
