# Legend Sync

Clash of Clans stats: Legend League history, ranked seasons, meta armies, clan legend summaries, battle logs and war analysis. Data comes from the ClashKing API.

## Stack
- Next.js 15 (App Router), React 19, TypeScript (strict)
- Tailwind v4, utilities only. The only CSS is theme tokens in `src/app/globals.css`
- Geist and Geist Mono via `next/font`
- Interactive or animated pieces are isolated client leaf components (`"use client"`). Everything else is a server component

## House rules
- No em-dashes in code, comments, markup or copy
- No Inter, no equal 3-column feature cards
- Numeric API fields may arrive as "NaN" or "Infinity" strings, always use `toNum()`
- Family IDs and base IDs are decimal strings, never cast to number
- Tags: use `tagToApi()` for API paths (the hash must be encoded) and `tagToSlug()` for our own URLs

## Run
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Phases
0. Foundation: theme, shell, API client, tag utils, search, dashboard
1. Player profile and Legends history
2. Player battle log
3. Ranked season insights
4. Meta armies
5. Clan legend summaries
6. War analytics
7. Polish: SEO, OG images, caching, error states, deploy
