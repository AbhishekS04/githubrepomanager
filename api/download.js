
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST to secure token handling.' });
  }

  // Vercel pre-parses the body if it's JSON
  const payload = req.body || (typeof req === 'string' ? JSON.parse(req) : req);
  const { owner, repo, token, branch } = payload;

  if (!owner || !repo || !token) {
    return res.status(400).json({ error: 'Missing owner, repo, or token' });
  }

  try {
    const defaultBranch = branch || 'main';
    const zipUrl = `https://api.github.com/repos/${owner}/${repo}/zipball/${defaultBranch}`;

    const response = await fetch(zipUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `GitHub download failed: ${response.statusText}` });
    }

    // Set headers to trigger browser download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${repo}-${defaultBranch}.zip"`);

    const arrayBuffer = await response.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error('Download proxy error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
