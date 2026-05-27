import express from 'express';
import getDb from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

function generateCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

app.post('/api/shorten', (req, res) => {
  try {
    const rawUrl = req.body?.url;

    if (!rawUrl || typeof rawUrl !== 'string') {
      return res.status(400).json({ error: 'URL is required.' });
    }

    const trimmedUrl = rawUrl.trim();

    if (!trimmedUrl) {
      return res.status(400).json({ error: 'URL cannot be empty.' });
    }

    if (trimmedUrl.length > 2000) {
      return res
        .status(400)
        .json({ error: 'URL is too long (max 2000 characters).' });
    }

    if (!isValidUrl(trimmedUrl)) {
      return res.status(400).json({
        error: 'Invalid URL. Please include http:// or https://',
      });
    }

    const db = getDb();
    let code;
    let attempts = 0;

    do {
      code = generateCode();
      attempts += 1;
      if (attempts > 10) {
        return res
          .status(500)
          .json({ error: 'Failed to generate unique code. Try again.' });
      }
    } while (db.prepare('SELECT id FROM urls WHERE code = ?').get(code));

    db.prepare('INSERT INTO urls (code, long_url) VALUES (?, ?)').run(
      code,
      trimmedUrl
    );

    const protocol = process.env.NODE_ENV === 'production' ? 'https' : req.protocol;
    const baseUrl = `${protocol}://${req.get('host')}`;
    const shortUrl = `${baseUrl}/${code}`;

    return res.status(201).json({ shortCode: code, shortUrl });
  } catch (error) {
    console.error('Shorten error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.get('/:code', (req, res) => {
  const { code } = req.params;

  if (!code || code.length > 20) {
    return res.status(400).json({ error: 'Invalid short code.' });
  }

  try {
    const db = getDb();
    const row = db.prepare('SELECT long_url FROM urls WHERE code = ?').get(code);

    if (!row) {
      return res
        .status(404)
        .json({ error: `Short code "${code}" not found.` });
    }

    return res.redirect(302, row.long_url);
  } catch (error) {
    console.error('Redirect error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
