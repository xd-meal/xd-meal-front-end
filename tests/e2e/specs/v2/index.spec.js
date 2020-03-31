import json from './../../fixtures/orderListFromPost.json';
describe('index page', () => {
  it('order link btn hidden when there is no dining', () => {
    cy.doLogin();
    cy.emptyRouter();
    cy.visit('/#/v2/main');
    cy.get('[data-for-test=orderBtn]').should('not.exist');
  });
  it('order link btn show when there is exist dining,then order something', () => {
    cy.doLogin();
    cy.orderRouter();
    cy.visit('/#/v2/main');
    // click order btn, then order page should show now
    cy.get('[data-for-test=orderBtn]').should('exist');
    cy.get('[data-for-test=orderBtn]')
      .find('a')
      .click();
    cy.contains('下周选饭');
    // orderHead should be not folded when first in
    cy.get('[data-for-test=orderHead]').should(
      'not.have.class',
      'v2-order_header_scroll',
    );
    // orderHead should be folded when scroll down
    cy.get('[data-for-test=orderBodyScroll]').scrollTo(0, 300);
    cy.wait(1000);
    cy.get('[data-for-test=orderBodyScroll]').scrollTo(0, 800);
    cy.wait(1000);
    cy.get('[data-for-test=orderBodyScroll]')
      .invoke('scrollTop')
      .should('eq', 800);
    cy.wait(1000);
    cy.get('[data-for-test=orderHead]').should(
      'have.class',
      'v2-order_header_scroll',
    );
    cy.wait(1000);
    // orderHead should be unfolded when scroll up
    cy.get('[data-for-test=orderBodyScroll]').scrollTo(0, 200);
    cy.wait(1000);
    cy.get('[data-for-test=orderBodyScroll]')
      .invoke('scrollTop')
      .should('eq', 200);

    cy.wait(1000);
    cy.get('[data-for-test=orderHead]').should(
      'have.class',
      'v2-order_header_scroll',
    );

    // click top date item should scroll to the specified item
    cy.get('[data-for-test=orderTopDateSlideContent0').click();
    cy.wait(300);
    cy.get('[data-for-test=orderBodyScroll]')
      .invoke('scrollTop')
      .should('eq', 0);
    cy.get('[data-for-test=dining]').each((item) => {
      item.find('[data-for-test=diningCheckbox]')[0].click();
    });
    cy.get('[data-for-test=orderSubmit]').click();
    cy.get('.cube-dialog')
      .contains('确认要这样恰饭嘛？')
      .should('not.have.attr', 'display', 'none');
    cy.route('/api/v1/myDish', {});
    cy.get('.cube-dialog .cube-dialog-btn.cube-dialog-btn_highlight').click();
    cy.wait('@postOrder').then((xhr) => {
      const reqArr = xhr.requestBody;
      expect(reqArr).to.deep.eql(json);
    });
    cy.url().should('match', /#\/v2\/main$/);
  });
});
