describe("Bejelentkezés", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get(".menu-btn").click();
    cy.contains("Bejelentkezés").click();
    cy.get(".login-modal").should("be.visible");
  });

  it("Üres mezőkkel nem lehet bejelentkezni", () => {
    cy.get(".login-btn").click();
    cy.contains("Az email cím megadása kötelező.").should("be.visible");
  });

  it("Érvénytelen email formátummal hibaüzenet jelenik meg", () => {
    cy.get('input[type="email"]').type("nemvalidemail");
    cy.get('input[type="password"]').type("valamijelszo");
    cy.get(".login-btn").click();
    cy.contains("Érvénytelen email cím formátum.").should("be.visible");
  });

  it("Hiányzó jelszóval hibaüzenet jelenik meg", () => {
    cy.get('input[type="email"]').type("teszt@example.com");
    cy.get(".login-btn").click();
    cy.contains("A jelszó megadása kötelező.").should("be.visible");
  });

  it("Rossz jelszóval szerver hibaüzenet jelenik meg", () => {
    cy.get('input[type="email"]').type("admin@gmail.com");
    cy.get('input[type="password"]').type("rossz_jelszo");
    cy.get(".login-btn").click();
    cy.get(".field-error").should("be.visible");
  });

  it("Nem létező felhasználóval szerver hibaüzenet jelenik meg", () => {
    cy.get('input[type="email"]').type("nemletezik@example.com");
    cy.get('input[type="password"]').type("valamijelszo123");
    cy.get(".login-btn").click();
    cy.get(".field-error").should("be.visible");
  });

  it("Admin sikeresen bejelentkezik", () => {
    cy.get('input[type="email"]').type("admin@gmail.com");
    cy.get('input[type="password"]').type("Admin");
    cy.get(".login-btn").click();
    cy.get(".login-modal").should("not.exist");
    cy.window().its("localStorage").invoke("getItem", "token").should("not.be.null");
  });

  it("Mégse gombra kattintva bezárul a modal", () => {
    cy.get(".cancel-btn").click();
    cy.get(".login-modal").should("not.exist");
  });
});