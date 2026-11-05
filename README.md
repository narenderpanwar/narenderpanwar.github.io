# Portfolio

A DevOps-themed, recruiter-friendly portfolio for a DevOps Engineer. Built with React, TypeScript, Vite, Tailwind CSS v4 and Framer Motion.

## Design

- **Theme:** terminal / Kubernetes / Grafana. Monospace headings (JetBrains Mono), Inter body text, terminal-green "Running", Kubernetes blue and Grafana orange accents, faint CRT scanlines.
- **DevOps animations:**
  - boot-sequence intro (`[ OK ] Starting narender.service ...`), shown once per session; skippable with click, Enter, Esc or the Skip button, and disabled for reduced-motion users
  - scroll-progress bar styled like a pipeline, scroll-spy navbar with a sliding active pill, back-to-top button
  - hero: word-by-word name reveal, rotating "I automate ..." line, floating `{ } </> ⎈ k8s` tokens, parallax blobs, 3D-tilting terminal typing `kubectl get engineer -o yaml`
  - release-pipeline graph: a live production flow (git push → parallel test / build / terraform plan → image scan → manual approval → ECR push and terraform apply → atomic Helm deploy on EKS → verify → observability stack) with travelling packets, then loop; scrolling `[OK]/[INFO]/[WARN]` log stream
  - cards with 3D tilt and a cursor spotlight; magnetic buttons; cursor-following glow
  - masked heading reveals, blur-in sections, skill tier list that animates on filter
  - interactive CI/CD pipeline that auto-runs when scrolled into view (and "Run again")
  - contact card with a rotating gradient border
- Respects `prefers-reduced-motion`, responsive, keyboard accessible.

## Recruiter-friendly features

- Above the fold: name, role, **Open to work** badge, location, and a TL;DR card (experience, work mode, notice period, looking for, core stack).
- Sticky **Hire me** and **Resume** buttons.
- Case studies in *Problem / What I did / Result* format, and a deliberately humble, tongue-in-cheek skills tier list (C+ / D / F) that ranks how often each tool is used.
- Verified certification cards (Credly links), plus a clear "What I'm looking for" and contact section.
- SEO and social meta tags and JSON-LD `Person` data in `index.html`; print stylesheet hides the nav.

## Quickstart

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

## Customising

All content lives in [`src/data/profile.ts`](src/data/profile.ts). Replace everything marked `TODO`:

- `profile`: GitHub URL (optional; hidden while empty) and resume path (put the PDF in `public/`, e.g. `"/resume.pdf"`; Resume buttons stay hidden until set). Name, email, LinkedIn and location are already filled in. No phone number is stored anywhere in the project; the contact section offers LinkedIn and a click-to-copy email instead.
- `availability`: notice period and the roles you want.
- `stats`, `projects`, `credentials`: use real, defensible numbers.
- `skillGroups`: rate each skill honestly.

Also update the name and keywords in `index.html` (title, description, JSON-LD).
Theme colours and fonts are defined in `src/index.css` under `@theme`.

## Tests

```bash
npm test                # run once
npm run test:coverage   # with coverage report
```

Pure logic is in `src/lib/helpers.ts`; `src/App.test.tsx` covers rendering, recruiter facts, resume link behaviour, and the interactive pipeline and terminal.

## Deploy

`npm run build` outputs a static site in `dist/`.

**GitHub Pages (free, no expiry):** `.github/workflows/deploy.yml` runs the tests, builds, and publishes `dist/` on every push to `main`.

1. Create a **public** repo named `<username>.github.io` (served at `https://<username>.github.io/`, no `base` change needed).
2. Push this project to its `main` branch.
3. In the repo, go to Settings → Pages → Source and choose **GitHub Actions**.

For a repo with any other name, set `base: "/<repo>/"` in `vite.config.ts`. Netlify, Vercel and Cloudflare Pages also work.

## Visitor counter

The footer shows total visits using the free [Abacus](https://abacus.jasoncameron.dev) counter API (no account or key). `src/lib/visitors.ts` counts each browser once (a `visit-counted` flag in localStorage), never counts `localhost` previews, and hides the line if the service is unreachable. To change or reset the counter, edit `COUNTER_PATH` in that file. Tests stub `fetch`, so they never hit the network.

## Google search (SEO)

`index.html` carries the canonical URL, Open Graph tags and `Person` JSON-LD; `public/robots.txt` and `public/sitemap.xml` are served from the site root. To get indexed, verify the site in [Google Search Console](https://search.google.com/search-console) (URL-prefix property `https://narenderpanwar.github.io/`), submit `sitemap.xml`, and use URL Inspection → Request indexing. If the site URL changes, update it in those three files.
