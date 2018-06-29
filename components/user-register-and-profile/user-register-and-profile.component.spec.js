/// <reference types="Cypress" />
import Chance from 'chance';
const chance = new Chance();
const email = chance.email();
const password = '12345a';
const name = chance.name().replace(' ', '');
context('Actions', () => {
  before(() => {
    cy.visit('/register')
  })
  after(() => {})
  beforeEach(() => {
  })
  afterEach(() => {})
  describe('Register', () => {
    it('email exists error test', () => {
      const stub = cy.stub();
      cy.on('window:alert', stub);
      cy.get("[name='email']").type( 'thruthesky@gmail.com' );
      cy.get("[name='password']").type( password );
      cy.get("[name='nickname']").type( name );
      cy.get("form.register").find("[type='submit']").click();
      cy.get(".api-error[code='-240']");
    })
    it('register success test', () => {
      cy.get("[name='email']").clear().type( email );
      cy.get("form.register").find("[type='submit']").click();
      cy.get(".registered");
    })
  })
})
