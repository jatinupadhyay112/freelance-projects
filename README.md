# MatchBook Arena

Premium sports venue booking prototype (React + Vite + Tailwind).

## Run locally / in Codespaces

```bash
npm install
npm run dev
```

Open the printed local URL (or the forwarded Codespace URL) in your browser.

## Build for deployment

```bash
npm run build
```

This outputs a static site in `dist/` — deployable to GitHub Pages, Vercel, Netlify, etc.

## Why the earlier version looked unstyled

The single `.jsx` file works instantly inside Claude.ai's sandbox because Tailwind is pre-configured there.
Outside that sandbox (e.g. a GitHub Codespace), Tailwind has to be installed and configured yourself —
that's what `tailwind.config.js`, `postcss.config.js`, and `src/index.css` in this project do.
`npm install` pulls in Tailwind itself; `npm run dev` compiles it.

## Notes

- Auth (OTP), payment, and data are simulated in-memory for this prototype — no real Firebase/Razorpay wired up yet.
- Swap in real backends by replacing the `verifyOtp`/`pay` functions and the in-memory `bookings` state in `src/App.jsx`.
