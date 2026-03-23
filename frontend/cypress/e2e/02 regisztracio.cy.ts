describe("Regisztráció", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get(".menu-btn").click();
    cy.contains("Regisztráció").click();
    cy.get(".registration-modal").should("be.visible");
  });

  it("Üres mezőkkel nem lehet regisztrálni", () => {
    cy.get(".registration-btn").click();
    cy.contains("Az email cím megadása kötelező.").should("be.visible");
    cy.contains("A felhasználónév megadása kötelező.").should("be.visible");
    cy.contains("A jelszó megadása kötelező.").should("be.visible");
  });

  it("Érvénytelen email formátummal hibaüzenet jelenik meg", () => {
    cy.get('input[type="email"]').type("nemvalidemail");
    cy.get(".registration-btn").click();
    cy.contains("Érvénytelen email cím formátum.").should("be.visible");
  });

  it("Túl rövid felhasználónévvel hibaüzenet jelenik meg", () => {
    cy.get('input[type="email"]').type("teszt@example.com");
    cy.get('input[type="text"]').type("ab");
    cy.get(".registration-btn").click();
    cy.contains("A felhasználónév legalább 3 karakter legyen.").should("be.visible");
  });

  it("Túl rövid jelszóval hibaüzenet jelenik meg", () => {
    cy.get('input[type="email"]').type("teszt@example.com");
    cy.get('input[type="text"]').type("teszt_user");
    cy.get('input[type="password"]').first().type("abc");
    cy.get(".registration-btn").click();
    cy.contains("A jelszó legalább 6 karakter legyen.").should("be.visible");
  });

  it("Nem egyező jelszavakkal hibaüzenet jelenik meg", () => {
    cy.get('input[type="email"]').type("teszt@example.com");
    cy.get('input[type="text"]').type("teszt_user");
    cy.get('input[type="password"]').first().type("jelszo123");
    cy.get('input[type="password"]').last().type("masikjelszo");
    cy.get(".registration-btn").click();
    cy.contains("A két jelszó nem egyezik meg.").should("be.visible");
  });

  it("Sikeres regisztráció egyedi adatokkal", () => {
    const unique = Date.now();
    cy.get('input[type="email"]').type(`teszt${unique}@example.com`);
    cy.get('input[type="text"]').type(`user${unique}`);
    cy.get('input[type="password"]').first().type("Jelszo123");
    cy.get('input[type="password"]').last().type("Jelszo123");
    cy.get(".registration-btn").click();
    cy.get(".registration-modal").should("not.exist");
    cy.window().its("localStorage").invoke("getItem", "token").should("not.be.null");
  });

  it("Mégse gombra kattintva bezárul a modal", () => {
    cy.get(".cancel-btn").click();
    cy.get(".registration-modal").should("not.exist");
  });
});