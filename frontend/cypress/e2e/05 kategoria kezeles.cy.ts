describe("Admin – Kategória kezelés", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get(".menu-btn").click();
    cy.contains("Bejelentkezés").click();
    cy.get('input[type="email"]').type("admin@gmail.com");
    cy.get('input[type="password"]').type("Admin");
    cy.get(".login-btn").click();
    cy.get(".login-modal").should("not.exist");
    cy.visit("/products");
    cy.contains("Kategória kezelése").click();
    cy.get(".addcategory-modal").should("be.visible");
  });

  it("Üres névvel nem lehet kategóriát hozzáadni", () => {
    cy.get(".addcategory-btn").click();
    cy.get(".error-text").scrollIntoView().should("be.visible");
  });

  it("Túl rövid névvel (1 karakter) hibaüzenet jelenik meg", () => {
    cy.get(".addcategory-content input").type("A");
    cy.get(".addcategory-btn").click();
    cy.get(".error-text").scrollIntoView().should("be.visible");
  });

  it("Érvényes névvel kategória sikeresen hozzáadható", () => {
    const catName = `Teszt ${Date.now()}`;
    cy.get(".addcategory-content input").type(catName);
    cy.get(".addcategory-btn").click();
    cy.get(".error-text").should("not.exist");
    cy.get(".category-table").contains(catName).scrollIntoView().should("be.visible");
  });

  it("Kategória törlésekor megerősítés kérés jelenik meg", () => {
    cy.get(".category-table tbody tr").first().within(() => {
      cy.get(".delete-btn").click();
    });
    cy.contains("Biztosan törlöd?").scrollIntoView().should("be.visible");
  });

  it("Törlés visszavonható a Nem gombbal", () => {
    cy.get(".category-table tbody tr").first().within(() => {
      cy.get(".delete-btn").click();
    });
    cy.get(".cancel-small-btn").click();
    cy.contains("Biztosan törlöd?").should("not.exist");
  });

  it("Kategória törölhető az Igen gombbal", () => {
    const catName = `Törlendő ${Date.now()}`;
    cy.get(".addcategory-content input").type(catName);
    cy.get(".addcategory-btn").click();
    cy.get(".category-table").contains(catName).scrollIntoView().should("be.visible");
    cy.get(".category-table tbody tr").contains(catName).parent().within(() => {
      cy.get(".delete-btn").click();
    });
    cy.get(".delete-inline-confirm .delete-btn").click();
    cy.get(".category-table").contains(catName).should("not.exist");
  });

  it("A modal bezárható a × gombbal", () => {
    cy.get(".addcategory-close").click();
    cy.get(".addcategory-modal").should("not.exist");
  });
});