# gitchart.github.io

> Documentation & landing page for [`@achrekarom/github-contribution-chart`](https://www.npmjs.com/package/@achrekarom/github-contribution-chart)

Live at **[gitchart.mytinkerlab.com](https://gitchart.mytinkerlab.com)**

---

## About

This repo contains the static documentation site for the `github-contribution-chart` npm package — a tiny, headless library that fetches GitHub contribution data via the GraphQL API and renders it as a heatmap using a zero-dependency React component.

The site itself is built with **pure HTML, CSS, and vanilla JS** — no frameworks, no build step.

## What's on the site

| Section | Description |
|---|---|
| **Hero** | Animated canvas heatmap banner with a one-liner install command |
| **Features** | GraphQL fetcher, React component, TypeScript support, full customisation |
| **Install** | npm / yarn / pnpm tabs with copy buttons |
| **Usage** | Three-step guide with syntax-highlighted code snippets |
| **API Reference** | Full prop & parameter tables for `fetchGitHubContributions` and `<GitHubContributionChart>` |
| **Token guide** | How to create a GitHub PAT with the minimal `read:user` scope |
| **Live Demo** | Interactive canvas demo — tweak color scheme, months, gap, and radius in real time |

## Project structure

```
gitchart.github.io/
├── index.html      # All content and markup
├── styles.css      # Design system + component styles
├── script.js       # Interactive demo, copy buttons, scroll effects
└── favicon.svg     # Site icon
```

## Running locally

No build step needed — just open `index.html` in a browser, or serve it with any static file server:

```bash
npx serve .
# or
python3 -m http.server
```

## Library links

- **npm**: [@achrekarom/github-contribution-chart](https://www.npmjs.com/package/@achrekarom/github-contribution-chart)
- **Source**: [github.com/achrekarom12/git-contribution-chart](https://github.com/achrekarom12/git-contribution-chart)

## License

MIT © [Om Achrekar](https://github.com/achrekarom12)
