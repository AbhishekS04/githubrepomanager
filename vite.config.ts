import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { IncomingMessage, ServerResponse } from 'http';

// --------------------------------------------------------------------------
// Auth middleware – exchanges GitHub OAuth code for access token
// --------------------------------------------------------------------------
const authMiddleware = (env: Record<string, string>) =>
  async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (req.method !== 'POST') return next();

    let body = '';
    req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
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
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            client_id: env.VITE_GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code,
          }),
        });

        const data = await response.json() as Record<string, string>;
        res.setHeader('Content-Type', 'application/json');

        if (data.error) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: data.error_description || data.error }));
          return;
        }

        res.statusCode = 200;
        res.end(JSON.stringify(data));
      } catch {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
  };

// --------------------------------------------------------------------------
// Telegram middleware – proxies zip uploads to Telegram Bot API
// --------------------------------------------------------------------------
const telegramMiddleware = (env: Record<string, string>) =>
  async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (req.method !== 'POST') return next();

    const botToken = env.TELEGRAM_BOT_TOKEN;
    const chatId = env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId || botToken === 'your_telegram_bot_token') {
      res.statusCode = 503;
      res.end(JSON.stringify({ ok: false, error: 'Telegram is not configured.' }));
      return;
    }

    try {
      // Read JSON body
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(chunk as Buffer);
      const body = JSON.parse(Buffer.concat(chunks).toString());
      const { owner, repo, token, meta } = body;

      if (!owner || !repo || !token) {
        res.statusCode = 400;
        res.end(JSON.stringify({ ok: false, error: 'Missing owner, repo, or token' }));
        return;
      }

      // Step 1: Get real default branch from GitHub (server-side, no CORS)
      const repoInfoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });

      if (!repoInfoRes.ok) {
        res.statusCode = 502;
        res.end(JSON.stringify({ ok: false, error: `GitHub repo info failed: ${repoInfoRes.status}` }));
        return;
      }

      const repoInfo = await repoInfoRes.json() as { default_branch: string };
      const defaultBranch = repoInfo.default_branch || 'main';

      // Step 2: Download zip from GitHub (server-side, no CORS)
      const zipRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/zipball/${defaultBranch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
          },
          redirect: 'follow',
        }
      );

      if (!zipRes.ok) {
        res.statusCode = 502;
        res.end(JSON.stringify({ ok: false, error: `GitHub zip download failed: ${zipRes.status}` }));
        return;
      }

      const zipArrayBuffer = await zipRes.arrayBuffer();
      const zipBuffer = Buffer.from(zipArrayBuffer);
      const fileSizeMb = (zipBuffer.byteLength / (1024 * 1024)).toFixed(1);

      if (zipBuffer.byteLength > 50 * 1024 * 1024) {
        res.statusCode = 413;
        res.end(JSON.stringify({ ok: false, error: `Repo zip is ${fileSizeMb} MB — exceeds Telegram's 50 MB limit.` }));
        return;
      }

      // Step 3: Build caption
      const sizeDisplay = zipBuffer.byteLength > 1024 * 1024
        ? `${fileSizeMb} MB`
        : `${Math.round(zipBuffer.byteLength / 1024)} KB`;

      const caption = [
        `🗂 *${meta?.fullName || `${owner}/${repo}`}*`,
        meta?.description ? `📝 ${meta.description}` : null,
        '',
        `🔒 Visibility: ${meta?.isPrivate ? 'Private' : 'Public'}`,
        meta?.language ? `💻 Language: ${meta.language}` : null,
        `⭐ Stars: ${meta?.stars ?? 0}`,
        `💾 Size: ${sizeDisplay}`,
        `🌿 Branch: ${defaultBranch}`,
        '',
        `🗑 Deleted on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`,
        `🤖 Backed up by RepoManager`,
      ].filter(Boolean).join('\n');

      // Step 4: Upload to Telegram
      const formData = new FormData();
      formData.append('chat_id', chatId);
      formData.append('document', new Blob([zipBuffer], { type: 'application/zip' }), `${repo}.zip`);
      formData.append('caption', caption);
      formData.append('parse_mode', 'Markdown');

      const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
        method: 'POST',
        body: formData,
      });

      const tgData = await telegramRes.json() as { ok: boolean; description?: string; result?: { message_id?: number } };

      res.setHeader('Content-Type', 'application/json');
      if (!tgData.ok) {
        res.statusCode = 502;
        res.end(JSON.stringify({ ok: false, error: tgData.description || 'Telegram API error' }));
        return;
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true, message_id: tgData.result?.message_id }));
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Internal server error';
      console.error('[/api/telegram] Error:', msg);
      res.statusCode = 500;
      res.end(JSON.stringify({ ok: false, error: msg }));
    }
  };

// --------------------------------------------------------------------------
// Vite plugin that wires both middlewares into the dev server
// --------------------------------------------------------------------------
const apiPlugin = (env: Record<string, string>) => ({
  name: 'api-middleware',
  configureServer(server: { middlewares: { use: (path: string, fn: any) => void } }) {
    server.middlewares.use('/api/auth', authMiddleware(env));
    server.middlewares.use('/api/telegram', telegramMiddleware(env));
  },
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), apiPlugin(env)],
  };
});
