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

To mimic a PR preview build locally:

```sh
PATH_PREFIX=/family-recipes/preview/123 npm run build
npm run preview
```

## Deployment

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) publishes to GitHub Pages from `main` (required by the `github-pages` environment branch policy).

Pull request opens/syncs/closes run [`.github/workflows/preview-trigger.yml`](.github/workflows/preview-trigger.yml), which dispatches that same deploy on `main`. Each run builds the **canonical site** from `main` and every **open PR preview** into one artifact, then deploys atomically — so a preview cannot wipe production or another preview.

| Surface | URL |
| --- | --- |
| Production | https://gundam-wing.github.io/family-recipes/ |
| PR preview | https://gundam-wing.github.io/family-recipes/preview/`<pr-number>`/ |

Closed PRs drop out of the open-PR list on the next deploy, so their `/preview/<n>/` paths go away automatically. Successful preview rebuilds post (and update) a link comment on the PR.

In the GitHub repository, set **Settings → Pages → Source** to **GitHub Actions**.

## Adding recipes

1. Put card images in `recipes/<category>/` (or `recipes/dessert/<kind>/`).
2. Name pages `recipe-name1.png`, `recipe-name2.png`, and so on.
3. Add matching entries in `src/data/transcriptions.json` (keys are paths relative to `recipes/`).

Images stay in `recipes/` and are copied into the site at build time.
