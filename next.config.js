module.exports = {
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