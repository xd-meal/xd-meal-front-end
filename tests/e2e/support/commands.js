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

Cypress.Commands.add('doLogin', function() {
  cy.setCookie('XD-MEAL-SESSION', '111111');
});
Cypress.Commands.add('defaultRouter', function() {
  cy.server();
  cy.route('/api/v1/orders', {
    dinings: [],
    ordered: [],
  });
  cy.route('api/v1/user/profile', {
    config: {
      advance: false,
      randomBtn: false,
      buffetBtn: false,
    },
    avatar: '',
    username: '11',
  });
  cy.route('/api/v1/dining/list', {
    dinings: [],
    orders: [],
  });
  cy.route('/api/v1/myDish', {});
});
