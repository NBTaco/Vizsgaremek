describe("Rendelés leadása", () => {
  const adminLogin = () => {
    cy.visit("/");
    cy.get(".menu-btn").click();
    cy.contains("Bejelentkezés").click();
    cy.get('input[type="email"]').type("admin@gmail.com");
    cy.get('input[type="password"]').type("Admin");
    cy.get(".login-btn").click();
    cy.get(".login-modal").should("not.exist");
  };

  it("Bejelentkezés nélkül a finalize oldal üzenetet mutat", () => {
    cy.clearLocalStorage();
    cy.visit("/finalize");
    cy.contains("be kell jelentkezned").should("be.visible");
  });

  it("Üres formmal nem lehet rendelést leadni", () => {
    adminLogin();
    cy.visit("/finalize");
    cy.get('button[type="submit"]').click();
    cy.contains("A név megadása kötelező.").should("be.visible");
    cy.contains("A telefonszám megadása kötelező.").should("be.visible");
    cy.contains("Az ország megadása kötelező.").should("be.visible");
    cy.contains("A város megadása kötelező.").should("be.visible");
    cy.contains("Az irányítószám megadása kötelező.").should("be.visible");
    cy.contains("Az utca megadása kötelező.").should("be.visible");
    cy.contains("A házszám megadása kötelező.").should("be.visible");
  });

  it("Egy szavas névvel (szóköz nélkül) hibaüzenet jelenik meg", () => {
    adminLogin();
    cy.visit("/finalize");
    cy.get('input[name="name"]').type("Egynevű");
    cy.get('input[name="phone"]').type("+36201234567");
    cy.get('input[name="country"]').type("Magyarország");
    cy.get('input[name="city"]').type("Budapest");
    cy.get('input[name="postalcode"]').type("1234");
    cy.get('input[name="street"]').type("Fő utca");
    cy.get('input[name="housenumber"]').type("12");
    cy.get('button[type="submit"]').click();
    cy.contains("tartalmaznia kell legalább egy szóközt").should("be.visible");
  });

  it("Érvénytelen telefonszámmal hibaüzenet jelenik meg", () => {
    adminLogin();
    cy.visit("/finalize");
    cy.get('input[name="name"]').type("Teszt Elek");
    cy.get('input[name="phone"]').type("nemszam");
    cy.get('input[name="country"]').type("Magyarország");
    cy.get('input[name="city"]').type("Budapest");
    cy.get('input[name="postalcode"]').type("1234");
    cy.get('input[name="street"]').type("Fő utca");
    cy.get('input[name="housenumber"]').type("12");
    cy.get('button[type="submit"]').click();
    cy.contains("Érvénytelen telefonszám").should("be.visible");
  });

  it("Szóközt tartalmazó telefonszámmal hibaüzenet jelenik meg", () => {
    adminLogin();
    cy.visit("/finalize");
    cy.get('input[name="name"]').type("Teszt Elek");
    cy.get('input[name="phone"]').type("+36 20 123 4567");
    cy.get('input[name="country"]').type("Magyarország");
    cy.get('input[name="city"]').type("Budapest");
    cy.get('input[name="postalcode"]').type("1234");
    cy.get('input[name="street"]').type("Fő utca");
    cy.get('input[name="housenumber"]').type("12");
    cy.get('button[type="submit"]').click();
    cy.contains("nem tartalmazhat szóközt").should("be.visible");
  });

  it("Érvénytelen irányítószámmal hibaüzenet jelenik meg", () => {
    adminLogin();
    cy.visit("/finalize");
    cy.get('input[name="name"]').type("Teszt Elek");
    cy.get('input[name="phone"]').type("+36201234567");
    cy.get('input[name="country"]').type("Magyarország");
    cy.get('input[name="city"]').type("Budapest");
    cy.get('input[name="postalcode"]').type("abc");
    cy.get('input[name="street"]').type("Fő utca");
    cy.get('input[name="housenumber"]').type("12");
    cy.get('button[type="submit"]').click();
    cy.contains("Az irányítószám csak számokat tartalmazhat").should("be.visible");
  });
});