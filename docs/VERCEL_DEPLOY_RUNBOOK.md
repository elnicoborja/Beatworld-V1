# Beat World — Vercel Deploy Runbook

Last updated: 2026-04-28

This is a click-by-click runbook for getting `beat-world-2026/` deployed to
Vercel and pointed at `beatworld.nicoborja.com`. Two paths:

- **Path A: GitHub import (recommended).** Push to GitHub once, every future
  push auto-deploys. Zero CLI.
- **Path B: Vercel CLI from this folder.** One-shot deploys from your terminal.
  Use if you don't want a GitHub repo for the contest entry.

The custom-domain section at the end applies to both paths.

---

## File-location reference (already in place — do not touch)

| File | Where | Purpose |
|---|---|---|
| `vercel.json` | `beat-world-2026/vercel.json` | Tells Vercel: framework=vite, build=`npm run build`, output=`dist`. |
| `vite.config.js` | `beat-world-2026/vite.config.js` | `appType: 'mpa'` is intentional — leave it. SPA mode would break asset 404 fallbacks. |
| `package.json` | `beat-world-2026/package.json` | `npm run build` is what Vercel runs. |
| `public/assets/...` | `beat-world-2026/public/assets/` | Static assets served at `/assets/...` after build. **All sprite + audio drops go here.** Do NOT use `assets/` at the project root — Vite will not find it. |
| `dist/` | `beat-world-2026/dist/` | Build output. Gitignored. Vercel rebuilds this on every deploy. |
| `.vercel/` | `beat-world-2026/.vercel/` (created on first link) | Local link file. Gitignored. Tells the CLI which Vercel project this folder belongs to. |

---

## Path A — GitHub import (recommended)

### A1. Push the project to GitHub (one-time)

If `beat-world-2026/` is not yet a GitHub repo:

1. Open GitHub Desktop or `git` in `C:\Users\nicob\OneDrive\Documentos\Claude\Projects\SOUND OS\04_SOUND_AGENCY\BEATWORLD-APP\beat-world-2026\`.
2. Confirm `.gitignore` excludes `node_modules/`, `dist/`, and `.vercel/`. If it doesn't:
   - Open `beat-world-2026/.gitignore` (create if missing) and ensure these three lines exist:
     ```
     node_modules/
     dist/
     .vercel/
     ```
3. `git init` if not already a repo, `git add .`, `git commit -m "Beat World 2.0 baseline"`.
4. On github.com → top-right `+` icon → **New repository**.
   - Owner: `elnicoborja` (your account)
   - Repository name: `beatworld` (or `beat-world-2026`)
   - Visibility: **Public** (Vibe Jam needs the source visible) or Private if you'd rather not.
   - Do NOT initialize with README, .gitignore, or license — repo is already populated locally.
   - Click **Create repository**.
5. Back in terminal/GitHub Desktop, follow the "push an existing repository" instructions GitHub shows — usually:
   ```
   git remote add origin https://github.com/elnicoborja/beatworld.git
   git branch -M main
   git push -u origin main
   ```

### A2. Import the GitHub repo into Vercel

1. Go to https://vercel.com/dashboard.
2. Top-right → **Add New** → **Project**.
3. **Import Git Repository** panel → find `elnicoborja/beatworld` in the list. If it's not there, click **Adjust GitHub App Permissions** to grant Vercel access.
4. Click **Import** on the row for that repo.
5. **Configure Project** screen — verify these fields:
   - **Project Name:** `beatworld` (or whatever — this becomes the default vercel.app subdomain)
   - **Framework Preset:** **Vite** (auto-detected from `vercel.json`).
   - **Root Directory:** click **Edit** if needed. For this repo the relevant root is `beat-world-2026/`. If your GitHub repo IS `beat-world-2026` at the top level, leave Root Directory at `./`. If you put `beat-world-2026/` inside a parent folder (e.g. `BEATWORLD-APP/beat-world-2026/`), set Root Directory to `beat-world-2026`.
   - **Build & Output Settings:** Leave defaults — `vercel.json` overrides them anyway.
     - Build Command: `npm run build` (auto)
     - Output Directory: `dist` (auto)
     - Install Command: `npm install` (auto)
   - **Environment Variables:** none required for Beat World — leave empty.
6. Click **Deploy**.
7. First deploy runs ~30–60s. When it finishes, Vercel shows a success screen with a confetti animation and the live URL (e.g. `beatworld-xxx.vercel.app`).
8. Click **Continue to Dashboard**.

### A3. Auto-deploy verification

From this point, every `git push origin main` triggers a new production deploy automatically. Pushes to other branches create preview deploys at unique URLs (great for QA). To confirm:

1. In the Vercel dashboard click the `beatworld` project tile.
2. **Deployments** tab — top row should be the deploy you just made, status `Ready`, branch `main`, commit hash matching your last push.
3. Click the deploy → **Visit** button → confirms the live URL works.

---

## Path B — Vercel CLI from this folder

Use this if you don't want a GitHub repo. Each deploy is a one-shot push from the folder.

### B1. Install + login (one-time)

In a terminal:

```
npm install -g vercel
vercel login
```

The `login` command opens your browser and asks you to confirm the device — pick **Continue with GitHub** (or whichever method matches your Vercel account), then return to the terminal.

### B2. Link the folder to a Vercel project (one-time)

In the project folder `C:\Users\nicob\OneDrive\Documentos\Claude\Projects\SOUND OS\04_SOUND_AGENCY\BEATWORLD-APP\beat-world-2026\`:

```
vercel link
```

It will prompt:

- `Set up "<folder>"?` → **Y**
- `Which scope should contain your project?` → pick your personal account (`elnicoborja` or whatever your Vercel scope is named)
- `Link to existing project?` → **N** for first deploy (or **Y** if you already created one in the dashboard).
- `What's your project's name?` → `beatworld`
- `In which directory is your code located?` → `./` (you're already in it)

This writes `.vercel/project.json` with `orgId` and `projectId`. That file is gitignored on purpose — never commit it.

### B3. Deploy to production

```
vercel --prod
```

Output shows the deploy progress and ends with `✅  Production: https://beatworld-xxx.vercel.app`. Visit to confirm.

For preview deploys (no `--prod`): `vercel` alone makes a preview URL — useful for testing asset drops without overwriting prod.

---

## Custom domain — `beatworld.nicoborja.com`

This part is the same regardless of Path A or B. Two halves: add the domain in Vercel, then add the DNS record at your registrar.

### C1. Add the domain in Vercel

1. https://vercel.com/dashboard → click `beatworld` project tile.
2. Top tabs → **Settings**.
3. Left sidebar → **Domains**.
4. **Add Domain** input (top of the page) → type `beatworld.nicoborja.com` → **Add**.
5. Vercel asks: **Recommended Configuration** screen showing one of:
   - **CNAME** record pointing `beatworld.nicoborja.com` to `cname.vercel-dns.com`
   - or an A record pointing to `76.76.21.21` (only if your DNS provider doesn't support CNAME at that level — most do).
6. Leave that tab open. You'll come back to it after DNS is set.

### C2. Add the DNS record at your registrar

Where is `nicoborja.com` registered? Common scenarios:

#### If on **Cloudflare**:
1. https://dash.cloudflare.com → click `nicoborja.com`.
2. Left sidebar → **DNS** → **Records**.
3. **Add record** button.
4. Fill:
   - **Type:** `CNAME`
   - **Name:** `beatworld` (Cloudflare auto-completes the rest as `beatworld.nicoborja.com`)
   - **Target:** `cname.vercel-dns.com`
   - **Proxy status:** **DNS only** (the grey cloud, NOT orange). Vercel handles SSL, Cloudflare's proxy will fight it.
   - **TTL:** Auto.
5. **Save**.

#### If on **Namecheap**:
1. https://ap.www.namecheap.com → **Domain List** → **Manage** next to `nicoborja.com`.
2. **Advanced DNS** tab.
3. **Add New Record**:
   - **Type:** `CNAME Record`
   - **Host:** `beatworld`
   - **Value:** `cname.vercel-dns.com.` (note the trailing dot — Namecheap requires it)
   - **TTL:** Automatic
4. Click the green checkmark to save.

#### If on **GoDaddy**:
1. https://dcc.godaddy.com → **My Products** → **DNS** next to `nicoborja.com`.
2. **Add** button under DNS Records.
3. Fill:
   - **Type:** `CNAME`
   - **Name:** `beatworld`
   - **Value:** `cname.vercel-dns.com`
   - **TTL:** 1 Hour (default)
4. **Save**.

#### If you don't remember:
- Open `nicoborja.com` in a terminal: `nslookup -type=ns nicoborja.com` shows the nameservers, which usually identify the registrar.
- Or check your email inbox for "Domain Renewal" — the sender is your registrar.

### C3. Verify DNS + SSL

1. Back in Vercel → **Settings** → **Domains** → the `beatworld.nicoborja.com` row should turn green within 1–10 minutes (DNS propagation). The **Issue Certificate** step happens automatically right after.
2. Test: open https://beatworld.nicoborja.com in an incognito window. Should serve the latest deploy.
3. If it doesn't propagate within 30 min: in Vercel, the row will show a red icon with the specific error (most common: proxy still on at Cloudflare, or wrong CNAME target).

---

## Asset deployment workflow (the routine you'll repeat)

Once the project is linked (Path A or B), the loop is:

1. Drop new sprite PNGs in `beat-world-2026/public/assets/sprites/...`.
2. Drop new audio MP3s in `beat-world-2026/public/assets/audio/level-XX-xxx/`.
3. **Path A:** `git add .` → `git commit -m "audio: NYC samples"` → `git push`. Vercel auto-deploys in ~45s.
   **Path B:** `vercel --prod` from the project folder.
4. Open `https://beatworld.nicoborja.com` in incognito. Hard-refresh (`Ctrl+Shift+R` Windows, `Cmd+Shift+R` Mac) so the browser doesn't serve cached `index.html`.

---

## Troubleshooting

**"EPERM unlink dist/..."** when running `npm run build` on Windows.
- Cause: OneDrive holds a lock on files in `dist/` from the previous build.
- Fix: Either pause OneDrive sync for the project folder before building, or run `rm -rf dist/` (PowerShell: `Remove-Item -Recurse -Force dist`) then build again.
- Workaround used in dev: `npx vite build --outDir /tmp/bw-dist` writes outside the OneDrive folder.

**Live URL serves stale assets after deploy.**
- Cause: browser cache.
- Fix: hard-refresh in incognito, or DevTools → Network tab → check "Disable cache" while reloading.

**"Build failed: command not found: vite"** on Vercel.
- Cause: `vite` isn't in `dependencies` (only `devDependencies`), and Vercel's prod install sometimes skips devDeps.
- Fix: in `package.json`, ensure either `vite` lives under `dependencies` OR Vercel's project settings → **General** → **Node.js Version** is 20+ AND **Install Command** is left at default `npm install` (which DOES install devDeps for builds).

**404 on `/assets/sprites/...`** in production but works locally.
- Cause: file was placed at `assets/...` (project root) instead of `public/assets/...`.
- Fix: move it to `public/assets/...` and redeploy. Vite only copies files in `public/` to the served root.

**Custom domain shows Vercel "Domain not configured" page.**
- Cause: DNS resolves to Vercel but Vercel's project doesn't claim the domain yet.
- Fix: in Vercel → Settings → Domains, click **Refresh** on the domain row. If still failing, remove and re-add it.

---

## Quick-reference table — what triggers what

| Action | Triggers | Time to live |
|---|---|---|
| `git push` to `main` (Path A) | Production deploy | ~45s |
| `git push` to any other branch (Path A) | Preview deploy at unique URL | ~45s |
| `vercel --prod` (Path B) | Production deploy | ~45s |
| `vercel` without `--prod` (Path B) | Preview deploy | ~45s |
| Vercel dashboard → Deployments → ⋮ → **Redeploy** | Re-runs build of an existing deploy without new commits | ~45s |
| Vercel dashboard → Deployments → ⋮ → **Promote to Production** | Makes an existing preview the new prod | instant |

---

## Where to look first if something is wrong

1. Vercel → project → **Deployments** → top row → **View Build Logs**. 90% of failures are visible here.
2. Vercel → project → **Settings** → **Domains**. Red icon = DNS issue.
3. Browser DevTools → Network tab. Look for `/assets/...` 404s — those are missing-file issues, not build issues.
