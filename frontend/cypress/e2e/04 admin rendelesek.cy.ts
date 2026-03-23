describe("Admin – Rendelések kezelése", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get(".menu-btn").click();
    cy.contains("Bejelentkezés").click();
    cy.get('input[type="email"]').type("admin@gmail.com");
    cy.get('input[type="password"]').type("Admin");
    cy.get(".login-btn").click();
    cy.get(".login-modal").should("not.exist");
    cy.visit("/adminorder");
  });

  it("Admin bejelentkezés nélkül az adminorder oldal visszairányít", () => {
    cy.clearLocalStorage();
    cy.visit("/adminorder");
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });

  it("Admin az adminorder oldalon látja a rendelések listáját", () => {
    cy.get(".admin-orders-search input").should("be.visible");
    cy.get("body").should("be.visible");
  });

  it("Admin kereshet rendelések között", () => {
    cy.get(".admin-orders-search input").type("teszt");
    cy.get(".admin-orders-search input").should("have.value", "teszt");
  });
});