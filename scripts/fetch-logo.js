import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream';
import { fileURLToPath, URL } from 'node:url';
import process from 'node:process';
import http from 'node:http';
import https from 'node:https';

const logoPath = path.resolve(process.cwd(), 'src', 'assets', 'dex-logo.png');
const source = process.env.DEX_LOGO_URL;

function ensureDir() {
  fs.mkdirSync(path.dirname(logoPath), { recursive: true });
}

function copyLocal(fileUrl) {
  const fsPath = fileURLToPath(fileUrl);
  if (!fs.existsSync(fsPath)) {
    throw new Error(`DEX_LOGO_URL points to a missing file: ${fsPath}`);
  }
  ensureDir();
  fs.copyFileSync(fsPath, logoPath);
  console.log(`Copied Dex logo from local file: ${fsPath}`);
}

function downloadRemote(targetUrl) {
  const client = targetUrl.protocol === 'http:' ? http : https;
  ensureDir();
  const tempPath = `${logoPath}.download`;
  const file = fs.createWriteStream(tempPath);

  return new Promise((resolve, reject) => {
    const request = client.get(targetUrl, (response) => {
      if (response.statusCode && response.statusCode >= 400) {
        reject(new Error(`Failed to download logo (${response.statusCode}): ${targetUrl.href}`));
        return;
      }
      pipeline(response, file, (err) => {
        if (err) return reject(err);
        fs.renameSync(tempPath, logoPath);
        resolve();
      });
    });
    request.on('error', reject);
  });
}

async function main() {
  if (fs.existsSync(logoPath) && fs.statSync(logoPath).size > 0) {
    console.log('Dex logo already present, skipping fetch.');
    return;
  }

  if (!source) {
    console.error(
      'DEX_LOGO_URL not set and src/assets/dex-logo.png is missing. Provide a URL or file:// path to the real dog-holding-cards logo.'
    );
    process.exit(1);
  }

  try {
    const url = new URL(source);
    if (url.protocol === 'file:') {
      copyLocal(url);
    } else if (url.protocol === 'http:' || url.protocol === 'https:') {
      await downloadRemote(url);
      console.log(`Downloaded Dex logo from ${url.href}`);
    } else {
      throw new Error(`Unsupported protocol for DEX_LOGO_URL: ${url.protocol}`);
    }
  } catch (error) {
    console.error('Failed to fetch Dex logo:', error.message || error);
    process.exit(1);
  }
}

main();
