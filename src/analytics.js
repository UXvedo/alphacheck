import {inject} from '@vercel/analytics';

// Cookieless Vercel Web Analytics (free tier). No-ops in `vite` dev; sends after `vite build`.
inject();
