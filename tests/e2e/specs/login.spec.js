describe('login page', () => {
  it('No cookie should go to login page', () => {
    cy.visit('/');
    cy.url().should('include', '#/login');
  });
  it('Cookie which contains XD-MEAL-SESSION should go to login page', () => {
    cy.doLogin();
    cy.defaultRouter();
    cy.visit('/');
    cy.url().should('include', '#/app');
  });
});
