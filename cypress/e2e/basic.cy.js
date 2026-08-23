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
    cy.contains('button', 'Shuffle');
    cy.contains('button', 'Mint for free');
  })

  it('describes the world it drew', () => {
    // Derived from the seed the same way the contract derives them, so these
    // are the traits the token will carry once minted.
    cy.get('.cardTraits').first().within(() => {
      cy.contains(/^Seed: \d+/);
      cy.contains(/Planets: [0-5]/);
      cy.contains(/Stars: (sparse|distributed|dense)/);
      cy.contains(/Mountains: (soft|rugged|rocky)/);
      cy.contains(/Water: (calm|choppy|rough)/);
      cy.contains(/Clouds: (stratus|stratocumulus|cumulus)/);
    })
  })

  it('generates a new world on demand', () => {
    cy.get('.cardTraits').first().invoke('text').then((before) => {
      cy.contains('button', 'Shuffle').click();
      cy.get('.cardTraits').first().invoke('text').should('not.equal', before);
    })
  })
})
