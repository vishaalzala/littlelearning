# 🌈 Little Learning

A free, mobile-first educational game website for young children.

## Games
Math · Picture Quiz · English · Find & Circle · Find Numbers · Match Numbers · Match Alphabets · Find Odd Numbers · Missing Alphabets · **Two Missing Alphabets** · Missing Numbers · **Two Missing Numbers**.

**Workbook, Run & Learn and Find the Way are intentionally excluded.**

## Progress
Saved in the browser's `localStorage` on the **same device and hostname**; no account or database required. The **Continue Playing** button resumes the selected game, including partially completed worksheets, matches and drag-and-drop questions. Progress does not sync across devices and does not transfer automatically when switching from Hostinger's hostname to a new Vercel hostname.

## Run and deploy
This is a **static site** using only HTML, CSS and JavaScript, with no build step. Place `index.html`, `css/`, `js/`, `manifest.webmanifest` and `sw.js` in the repository root. Import the repository into Vercel using framework **Other**, root directory `./`, and an empty build command. Pushing changes to `main` automatically deploys updates once Git is connected.

**Before deploying**, upload the *contents* of the release ZIP, not the ZIP archive as one file. The game code and assets must be uploaded for the website to work.

## Number levels
L1 1–20; L2 10–30; L3 20–40; L4 30–50; L5 40–60; L6 50–70; L7 60–80; L8 70–90; L9 80–100; L10 1–100.

Contact form uses FormSubmit to deliver to `hello@askzalas.com`. Analytics uses Google tag `G-GM5VNJ5795`. Offline play works after the initial online visit when the service worker has cached static files.

### Privacy
No signup, player name or profile is needed to store progress. It is saved locally. Avoid collecting children's personal information in analytics or the contact form.

### Development
All updates should preserve existing games, keep questions non-repeating within a level, use large touch controls, provide browser speech synthesis, and support all 10 levels.