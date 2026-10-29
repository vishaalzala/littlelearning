# Little Learning 🌈

Free, no-signup preschool educational learning games (ages ~5). A static responsive HTML/CSS/JS website with large touch buttons, voice feedback, and offline-first assets.

## Games
Math, Picture Quiz, English, Find & Circle, Find Numbers, Match Numbers, Match Alphabets, Find Odd Numbers, Missing Alphabets, Two Missing Alphabets, Missing Numbers, Two Missing Numbers.

Workbook and Run & Learn are intentionally removed.

## Progress saving
Each game checkpoint is stored in the **same browser on the same device** using `localStorage`. Unfinished questions, score, stars, selected level and completed matches/blanks can be restored by selecting **Continue Playing** on the home page. Starting a game from its tile begins a new session for that game. Local browser data is not shared between devices, cleared browser data cannot be recovered, and moving to a new hostname changes the storage origin.

## Levels
Number ranges: Level 1 1–20; Level 2 10–30; Level 3 20–40; Level 4 30–50; Level 5 40–60; Level 6 50–70; Level 7 60–80; Level 8 70–90; Level 9 80–100; Level 10 1–100 challenge. Both "Two Missing" games always require two answers. Other missing-letter/number games increase blanks over levels. All modes support levels 1–10, and try to avoid repeats within the same level.

## Deployment
No build step, no package manager, no database. Import the GitHub repository into Vercel with Framework Preset **Other**, root `./`, and empty Build Command; Vercel serves `index.html` from the root. Each push to `main` deploys automatically. No Supabase needed.

Use the contents of this directory directly for GitHub; **do not upload the ZIP as a single repository file**. Google Analytics ID: `G-GM5VNJ5795`. Contact form sends to `hello@askzalas.com` through FormSubmit (requires internet).

`sw.js` caches the HTML, CSS, JS and manifest after first online load for offline play. Browser voice quality and offline voice availability depend on installed voices.
