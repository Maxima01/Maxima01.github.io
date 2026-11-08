import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat, realpath } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const root = resolve(projectRoot, option('--dir', '.'));
const port = Number(option('--port', process.env.PORT || '4173'));
const base = `/${option('--base', '').replace(/^\/+|\/+$/g, '')}`.replace(/\/?$/, '/');
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8', '.mp4': 'video/mp4',
};
const allowed = new Set(['index.html', 'styles.css', 'script.js', '.nojekyll']);

if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Use a port between 1 and 65535.');

const server = createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      return res.end('Method not allowed');
    }
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (base !== '/' && pathname === base.slice(0, -1)) {
      res.writeHead(308, { Location: base });
      return res.end();
    }
    if (!pathname.startsWith(base)) throw new Error('Not found');
    const relativePath = pathname.slice(base.length) || 'index.html';
    if (!allowed.has(relativePath) && !relativePath.startsWith('assets/')) throw new Error('Not found');
    const file = await realpath(resolve(root, relativePath));
    const realRoot = await realpath(root);
    if (!file.startsWith(realRoot + sep)) throw new Error('Not found');
    const info = await stat(file);
    if (!info.isFile()) throw new Error('Not found');
    res.writeHead(200, {
      'Content-Type': types[extname(file)] || 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    });
    if (req.method === 'HEAD') return res.end();
    const stream = createReadStream(file);
    stream.on('error', () => res.destroy());
    stream.pipe(res);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Page not found');
  }
});

server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE' ? `Port ${port} is already in use. Try --port 4174.` : error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => console.log(`Portfolio: http://127.0.0.1:${port}${base}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
