import { cp, mkdir, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { COLORS, exec, exists, getProjectInfo, logger, ROOT_DIR } from './utils';

async function release() {
  const startTime = Date.now();
  const isPre = process.argv.includes('--pre');
  const { name: resourceName, version, prefix } = await getProjectInfo();

  logger.header(`${isPre ? 'Pre-' : ''}Release Generator`);
  console.log(
    `${COLORS.dim}Target Resource: ${COLORS.reset}${COLORS.bold}${resourceName}${COLORS.reset}`,
  );
  console.log(
    `${COLORS.dim}Target Version:  ${COLORS.reset}${COLORS.cyan}${version}${COLORS.reset}`,
  );
  console.log(
    `${COLORS.dim}Release Type:    ${COLORS.reset}${isPre ? `${COLORS.magenta}BETA` : `${COLORS.green}STABLE`}${COLORS.reset}\n`,
  );

  try {
    // 1. Build
    logger.info(prefix, 'Compiling production assets via Vite...');
    await exec('bun run build');

    // 2. Prepare temp directory
    logger.info(prefix, 'Staging release files...');
    const tempRoot = join(ROOT_DIR, 'temp');
    const releaseDir = join(tempRoot, resourceName);

    if (await exists(tempRoot)) await rm(tempRoot, { recursive: true, force: true });
    await mkdir(releaseDir, { recursive: true });

    // 3. Copy files
    const toCopy = [
      'dist',
      'client',
      'server',
      'shared',
      'fxmanifest.lua',
      'LICENSE.md',
      'README.md',
    ];
    for (const file of toCopy) {
      const srcPath = join(ROOT_DIR, file);
      if (await exists(srcPath)) {
        await cp(srcPath, join(releaseDir, file), { recursive: true });
      }
    }

    // Clean up local dist after copy
    const distPath = join(ROOT_DIR, 'dist');
    if (await exists(distPath)) {
      await rm(distPath, { recursive: true, force: true });
      logger.dim(prefix, 'Cleaned up local build artifacts.');
    }

    // 4. Zip
    const hash = isPre
      ? `-${await exec('git rev-parse --short HEAD', { stdio: 'pipe' })
          .then((res) => res.stdout?.trim())
          .catch(() => Date.now().toString())}`
      : '';
    const zipName = `${resourceName}${isPre ? '-pre' : ''}${hash}.zip`;
    const zipPath = join(tempRoot, zipName);

    logger.info(prefix, `Packaging into ${COLORS.cyan}${zipName}${COLORS.reset}...`);
    const isWin = process.platform === 'win32';
    const zipCmd = isWin
      ? `powershell -Command "Compress-Archive -Path '${resourceName}' -DestinationPath '${zipName}' -Force"`
      : `zip -q -r ${zipName} ${resourceName}`;

    await exec(zipCmd, { cwd: tempRoot });

    // 5. Finalize
    const stats = await stat(zipPath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    logger.success(prefix, `Release package generated successfully! (${duration}s)`);
    logger.header('Release Ready');
    console.log(
      `${COLORS.dim}Artifact: ${COLORS.reset}${COLORS.bold}temp/${zipName}${COLORS.reset}`,
    );
    console.log(
      `${COLORS.dim}Size:     ${COLORS.reset}${COLORS.cyan}${sizeMB} MB${COLORS.reset}\n`,
    );
  } catch (err) {
    const error = err as Error;
    logger.error(prefix, `Release failed: ${error.message}`);
    process.exit(1);
  }
}

release();
