export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId || botToken === 'your_telegram_bot_token') {
    return res.status(503).json({ ok: false, error: 'Telegram is not configured on this server.' });
  }

  // Vercel pre-parses the body if it's JSON
  const payload = req.body || (typeof req === 'string' ? JSON.parse(req) : req);
  const { owner, repo, token, meta, mode = 'delete' } = payload;

  if (!owner || !repo || !token) {
    return res.status(400).json({ ok: false, error: 'Missing owner, repo, or token' });
  }

  try {
    // Step 1: Get the real default branch from GitHub API (server-side, no CORS)
    const repoInfoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!repoInfoRes.ok) {
      return res.status(502).json({ ok: false, error: `GitHub repo info failed: ${repoInfoRes.status}` });
    }

    const repoInfo = await repoInfoRes.json();
    const defaultBranch = repoInfo.default_branch || 'main';

    // Step 2: Download the zip from GitHub (server-side, no CORS)
    const zipRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/zipball/${defaultBranch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      redirect: 'follow',
    });

    if (!zipRes.ok) {
      return res.status(502).json({ ok: false, error: `GitHub zip download failed: ${zipRes.status}` });
    }

    const zipArrayBuffer = await zipRes.arrayBuffer();
    const zipBuffer = Buffer.from(zipArrayBuffer);
    const fileSizeMb = (zipBuffer.byteLength / (1024 * 1024)).toFixed(1);

    // Step 3: Build Telegram caption
    const sizeDisplay = zipBuffer.byteLength > 1024 * 1024
      ? `${fileSizeMb} MB`
      : `${Math.round(zipBuffer.byteLength / 1024)} KB`;

    const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    
    const header = mode === 'delete' ? `🗑 *DELETED: ${meta?.fullName || `${owner}/${repo}`}*` 
                 : mode === 'leave'  ? `🤝 *CONTRIBUTION: ${meta?.fullName || `${owner}/${repo}`}*`
                 : mode === 'transfer' ? `📤 *TRANSFER: ${meta?.fullName || `${owner}/${repo}`}*`
                 : `📦 *BACKUP: ${meta?.fullName || `${owner}/${repo}`}*`;

    const footer = mode === 'delete' ? `❌ Removed on: ${dateStr} IST`
                 : mode === 'leave'  ? `✅ Left on: ${dateStr} IST`
                 : mode === 'transfer' ? `✅ Transfer initiated on: ${dateStr} IST`
                 : `✅ Backed up on: ${dateStr} IST`;

    const caption = [
      header,
      meta?.description ? `📝 ${meta.description}` : null,
      ``,
      `🔒 Visibility: ${meta?.isPrivate ? 'Private' : 'Public'}`,
      meta?.language ? `💻 Language: ${meta.language}` : null,
      `⭐ Stars: ${meta?.stars ?? 0}`,
      `💾 Size: ${sizeDisplay}`,
      `🌿 Branch: ${defaultBranch}`,
      ``,
      footer,
      `🤖 Powered by GitSweep`,
    ].filter(Boolean).join('\n');

    // Step 4: Upload to Telegram (50MB bot API limit)
    if (zipBuffer.byteLength > 50 * 1024 * 1024) {
      return res.status(413).json({
        ok: false,
        error: `Repo zip is ${fileSizeMb} MB — exceeds Telegram's 50 MB bot limit.`,
      });
    }

    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('document', new Blob([zipBuffer], { type: 'application/zip' }), `${repo}.zip`);
    formData.append('caption', caption);
    formData.append('parse_mode', 'Markdown');

    const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
      method: 'POST',
      body: formData,
    });

    const telegramData = await telegramRes.json();

    if (!telegramData.ok) {
      return res.status(502).json({ ok: false, error: telegramData.description || 'Telegram API error' });
    }

    return res.status(200).json({ ok: true, message_id: telegramData.result?.message_id });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    console.error('[/api/telegram] Error:', msg);
    return res.status(500).json({ ok: false, error: msg });
  }
}
