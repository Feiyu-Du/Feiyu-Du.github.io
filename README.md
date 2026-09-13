# Feiyu Du — Academic Website

A lightweight, dependency-free academic website for [feiyu-du.github.io](https://feiyu-du.github.io/). It uses semantic HTML, responsive CSS, and minimal JavaScript; GitHub Pages can serve it directly from the `main` branch.

## Structure

```text
.
├── index.html                 # Page structure and biography
├── css/style.css              # All visual styling and responsive rules
├── js/main.js                 # JSON rendering, filters, and mobile navigation
├── data/
│   ├── news.json              # News entries
│   └── publications.json      # Publications and featured research
└── assets/
    ├── Feiyu_Du_CV.pdf        # Downloadable CV
    ├── profile.jpg            # Neutral placeholder; replace with your profile photo
    ├── profile-placeholder.svg
    ├── favicon.svg
    └── images/publications/   # Verified paper figures and neutral placeholders
```

## Common updates

### Change the profile photo

Replace `assets/profile.jpg` with your portrait-oriented JPEG, keeping the filename unchanged. A 4:5 image around 800 × 1000 px is ideal. The committed file is a neutral placeholder; if the JPEG is ever absent, the page also falls back to `assets/profile-placeholder.svg` automatically.

### Update the CV

Replace `assets/Feiyu_Du_CV.pdf` with the new PDF, keeping the filename unchanged.

### Add news

Edit `data/news.json` and add a new object at the top:

```json
{ "date": "Oct 2026", "text": "A concise, verified milestone." }
```

### Add a publication

Edit `data/publications.json`. Copy an existing object and update its fields. Use one of `multimodal`, `transfer`, or `quantum` for `category`, keep submissions labeled `Under Review`, and set `image` to a verified paper figure under `assets/images/publications/` or the neutral placeholder.

Links are optional and appear only when supplied:

```json
"links": {
  "Paper": "https://doi.org/...",
  "arXiv": "https://arxiv.org/abs/...",
  "Code": "https://github.com/...",
  "Project": "https://..."
}
```

Use only verified URLs. An empty object (`"links": {}`) displays no link buttons.

## Preview locally

Because content is loaded from JSON, open the site through a local server rather than double-clicking `index.html`:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## GitHub Pages deployment

1. Create or use the repository `Feiyu-Du/Feiyu-Du.github.io`.
2. Push these files to its `main` branch.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, then select **main** and **/(root)**.
5. Save. The site will appear at `https://feiyu-du.github.io/` after GitHub completes the deployment.

Future updates only require committing and pushing changes to `main`; Pages redeploys automatically.

## Privacy and provenance

Content was prepared from the supplied resume and public research profiles. The site intentionally omits phone/address information, citation counts, and the LinkedIn link because the resume contained no valid LinkedIn URL.
