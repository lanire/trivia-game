# Trivia Quest 🏆

A Material Design trivia game powered by the Open Trivia DB API.

## Features
- 20 categories to choose from
- 3 difficulty levels (Easy / Medium / Hard / Any)
- 10 multiple-choice questions per round
- Animated answer feedback
- Score tracking & results breakdown
- 100% client-side — no backend needed

## Deploy to Netlify (Free) — 2 ways

### Option A: Drag & Drop (Fastest — no account needed for a preview)

1. Go to [netlify.com/drop](https://netlify.com/drop)
2. Drag the entire `trivia-game` folder onto the page
3. Your app is live instantly at a `*.netlify.app` URL!
   - To make it permanent, create a free Netlify account and "claim" the site.

### Option B: Git + Netlify (Recommended for ongoing updates)

1. Push this folder to a GitHub/GitLab repo
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**
3. Connect your repo
4. Leave all build settings blank (no build command, publish directory = `.`)
5. Click **Deploy** — done!

Your site will be at `https://your-site-name.netlify.app` (free custom subdomain).

## Local Development

Just open `index.html` in any browser — no build step required.

> **Note**: Some browsers block cross-origin API calls when opening files via `file://`.
> If questions don't load locally, use a simple local server:
> ```
> npx serve .
> # or
> python3 -m http.server 8080
> ```
