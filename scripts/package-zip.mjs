import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { zipSync } from 'fflate';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'plugin.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const distPath = path.join(root, 'dist');
const releasePath = path.join(root, 'release');
const files = {
  'weather-widget/plugin.json': new Uint8Array(await readFile(manifestPath)),
};

for (const entry of await readdir(distPath, { withFileTypes: true })) {
  if (!entry.isFile()) continue;
  const absolutePath = path.join(distPath, entry.name);
  files[`weather-widget/dist/${entry.name}`] = new Uint8Array(
    await readFile(absolutePath)
  );
}

await mkdir(releasePath, { recursive: true });
const output = path.join(
  releasePath,
  `iracing-weather-widget-v${manifest.version}.zip`
);
await writeFile(output, zipSync(files, { level: 9 }));
console.log(`Created ${output}`);
