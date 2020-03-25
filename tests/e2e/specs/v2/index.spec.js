describe('index page', () => {
  it('order link btn hidden when there is no dining', () => {
    cy.doLogin();
    cy.emptyRouter();
    cy.visit('/#/v2/main');
    cy.get('[data-for-test=orderBtn]').should('not.exist');
  });
  it('order link btn show when there is exist dining', () => {
    cy.doLogin();
    cy.orderRouter();
    cy.visit('/#/v2/main');
    cy.get('[data-for-test=orderBtn]').should('exist');
    cy.get('[data-for-test=orderBtn]')
      .find('a')
      .click();
  });
});
