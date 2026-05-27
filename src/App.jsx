import { useEffect, useState } from 'react';

const STORAGE_KEY = 'urlHistory';

export default function App() {
  const [inputUrl, setInputUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(saved)) {
        setHistory(saved);
      }
    } catch {
      setHistory([]);
    }
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setShortUrl('');

    const trimmedUrl = inputUrl.trim();
    if (!trimmedUrl) {
      setError('Please enter a URL.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
      } else {
        setShortUrl(data.shortUrl);
        const newEntry = { original: trimmedUrl, short: data.shortUrl };
        setHistory((prev) => {
          const updated = [newEntry, ...prev].slice(0, 5);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl).catch(() => {});
  }

  return (
    <div className="page">
      <header className="hero">
        <span className="badge">Mini URL Shortener</span>
        <h1>Short links that still feel human.</h1>
        <p>
          Paste a long URL, get a tidy redirect, and keep the last five links
          handy.
        </p>
      </header>

      <section className="card">
        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            <span className="field-label">Long URL</span>
            <input
              type="text"
              placeholder="https://example.com/very/long/url"
              value={inputUrl}
              onChange={(event) => setInputUrl(event.target.value)}
              disabled={loading}
              className="input"
            />
          </label>
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </form>

        {error && (
          <div className="notice error" role="alert">
            {error}
          </div>
        )}

        {shortUrl && (
          <div className="result">
            <div>
              <p className="result-label">Your short link</p>
              <a
                className="result-link"
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {shortUrl}
              </a>
            </div>
            <button type="button" className="ghost" onClick={copyToClipboard}>
              Copy
            </button>
          </div>
        )}
      </section>

      {history.length > 0 && (
        <section className="history">
          <h2>Recent links</h2>
          <ul>
            {history.map((item, index) => (
              <li key={`${item.short}-${index}`}>
                <a href={item.short} target="_blank" rel="noopener noreferrer">
                  {item.short}
                </a>
                <span>
                  {item.original.length > 54
                    ? `${item.original.slice(0, 54)}...`
                    : item.original}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="footnote">
        Backed by SQLite, built for the assignment spec.
      </footer>
    </div>
  );
}
