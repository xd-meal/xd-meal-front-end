// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add('loadFixtures', () => {
  cy.fixture('diningList.json').as('fixtures:diningList');
  cy.fixture('orderList.json').as('fixtures:orderList');
  cy.fixture('userProfile.json').as('fixtures:userProfile');
  cy.fixture('orderListFromPost.json').as('fixtures:orderListFromPost');
});

Cypress.Commands.add('doLogin', function() {
  cy.loadFixtures();
  cy.setCookie('XD-MEAL-SESSION', '111111');
});
Cypress.Commands.add('defaultRouter', function() {
  cy.server();
  cy.route('/api/v1/orders', {
    dinings: [],
    ordered: [],
  });
  cy.route('api/v1/user/profile', '@fixtures:userProfile');
  cy.route('/api/v1/dining/list', {
    dinings: [],
    orders: [],
  });
  cy.route('/api/v1/myDish', {});
});
Cypress.Commands.add('orderRouter', function() {
  cy.server();
  cy.route('/api/v1/orders', '@fixtures:orderList');
  cy.route('api/v1/user/profile', '@fixtures:userProfile');
  cy.route('/api/v1/dining/list', '@fixtures:diningList');
  cy.route('post', '/api/v1/order', {}).as('postOrder');
  cy.route('/api/v1/myDish', {});
});
Cypress.Commands.add('emptyRouter', function() {
  cy.server();
  cy.route('/api/v1/orders', '@fixtures:orderList');
  cy.route('api/v1/user/profile', '@fixtures:userProfile');
  cy.route('post', '/api/v1/order', {}).as('postOrder');
  cy.route('/api/v1/dining/list', {
    dinings: [],
    orders: [],
  });
  cy.route('/api/v1/myDish', {});
});
