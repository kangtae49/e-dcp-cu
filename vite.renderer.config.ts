import { defineConfig } from 'vite';
import path from 'path';
import svgr from 'vite-plugin-svgr'
import viteTsconfigPaths from "vite-tsconfig-paths";
// import react from '@vitejs/plugin-react';
import react from '@vitejs/plugin-react-swc';
import type {IncomingMessage, ServerResponse} from "node:http";
import * as url from "node:url";
import * as fs from "node:fs";
import mime from "mime-types";

// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    react({
      tsDecorators: true,
      // babel: {
      //   plugins: [
      //     // 'babel-plugin-transform-typescript-metadata',
      //     ['babel-plugin-react-compiler'],
      //     // ['@babel/plugin-proposal-decorators', { legacy: true }],
      //     // ['@babel/plugin-proposal-class-properties', { loose: true }],
      //   ],
      // },
    }),
    svgr({
           include: "**/*.svg?react",
    }),
    viteTsconfigPaths(),
    {
      name: 'local-file-middleware',
      configureServer(server) {
        server.middlewares.use('/http_get', (req: IncomingMessage, res: ServerResponse) => {
          if (req.method !== 'GET') {
            res.statusCode = 405;
            res.end('Method Not Allowed');
            return;
          }
          const parsed = url.parse(req.url!, true);
          const filePath = parsed.query.path as string;

          try {
            fs.accessSync(filePath, fs.constants.F_OK);
          } catch(err) {
            res.writeHead(404);
            res.end(err.toString());
            return;
          }
          if (!filePath) {
            res.writeHead(404);
            res.end('File not found');
            return;
          }

          const stat = fs.statSync(filePath);
          const range = req.headers.range;
          const mimeType = mime.lookup(filePath)
          let contentType = 'application/octet-stream';
          if (mimeType) {
            contentType = mimeType;
          }
          if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
            const chunkSize = end - start + 1;

            const stream = fs.createReadStream(filePath, { start, end });
            res.writeHead(206, {
              'Content-Range': `bytes ${start}-${end}/${stat.size}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': chunkSize,
              'Content-Disposition': `inline; filename=${encodeURIComponent(path.basename(filePath))}`,
              'Content-Type': contentType,
            });
            stream.pipe(res);
          } else {
            const stream = fs.createReadStream(filePath);
            res.writeHead(200, {
              'Content-Length': stat.size,
              'Content-Disposition': `inline; filename=${encodeURIComponent(path.basename(filePath))}`,
              'Content-Type': contentType,
            });
            stream.pipe(res);
          }
        });

        server.middlewares.use('/local/file/write', (req: IncomingMessage, res: ServerResponse) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.end('Method Not Allowed');
            return;
          }
          const parsed = url.parse(req.url!, true);
          const filePath = parsed.query.path as string;

          const dir = path.dirname(filePath);
          fs.mkdirSync(dir, { recursive: true });

          let body = '';
          req.on('data', chunk => (body += chunk));
          req.on('end', () => {
            try {
              fs.writeFileSync(filePath, body, 'utf8');
              res.statusCode = 200;
              res.end('File saved successfully');
            } catch (e) {
              res.statusCode = 500;
              res.end('Failed to save file: ' + e.message);
            }
          });

        });

      },
    },
  ],
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, '..', 'src'),
    },
  },
  define: {
    global: 'window'
  }
});
