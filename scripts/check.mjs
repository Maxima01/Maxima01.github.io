import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const htmlPath = join(root, 'index.html');
let html;
try { html = await readFile(htmlPath, 'utf8'); }
catch { console.error('Missing index.html.'); process.exit(1); }

const fail = (message) => failures.push(message);
if (!/<!doctype html>/i.test(html)) fail('index.html needs an HTML5 doctype.');
if (!/<html\b[^>]*\blang=["'][^"']+["']/i.test(html)) fail('The document needs a language.');
if (!/<title>[^<]+<\/title>/i.test(html)) fail('The document needs a title.');
if (!/<meta\b[^>]*\bname=["']viewport["']/i.test(html)) fail('The document needs a mobile viewport meta tag.');
if ([...html.matchAll(/<h1\b/gi)].length !== 1) fail('Use exactly one primary h1 heading.');
for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
  if (!/\balt=["'][^"']*["']/i.test(match[0])) fail(`Image is missing alt text: ${match[0]}`);
}
const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
if (new Set(ids).size !== ids.length) fail('HTML has duplicate id attributes.');

let checkedLinks = 0;
async function checkReference(reference, source) {
  if (/^(?:https?:|mailto:|tel:|data:|blob:)/i.test(reference)) return;
  if (reference.startsWith('//')) return;
  if (/^[a-z][a-z\d+.-]*:/i.test(reference)) {
    fail(`Unsupported URL scheme in ${source}: ${reference}`);
    return;
  }
  if (!reference || reference === '#') { fail(`Empty link in ${source}.`); return; }
  if (reference.startsWith('/')) { fail(`Use a relative path for GitHub Pages subpaths: ${reference}`); return; }
  const [beforeHash, hash] = reference.split('#');
  const pathname = beforeHash.split('?')[0];
  const destination = pathname ? resolve(dirname(source), decodeURIComponent(pathname)) : source;
  if (destination !== root && !destination.startsWith(root + sep)) { fail(`Path escapes project: ${reference}`); return; }
  try {
    const info = await stat(destination);
    if (!info.isFile()) { fail(`Link does not point to a file: ${reference}`); return; }
    checkedLinks++;
    if (hash && extname(destination) === '.html') {
      const targetHtml = destination === htmlPath ? html : await readFile(destination, 'utf8');
      const targetIds = [...targetHtml.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
      if (!targetIds.includes(decodeURIComponent(hash))) fail(`Missing anchor ${reference} in ${source}.`);
    }
  } catch { fail(`Missing local file: ${reference} (from ${source})`); }
}

for (const match of html.matchAll(/\b(?:href|src|poster)=["']([^"']*)["']/g)) await checkReference(match[1], htmlPath);
try {
  const cssPath = join(root, 'styles.css');
  const css = await readFile(cssPath, 'utf8');
  for (const match of css.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) await checkReference(match[1], cssPath);
} catch { fail('Missing styles.css.'); }

const scripts = ['script.js', ...(await readdir(join(root, 'scripts'))).filter((file) => file.endsWith('.mjs')).map((file) => `scripts/${file}`)];
for (const file of scripts) {
  const result = spawnSync(process.execPath, ['--check', join(root, file)], { encoding: 'utf8' });
  if (result.status !== 0) fail(`JavaScript syntax check failed: ${file}\n${result.stderr || result.error?.message || ''}`);
}

if (failures.length) {
  console.error(failures.map((message) => `- ${message}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Checked document metadata, image alt attributes, anchors, ${checkedLinks} local references, and ${scripts.length} JavaScript files.`);
}
