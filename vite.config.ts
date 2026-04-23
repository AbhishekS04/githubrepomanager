import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const apiFallbackPlugin = (env: Record<string, string>) => ({
  name: 'api-fallback',
  configureServer(server: any) {
    server.middlewares.use('/api/auth', async (req: any, res: any, next: any) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', async () => {
          try {
            const { code } = JSON.parse(body);
            
            if (!code) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Missing code' }));
              return;
            }

            const response = await fetch('https://github.com/login/oauth/access_token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify({
                client_id: env.VITE_GITHUB_CLIENT_ID,
                client_secret: env.GITHUB_CLIENT_SECRET,
                code,
              }),
            });

            const data = await response.json() as Record<string, any>;
            
            res.setHeader('Content-Type', 'application/json');
            
            if (data.error) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: data.error_description || data.error }));
              return;
            }

            res.statusCode = 200;
            res.end(JSON.stringify(data));
          } catch (error) {
            console.error('Error exchanging token:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal server error' }));
          }
        });
      } else {
        next();
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), apiFallbackPlugin(env)],
  };
});
