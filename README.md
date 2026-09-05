# Family Recipes

A static site for browsing the family's handwritten recipe cards. Each card is shown as a scanned image, with a transcript so the writing can be searched and cooked from.

## Local development

```sh
npm install
npm run dev
```

The app is configured for GitHub Pages, so local URLs start at `/family-recipes/`.

```sh
npm run build
npm run preview
```

## Deployment

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) and publishes to GitHub Pages with the official Astro action.

In the GitHub repository, set **Settings → Pages → Source** to **GitHub Actions**. After the first successful run the site will be at:

https://gundam-wing.github.io/family-recipes/

## Adding recipes

1. Put card images in `recipes/<category>/` (or `recipes/dessert/<kind>/`).
2. Name pages `recipe-name1.png`, `recipe-name2.png`, and so on.
3. Add matching entries in `src/data/transcriptions.json` (keys are paths relative to `recipes/`).

Images stay in `recipes/` and are copied into the site at build time.
