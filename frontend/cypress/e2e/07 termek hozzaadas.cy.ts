describe("Admin – Termék hozzáadása", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get(".menu-btn").click();
    cy.contains("Bejelentkezés").click();
    cy.get('input[type="email"]').type("admin@gmail.com");
    cy.get('input[type="password"]').type("Admin");
    cy.get(".login-btn").click();
    cy.get(".login-modal").should("not.exist");
    cy.visit("/products");
    cy.contains("Termék hozzáadása").click();
    cy.get(".additem-modal").should("be.visible");
  });

  it("Üres formmal nem lehet terméket hozzáadni", () => {
    cy.get(".additem-btn").click();
    cy.contains("A termék neve kötelező.").scrollIntoView().should("be.visible");
    cy.contains("Az ár megadása kötelező.").scrollIntoView().should("be.visible");
    cy.contains("A készlet megadása kötelező.").scrollIntoView().should("be.visible");
    cy.contains("Kép kiválasztása kötelező.").scrollIntoView().should("be.visible");
  });

  it("Túl rövid termék névvel hibaüzenet jelenik meg", () => {
    cy.get(".additem-content input").first().type("A");
    cy.get(".additem-btn").click();
    cy.contains("A termék neve legalább 2 karakter legyen.").scrollIntoView().should("be.visible");
  });

  it("Negatív árral hibaüzenet jelenik meg", () => {
    cy.get(".additem-content input").first().type("Új termék");
    cy.get('input[type="number"]').first().type("-50");
    cy.get(".additem-btn").click();
    cy.contains("Az ár érvénytelen").scrollIntoView().should("be.visible");
  });

  it("Negatív készlettel hibaüzenet jelenik meg", () => {
    cy.get(".additem-content input").first().type("Új termék");
    cy.get('input[type="number"]').first().type("1000");
    cy.get('input[type="number"]').last().type("-1");
    cy.get(".additem-btn").click();
    cy.contains("egész szám kell legyen").should("be.visible");
  });

  it("Kép nélkül nem lehet terméket hozzáadni", () => {
    cy.get(".additem-content input").first().type("Teljesen jó termék");
    cy.get('input[type="number"]').first().type("500");
    cy.get('input[type="number"]').last().type("10");
    cy.get(".additem-btn").click();
    cy.contains("Kép kiválasztása kötelező.").should("be.visible");
  });

  it("A modal bezárható a × gombbal", () => {
    cy.get(".additem-close").click();
    cy.get(".additem-modal").should("not.exist");
  });
});