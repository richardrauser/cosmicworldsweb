describe('home page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays the tagline', () => {
    cy.contains('On-chain, generative NFT art');
  })

  it('renders a generated world', () => {
    // The artboard draws the world client-side as an inline SVG data URI, so
    // this needs no wallet and no blockchain reads.
    cy.get('img[src^="data:image/svg+xml"]')
      .first()
      .should('be.visible')
      .and(($img) => {
        expect($img[0].naturalWidth).to.be.greaterThan(0);
      })
  })

  it('offers the mint actions', () => {
    cy.contains('button', 'Generate');
    cy.contains('button', 'Mint for free');
  })

  it('generates a new world on demand', () => {
    cy.contains('Random seed:').invoke('text').then((before) => {
      cy.contains('button', 'Generate').click();
      cy.contains('Random seed:').invoke('text').should('not.equal', before);
    })
  })
})
