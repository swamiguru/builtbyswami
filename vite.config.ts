import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

/**
 * Long Press stats, derived from the daily files this repo already holds
 * (src/content/social/YYYY-MM-DD.json, one per issue, five stories each).
 * Read at build time so the numbers on /builds can never go stale by hand:
 * the daily runner commits a file, Vercel rebuilds, the count moves.
 */
function longPressStats() {
  const dir = path.resolve(__dirname, 'src/content/social');
  const days = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).map((f) => f.slice(0, 10)).sort()
    : [];
  return {
    issues: days.length,
    first: days[0] ?? '2026-07-12',
    last: days[days.length - 1] ?? '2026-07-12',
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const lp = longPressStats();
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      __LP_ISSUES__: JSON.stringify(lp.issues),
      __LP_FIRST__: JSON.stringify(lp.first),
      __LP_LAST__: JSON.stringify(lp.last),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
