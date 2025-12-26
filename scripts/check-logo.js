import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const logoPath = path.resolve(process.cwd(), 'src', 'assets', 'dex-logo.png');

if (!fs.existsSync(logoPath)) {
  console.error(
    'DexTCGMaker logo missing: add the real dog-holding-cards image to src/assets/dex-logo.png (not tracked in git). ' +
    'You can also set DEX_LOGO_URL to a fetchable source and run `npm run fetch:logo`.'
  );
  process.exit(1);
}

const stats = fs.statSync(logoPath);
if (!stats.isFile() || stats.size === 0) {
  console.error('DexTCGMaker logo is unreadable or empty: src/assets/dex-logo.png');
  process.exit(1);
}

console.log('DexTCGMaker logo check passed:', logoPath);
