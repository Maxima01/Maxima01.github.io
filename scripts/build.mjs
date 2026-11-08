import { cp, lstat, mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
const files = ['index.html', 'styles.css', 'script.js', '.nojekyll', 'assets'];

async function rejectSymlinks(path) {
  const info = await lstat(path);
  if (info.isSymbolicLink()) throw new Error(`Build input cannot be a symbolic link: ${path}`);
  if (info.isDirectory()) {
    for (const entry of await readdir(path)) await rejectSymlinks(join(path, entry));
  }
}

// Only this exact generated directory may be removed; never follow a linked output.
if (output !== join(root, 'dist') || dirname(output) !== root) throw new Error('Unsafe build directory.');
try {
  if ((await lstat(output)).isSymbolicLink()) throw new Error('dist must not be a symbolic link.');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
for (const file of files) await rejectSymlinks(join(root, file));
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of files) await cp(join(root, file), join(output, file), { recursive: true });
console.log('Built dist/ with only public site files. Relative URLs work at a domain root or repository subpath.');
