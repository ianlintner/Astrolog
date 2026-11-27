// Dependency-free static server: serves the repo at /astrolog/, 404 elsewhere.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const prefix = '/astrolog/';
const port = Number(process.env.PORT || 4187);
const contentTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
};

function notFound(res) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
}

const server = createServer(async (req, res) => {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    if (!pathname.startsWith(prefix)) {
        notFound(res);
        return;
    }

    let relative = decodeURIComponent(pathname.slice(prefix.length));
    if (!relative || relative.endsWith('/')) relative += 'index.html';
    const filePath = resolve(root, relative);
    if (filePath !== root && !filePath.startsWith(root + sep)) {
        notFound(res);
        return;
    }

    try {
        const info = await stat(filePath);
        if (!info.isFile()) {
            notFound(res);
            return;
        }
        const body = await readFile(filePath);
        res.writeHead(200, {
            'Content-Type': contentTypes[extname(filePath)] || 'application/octet-stream',
        });
        res.end(body);
    } catch {
        notFound(res);
    }
});

server.listen(port, '127.0.0.1', () => {
    console.log(`Serving ${prefix} from ${root} at http://127.0.0.1:${port}`);
});
