/** @type {import('next').NextConfig} */
module.exports = {
    // Turbopack searches upward for a workspace root and finds a stray
    // package-lock.json outside this repo. Pin the root to this directory.
    turbopack: {
      root: __dirname,
    },
    async redirects() {
      return [
        {
          source: '/storefront-metadata',
          destination: '/storefront-metadata.json',
          permanent: true,
        },
      ]
    },
  }
