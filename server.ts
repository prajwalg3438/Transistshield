import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './server/routes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Parse JSON payloads
  app.use(express.json());

  // Mount TransitShield REST API
  app.use('/api', apiRouter);

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', service: 'TransitShield Server', timestamp: new Date().toISOString() });
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    // Serve production static build
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Vite middleware for development (HMR & fast refresh)
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🛡️  TRANSITSHIELD BACKEND & FRONTEND SERVER STARTED`);
    console.log(`📍  URL: http://0.0.0.0:${PORT}`);
    console.log(`🚀  API: http://0.0.0.0:${PORT}/api/routes`);
    console.log(`📄  Master Doc: http://0.0.0.0:${PORT}/api/document/full-review`);
    console.log(`=======================================================`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start TransitShield server:', err);
  process.exit(1);
});
