# Cosmic Worlds Web

Cosmic Worlds Web is a [Next.js](https://nextjs.org/) v12 project. It is the web
front-end to the Cosmic Worlds generative NFT art project, which can be found at
https://cosmicworlds.xyz

## Table of Contents:

- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Testing](#testing)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Configuration

The pages and API routes that read from the blockchain server-side
(`/api/recent`, `/api/supply`, `/api/metadata/[id]`) need an Alchemy API key:

```bash
# .env.local
ALCHEMY_API_KEY=your-key-here
```

Without it those routes return a 500 and the gallery pages render empty. The
same variable must be set in the hosting environment for deployed builds.

Which network the app points at is controlled by `currentNetwork` in
[utils/Constants.js](utils/Constants.js), which also holds the contract address,
RPC and explorer URLs, and Alchemy host per network.

## Deployment

Deployed on [Vercel](https://vercel.com/). Pushing to `main` updates the
production deployment.

## Testing

We use [Cypress](https://www.cypress.io/) for end-to-end testing, to validate
that pages render and display as expected.

```bash
npx cypress run
# or, for the interactive runner
npx cypress open
```

The dev server needs to be running first. To remove Cypress entirely, delete the
`cypress` folder and `cypress.config.js`, then:

```bash
npm uninstall -D cypress
```

Dependencies are kept up to date by [Renovate](https://github.com/marketplace/renovate),
configured in `renovate.json`. Delete that file to turn it off.
