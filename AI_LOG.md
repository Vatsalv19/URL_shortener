# AI_LOG

## Entry 1
**Tool:** GitHub Copilot
**Asked:** "Draft an Express POST route that validates URLs and stores them in SQLite"
**Got:** Route structure with validation and collision checks
**What I did:** Adapted it to return consistent `{ error: "..." }` responses and a 201 on success.

## Entry 2
**Tool:** GitHub Copilot
**Asked:** "Provide a simple SQLite singleton pattern for better-sqlite3"
**Got:** Lazy-initialized connection with table creation
**What I did:** Used it as-is and kept the schema minimal.

## Entry 3
**Tool:** GitHub Copilot
**Asked:** "React form to call /api/shorten and show a short URL"
**Got:** Controlled input and fetch flow
**What I did:** Added loading state, copy button, and localStorage history.

## Entry 4
**Tool:** GitHub Copilot
**Asked:** "CSS layout idea for a clean single-page tool"
**Got:** Color variables and card layout
**What I did:** Reworked it into a warm palette with subtle gradients and a simple animation.

## Entry 5
**Tool:** GitHub Copilot
**Asked:** "How to proxy /api to a local Express server in Vite"
**Got:** Vite proxy config example
**What I did:** Added the proxy so the frontend can call /api without CORS issues in dev.

## Summary
GitHub Copilot helped me validate URL storage in SQLite, test API routes with curl, understand how the recent-links UI works, and draft a complete README. It also guided me on where the URLs are stored, how to view them.

