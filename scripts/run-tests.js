import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import './fetch-logo.js';
import './check-logo.js';

const require = createRequire(import.meta.url);
const outDir = path.resolve('.tmp/tests');
const outfile = path.join(outDir, 'logo-tests.cjs');

async function run() {
  try {
    fs.mkdirSync(outDir, { recursive: true });

    await build({
      entryPoints: ['tests/LogoProvability.test.tsx'],
      outfile,
      bundle: true,
      platform: 'node',
      format: 'cjs',
      target: 'node22',
      absWorkingDir: process.cwd(),
      loader: { '.png': 'file' },
      assetNames: '[name]',
      alias: {
        '@': path.resolve('src'),
      },
      logLevel: 'silent',
    });

    require(outfile);
    console.log('Logo integrity tests passed.');
  } catch (error) {
    console.error('Logo integrity tests failed:', error);
    process.exitCode = 1;
  }
}

run();
