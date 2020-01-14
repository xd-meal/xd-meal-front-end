describe('login page', () => {
  it('click [index] tab should go `#/app/`', () => {
    cy.doLogin();
    cy.defaultRouter();
    cy.visit('/');
    cy.get('.footer-bar .index').click();
    cy.url().should('match', /#\/app\/$/);
  });
  it('click [pay] tab should go `#/app/pay`', () => {
    cy.doLogin();
    cy.defaultRouter();
    cy.visit('/');
    cy.get('.footer-bar .pay').click();
    cy.url().should('match', /#\/app\/pay$/);
  });
  it('click [profile] tab should go `#/app/profile`', () => {
    cy.doLogin();
    cy.defaultRouter();
    cy.visit('/');
    cy.get('.footer-bar .profile').click();
    cy.url().should('match', /#\/app\/profile$/);
  });
});
