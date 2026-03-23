describe("Admin – Termék szerkesztése", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get(".menu-btn").click();
    cy.contains("Bejelentkezés").click();
    cy.get('input[type="email"]').type("admin@gmail.com");
    cy.get('input[type="password"]').type("Admin");
    cy.get(".login-btn").click();
    cy.get(".login-modal").should("not.exist");
    cy.visit("/products");
    cy.get(".product-card").first().within(() => {
      cy.contains("Megtekintés").click();
    });
    cy.contains("Termék szerkesztése").click();
    cy.get(".edititem-modal").should("be.visible");
  });

  it("Üres termék névvel nem lehet menteni", () => {
    cy.get(".edititem-content input").first()
      .focus()
      .type("{selectAll}{del}");
    cy.contains("Mentés").click();
    cy.contains("A termék neve nem lehet üres.").scrollIntoView().should("be.visible");
  });

  it("Túl rövid termék névvel hibaüzenet jelenik meg", () => {
    cy.get(".edititem-content input").first()
      .focus()
      .type("{selectAll}A");
    cy.contains("Mentés").click();
    cy.contains("A termék neve legalább 2 karakter legyen.").scrollIntoView().should("be.visible");
  });

  it("Negatív árral hibaüzenet jelenik meg", () => {
    cy.get('input[type="number"]').first()
      .invoke("val", "")
      .trigger("input")
      .trigger("change")
      .type("-100");
    cy.contains("Mentés").click();
    cy.contains("Az ár nem lehet negatív.").should("be.visible");
  });

  it("Negatív készlettel hibaüzenet jelenik meg", () => {
    cy.get('input[type="number"]').last()
      .invoke("val", "")
      .trigger("input")
      .trigger("change")
      .type("-5");
    cy.contains("Mentés").click();
    cy.contains("A készlet nem lehet negatív.").should("be.visible");
  });

  it("Tizedes törttel a készlet mezőben hibaüzenet jelenik meg", () => {
    cy.get('input[type="number"]').last()
      .invoke("val", "")
      .trigger("input")
      .trigger("change")
      .type("2.5");
    cy.contains("Mentés").click();
    cy.contains("A készlet csak egész szám lehet.").should("be.visible");
  });

  it("Törlés gombra kattintva megerősítés kérés jelenik meg", () => {
    cy.get(".edititem-delete-btn").click();
    cy.contains("Biztosan törlöd a terméket?").should("be.visible");
  });

  it("Törlés visszavonható a Mégse gombbal", () => {
    cy.get(".edititem-delete-btn").click();
    cy.contains("Biztosan törlöd a terméket?").should("be.visible");
    cy.get(".edititem-btn").contains("Mégse").click();
    cy.contains("Biztosan törlöd a terméket?").should("not.exist");
  });

  it("A modal bezárható a × gombbal", () => {
    cy.get(".edititem-close").click();
    cy.get(".edititem-modal").should("not.exist");
  });
});