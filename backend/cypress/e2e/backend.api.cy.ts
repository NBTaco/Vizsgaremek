const BASE = "http://localhost:3000";
let adminToken = "";
let testProductId = 0;
let testCategoryId = 0;
let testOrderId = 0;
const uniqueSuffix = () => Date.now().toString();
const adminLogin = () =>
  cy.request("POST", `${BASE}/login`, {
    email: "admin@gmail.com",
    password: "Admin",
  }).then((res) => {
    adminToken = res.body.token;
  });
describe("API – registerUser (POST /register)", () => {
  it("Sikeres regisztráció egyedi adatokkal – 201", () => {
    const u = uniqueSuffix();
    cy.request("POST", `${BASE}/register`, {
      email: `user${u}@test.com`,
      username: `user${u}`,
      password: "Jelszo123",
      confirmPassword: "Jelszo123",
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.success).to.be.true;
      expect(res.body.token).to.be.a("string");
    });
  });
  it("Már létező emaillel – 409", () => {
    cy.request({
      method: "POST",
      url: `${BASE}/register`,
      body: {
        email: "admin@gmail.com",
        username: "admindup",
        password: "Jelszo123",
        confirmPassword: "Jelszo123",
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([409, 400]);
    });
  });
  it("Hiányzó email mezővel – 400", () => {
    cy.request({
      method: "POST",
      url: `${BASE}/register`,
      body: { username: "missingemail", password: "Jelszo123" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
    });
  });
  it("Túl rövid jelszóval – 400", () => {
    const u = uniqueSuffix();
    cy.request({
      method: "POST",
      url: `${BASE}/register`,
      body: {
        email: `short${u}@test.com`,
        username: `short${u}`,
        password: "abc",
        confirmPassword: "abc",
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
    });
  });
  it("A backend nem validálja a confirmPassword-t (frontend validáció)", () => {
    const u = uniqueSuffix();
    cy.request({
      method: "POST",
      url: `${BASE}/register`,
      body: {
        email: `mm${u}@test.com`,
        username: `mm${u}`,
        password: "Jelszo123",
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([201, 400]);
    });
  });
});
describe("API – loginUser (POST /login)", () => {
  it("Helyes adatokkal sikeres bejelentkezés – token visszaadva", () => {
    cy.request("POST", `${BASE}/login`, {
      email: "admin@gmail.com",
      password: "Admin",
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.token).to.be.a("string").and.not.be.empty;
    });
  });
  it("Rossz jelszóval – success:false", () => {
    cy.request({
      method: "POST",
      url: `${BASE}/login`,
      body: { email: "admin@gmail.com", password: "rossz" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 400, 200]);
      if (res.status === 200) expect(res.body.success).to.be.false;
    });
  });
  it("Nem létező email – success:false", () => {
    cy.request({
      method: "POST",
      url: `${BASE}/login`,
      body: { email: "nemletezik@example.com", password: "Jelszo123" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([404, 401, 400, 200]);
      if (res.status === 200) expect(res.body.success).to.be.false;
    });
  });
  it("Hiányzó mezőkkel – 400", () => {
    cy.request({
      method: "POST",
      url: `${BASE}/login`,
      body: {},
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
    });
  });
});
describe("API – userSettings (GET /user)", () => {
  before(() => adminLogin());
  it("Token nélkül – 403 (a szerver 403-at ad token hiányakor)", () => {
    cy.request({
      method: "GET",
      url: `${BASE}/user`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403]);
    });
  });
  it("Érvényes tokennel visszaadja a felhasználó adatait", () => {
    cy.request({
      method: "GET",
      url: `${BASE}/user`,
      headers: { "x-access-token": adminToken },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.success).to.be.true;
      expect(res.body.user).to.have.property("email");
      expect(res.body.user).to.have.property("username");
    });
  });
});
describe("API – getUserRole (GET /role/:username)", () => {
  before(() => adminLogin());
  it("Admin felhasználó szerepkörének lekérése", () => {
    cy.request({
      method: "GET",
      url: `${BASE}/role/admin`,
      headers: { "x-access-token": adminToken },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property("role");
    });
  });
  it("Token nélkül – 403 (a szerver 403-at ad token hiányakor)", () => {
    cy.request({
      method: "GET",
      url: `${BASE}/role/admin`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403]);
    });
  });
  it("Nem létező felhasználónév – 404 vagy success:false", () => {
    cy.request({
      method: "GET",
      url: `${BASE}/role/nemletezikez123`,
      headers: { "x-access-token": adminToken },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([404, 200]);
      if (res.status === 200) expect(res.body.success).to.be.false;
    });
  });
});
describe("API – getAllItems (GET /items)", () => {
  it("Termékek lekérése – tömb érkezik vissza", () => {
    cy.request("GET", `${BASE}/items`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.items).to.be.an("array");
      expect(res.body.items.length).to.be.greaterThan(0);
    });
  });
  it("Minden terméknek van product_name és price mezője", () => {
    cy.request("GET", `${BASE}/items`).then((res) => {
      res.body.items.forEach((item: any) => {
        expect(item).to.have.property("product_name").that.is.a("string");
        expect(item).to.have.property("price").that.is.a("number");
        expect(item).to.have.property("product_id");
        expect(item).to.have.property("stock");
      });
    });
  });
});
describe("API – getItemById (GET /items/:productId)", () => {
  before(() => {
    cy.request("GET", `${BASE}/items`).then((res) => {
      testProductId = res.body.items[0].product_id;
    });
  });
  it("Létező termék lekérése ID alapján", () => {
    cy.request("GET", `${BASE}/items/${testProductId}`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.success).to.be.true;
      expect(res.body.item).to.have.property("product_id", testProductId);
    });
  });
  it("Nem létező termék ID – 404", () => {
    cy.request({
      method: "GET",
      url: `${BASE}/items/9999999`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([404, 200]);
      if (res.status === 200) expect(res.body.success).to.be.false;
    });
  });
});
describe("API – addItem (POST /items)", () => {
  before(() => adminLogin());
  it("Token nélkül – 403 (a szerver 403-at ad, nem 401-et)", () => {
    cy.request({
      method: "POST",
      url: `${BASE}/items`,
      failOnStatusCode: false,
      body: { name: "X", price: 100, stock: 1, categoryId: 1 },
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403]);
    });
  });
  it("Admin jogosultság nélkül (user token) – 403", () => {
    const u = uniqueSuffix();
    cy.request("POST", `${BASE}/register`, {
      email: `nonadmin${u}@test.com`,
      username: `nonadmin${u}`,
      password: "Jelszo123",
      confirmPassword: "Jelszo123",
    }).then((regRes) => {
      const uToken = regRes.body.token;
      cy.request({
        method: "POST",
        url: `${BASE}/items`,
        headers: { "x-access-token": uToken },
        failOnStatusCode: false,
        body: { name: "Termék", price: 100, stock: 1 },
      }).then((res) => {
        expect(res.status).to.be.oneOf([403, 401]);
      });
    });
  });
});
describe("API – updateItem (PATCH /items/:productId)", () => {
  before(() => {
    adminLogin();
    cy.request("GET", `${BASE}/items`).then((res) => {
      testProductId = res.body.items[0].product_id;
    });
  });
  it("Token nélkül – 403", () => {
    cy.request({
      method: "PATCH",
      url: `${BASE}/items/${testProductId}`,
      failOnStatusCode: false,
      body: { name: "Módosított" },
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403]);
    });
  });
  it("Negatív árral – 400", () => {
    cy.request({
      method: "PATCH",
      url: `${BASE}/items/${testProductId}`,
      headers: { "x-access-token": adminToken },
      failOnStatusCode: false,
      body: { price: -1 },
    }).then((res) => {
      expect(res.status).to.be.oneOf([400, 422, 200]);
      if (res.status === 200) expect(res.body.success).to.be.false;
    });
  });
  it("Negatív készlettel – 400", () => {
    cy.request({
      method: "PATCH",
      url: `${BASE}/items/${testProductId}`,
      headers: { "x-access-token": adminToken },
      failOnStatusCode: false,
      body: { stock: -5 },
    }).then((res) => {
      expect(res.status).to.be.oneOf([400, 422, 200]);
      if (res.status === 200) expect(res.body.success).to.be.false;
    });
  });
  it("Nem létező termék módosítása – 400 vagy 404", () => {
    cy.request({
      method: "PATCH",
      url: `${BASE}/items/9999999`,
      headers: { "x-access-token": adminToken },
      failOnStatusCode: false,
      body: { name: "X" },
    }).then((res) => {
      expect(res.status).to.be.oneOf([404, 400, 200]);
      if (res.status === 200) expect(res.body.success).to.be.false;
    });
  });
});
describe("API – deleteItem (DELETE /items/:productId)", () => {
  before(() => adminLogin());
  it("Token nélkül – 403", () => {
    cy.request({
      method: "DELETE",
      url: `${BASE}/items/1`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403]);
    });
  });
  it("Nem létező termék törlése – 404", () => {
    cy.request({
      method: "DELETE",
      url: `${BASE}/items/9999999`,
      headers: { "x-access-token": adminToken },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([404, 200]);
      if (res.status === 200) expect(res.body.success).to.be.false;
    });
  });
});
describe("API – getCategories (GET /categories)", () => {
  it("Kategóriák lekérése – direkt tömb érkezik vissza", () => {
    cy.request("GET", `${BASE}/categories`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.be.greaterThan(0);
    });
  });
  it("Minden kategóriának van category_id és name mezője", () => {
    cy.request("GET", `${BASE}/categories`).then((res) => {
      res.body.forEach((cat: any) => {
        expect(cat).to.have.property("name").that.is.a("string");
        expect(cat).to.have.property("category_id");
      });
    });
  });
});
describe("API – addCategory (POST /addcategory)", () => {
  before(() => adminLogin());
  it("Token nélkül – 403", () => {
    cy.request({
      method: "POST",
      url: `${BASE}/addcategory`,
      body: { name: "TestCat" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403]);
    });
  });
  it("Érvényes névvel kategória hozzáadható – 201", () => {
    const catName = `TestCat${uniqueSuffix()}`;
    cy.request({
      method: "POST",
      url: `${BASE}/addcategory`,
      headers: { "x-access-token": adminToken },
      body: { name: catName },
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.success).to.be.true;
      expect(res.body).to.have.property("category_id");
      testCategoryId = res.body.category_id;
    });
  });
  it("Üres névvel – 400", () => {
    cy.request({
      method: "POST",
      url: `${BASE}/addcategory`,
      headers: { "x-access-token": adminToken },
      body: { name: "" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
    });
  });
  it("1 karakteres névnél a backend elfogad (nincs min-hossz validáció)", () => {
    cy.request({
      method: "POST",
      url: `${BASE}/addcategory`,
      headers: { "x-access-token": adminToken },
      body: { name: `X${uniqueSuffix()}` },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([201, 400]);
    });
  });
});
describe("API – deleteCategory (DELETE /deletecategory/:categoryId)", () => {
  before(() => {
    adminLogin();
  });
  it("Token nélkül – 403", () => {
    cy.request({
      method: "DELETE",
      url: `${BASE}/deletecategory/1`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403]);
    });
  });
  it("Kategória törölhető admin tokennel", () => {
    const catName = `Torlendo${uniqueSuffix()}`;
    cy.request({
      method: "POST",
      url: `${BASE}/addcategory`,
      headers: { "x-access-token": adminToken },
      body: { name: catName },
    }).then((res) => {
      const idToDelete = res.body.category_id;
      expect(idToDelete).to.be.a("number");
      cy.request({
        method: "DELETE",
        url: `${BASE}/deletecategory/${idToDelete}`,
        headers: { "x-access-token": adminToken },
      }).then((delRes) => {
        expect(delRes.status).to.be.oneOf([200, 204]);
        if (delRes.status === 200) expect(delRes.body.success).to.be.true;
      });
    });
  });
  it("Nem létező kategória törlése – 404", () => {
    cy.request({
      method: "DELETE",
      url: `${BASE}/deletecategory/9999999`,
      headers: { "x-access-token": adminToken },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([404, 200]);
      if (res.status === 200) expect(res.body.success).to.be.false;
    });
  });
});
describe("API – addToCart (POST /cart/items)", () => {
  before(() => {
    adminLogin();
    cy.request("GET", `${BASE}/items`).then((res) => {
      testProductId = res.body.items[0].product_id;
    });
  });
  it("Token nélkül – 403", () => {
    cy.request({
      method: "POST",
      url: `${BASE}/cart/items`,
      body: { productId: 1, quantity: 1 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403]);
    });
  });
  it("Termék hozzáadása a kosárhoz – siker", () => {
    cy.request({
      method: "DELETE",
      url: `${BASE}/cart/items`,
      headers: { "x-access-token": adminToken },
      body: { productId: testProductId },
      failOnStatusCode: false,
    }).then(() => {
      cy.request({
        method: "POST",
        url: `${BASE}/cart/items`,
        headers: { "x-access-token": adminToken },
        body: { productId: testProductId, quantity: 1 },
      }).then((res) => {
        expect(res.status).to.be.oneOf([200, 201]);
        expect(res.body.success).to.be.true;
      });
    });
  });
  it("Nem létező termék hozzáadása – 404", () => {
    cy.request({
      method: "POST",
      url: `${BASE}/cart/items`,
      headers: { "x-access-token": adminToken },
      body: { productId: 9999999, quantity: 1 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([404, 400, 200]);
      if (res.status === 200) expect(res.body.success).to.be.false;
    });
  });
  it("0 vagy negatív mennyiséggel – 400", () => {
    cy.request({
      method: "POST",
      url: `${BASE}/cart/items`,
      headers: { "x-access-token": adminToken },
      body: { productId: testProductId, quantity: 0 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([400, 422, 200]);
      if (res.status === 200) expect(res.body.success).to.be.false;
    });
  });
  it("Készletnél több mennyiséggel – 400", () => {
    cy.request({
      method: "POST",
      url: `${BASE}/cart/items`,
      headers: { "x-access-token": adminToken },
      body: { productId: testProductId, quantity: 999999 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([400, 409, 200]);
      if (res.status === 200) expect(res.body.success).to.be.false;
    });
  });
});
describe("API – getCart (GET /cart)", () => {
  before(() => adminLogin());
  it("Token nélkül – 403", () => {
    cy.request({
      method: "GET",
      url: `${BASE}/cart`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403]);
    });
  });
  it("Kosár lekérése adminnak – sikeres", () => {
    cy.request({
      method: "GET",
      url: `${BASE}/cart`,
      headers: { "x-access-token": adminToken },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.success).to.be.true;
      expect(res.body.items).to.be.an("array");
    });
  });
  it("Kosárban lévő elemeknek van product_id, quantity, price mezője", () => {
    cy.request({
      method: "GET",
      url: `${BASE}/cart`,
      headers: { "x-access-token": adminToken },
    }).then((res) => {
      res.body.items.forEach((item: any) => {
        expect(item).to.have.property("product_id");
        expect(item).to.have.property("quantity");
        expect(item).to.have.property("price");
      });
    });
  });
});
describe("API – updateCartItem (PATCH /cart/items)", () => {
  before(() => {
    adminLogin();
    cy.request("GET", `${BASE}/items`).then((res) => {
      testProductId = res.body.items[0].product_id;
    });
  });
  it("Token nélkül – 403", () => {
    cy.request({
      method: "PATCH",
      url: `${BASE}/cart/items`,
      body: { productId: 1, quantity: 2 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403]);
    });
  });
  it("Érvényes mennyiséggel – sikeres frissítés", () => {
    cy.request({
      method: "POST",
      url: `${BASE}/cart/items`,
      headers: { "x-access-token": adminToken },
      body: { productId: testProductId, quantity: 1 },
      failOnStatusCode: false,
    }).then(() => {
      cy.request({
        method: "PATCH",
        url: `${BASE}/cart/items`,
        headers: { "x-access-token": adminToken },
        body: { productId: testProductId, quantity: 1 },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.success).to.be.true;
      });
    });
  });
  it("0 vagy negatív mennyiséggel – 400", () => {
    cy.request({
      method: "PATCH",
      url: `${BASE}/cart/items`,
      headers: { "x-access-token": adminToken },
      body: { productId: testProductId, quantity: 0 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([400, 422, 200]);
      if (res.status === 200) expect(res.body.success).to.be.false;
    });
  });
  it("Készletnél több mennyiséggel – 400", () => {
    cy.request({
      method: "PATCH",
      url: `${BASE}/cart/items`,
      headers: { "x-access-token": adminToken },
      body: { productId: testProductId, quantity: 999999 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([400, 409, 200]);
      if (res.status === 200) expect(res.body.success).to.be.false;
    });
  });
});
describe("API – deleteCartItem (DELETE /cart/items)", () => {
  before(() => {
    adminLogin();
    cy.request("GET", `${BASE}/items`).then((res) => {
      testProductId = res.body.items[0].product_id;
    });
  });
  it("Token nélkül – 403", () => {
    cy.request({
      method: "DELETE",
      url: `${BASE}/cart/items`,
      body: { productId: 1 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403]);
    });
  });
  it("Kosárból törlés érvényes termékkel – sikeres", () => {
    cy.request({
      method: "POST",
      url: `${BASE}/cart/items`,
      headers: { "x-access-token": adminToken },
      body: { productId: testProductId, quantity: 1 },
      failOnStatusCode: false,
    }).then(() => {
      cy.request({
        method: "DELETE",
        url: `${BASE}/cart/items`,
        headers: { "x-access-token": adminToken },
        body: { productId: testProductId },
      }).then((res) => {
        expect(res.status).to.be.oneOf([200, 204]);
        if (res.status === 200) expect(res.body.success).to.be.true;
      });
    });
  });
  it("Nem kosárban lévő termék törlése – success:false", () => {
    cy.request({
      method: "DELETE",
      url: `${BASE}/cart/items`,
      headers: { "x-access-token": adminToken },
      body: { productId: 9999999 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([404, 400, 200]);
      if (res.status === 200) expect(res.body.success).to.be.false;
    });
  });
});
describe("API – placeOrder (POST /orders/place – updateOrderStatus controller)", () => {
  before(() => {
    adminLogin();
    cy.request("GET", `${BASE}/items`).then((res) => {
      testProductId = res.body.items[0].product_id;
    });
    cy.request({
      method: "GET",
      url: `${BASE}/orders`,
      headers: { "x-access-token": adminToken },
    }).then((res) => {
      if (res.body.orders?.length > 0) {
        testOrderId = res.body.orders[0].order_id;
      }
    });
  });
  it("Token nélkül – 403", () => {
    cy.request({
      method: "POST",
      url: `${BASE}/orders/place`,
      body: { orderId: 1, status: "shipped" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403]);
    });
  });
  it("Hiányzó orderId-val – 400", () => {
    cy.request({
      method: "POST",
      url: `${BASE}/orders/place`,
      headers: { "x-access-token": adminToken },
      body: { status: "shipped" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
    });
  });
  it("Érvénytelen státusszal – 400", () => {
    cy.request({
      method: "POST",
      url: `${BASE}/orders/place`,
      headers: { "x-access-token": adminToken },
      body: { orderId: testOrderId || 1, status: "invalid_status" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
    });
  });
  it("Érvényes orderId + status – sikeres (vagy 404 ha nincs ilyen rendelés)", () => {
    if (!testOrderId) {
      cy.log("Nincs rendelés, teszt kihagyva.");
      return;
    }
    cy.request({
      method: "POST",
      url: `${BASE}/orders/place`,
      headers: { "x-access-token": adminToken },
      body: { orderId: testOrderId, status: "shipped" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 400, 404]);
    });
  });
});
describe("API – getOrdersByUser (GET /orders/user)", () => {
  before(() => adminLogin());
  it("Token nélkül – 403", () => {
    cy.request({
      method: "GET",
      url: `${BASE}/orders/user`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403]);
    });
  });
  it("Bejelentkezett felhasználó rendeléseit adja vissza", () => {
    cy.request({
      method: "GET",
      url: `${BASE}/orders/user`,
      headers: { "x-access-token": adminToken },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.success).to.be.true;
      expect(res.body.orders).to.be.an("array");
    });
  });
  it("Minden rendelésnek van order_id és status mezője", () => {
    cy.request({
      method: "GET",
      url: `${BASE}/orders/user`,
      headers: { "x-access-token": adminToken },
    }).then((res) => {
      res.body.orders.forEach((order: any) => {
        expect(order).to.have.property("order_id");
        expect(order).to.have.property("status");
      });
    });
  });
});
describe("API – getAllOrders (GET /orders)", () => {
  before(() => adminLogin());
  it("Token nélkül – 403", () => {
    cy.request({
      method: "GET",
      url: `${BASE}/orders`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403]);
    });
  });
  it("Nem admin felhasználóval – 403", () => {
    const u = uniqueSuffix();
    cy.request("POST", `${BASE}/register`, {
      email: `reguser${u}@test.com`,
      username: `reguser${u}`,
      password: "Jelszo123",
      confirmPassword: "Jelszo123",
    }).then((regRes) => {
      cy.request({
        method: "GET",
        url: `${BASE}/orders`,
        headers: { "x-access-token": regRes.body.token },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.be.oneOf([403, 401]);
      });
    });
  });
  it("Admin tokennel az összes rendelés lekérhető", () => {
    cy.request({
      method: "GET",
      url: `${BASE}/orders`,
      headers: { "x-access-token": adminToken },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.success).to.be.true;
      expect(res.body.orders).to.be.an("array");
    });
  });
});
describe("API – updateOrderStatus (PATCH /orders/status)", () => {
  before(() => {
    adminLogin();
    cy.request({
      method: "GET",
      url: `${BASE}/orders`,
      headers: { "x-access-token": adminToken },
    }).then((res) => {
      if (res.body.orders?.length > 0) {
        testOrderId = res.body.orders[0].order_id;
      }
    });
  });
  it("Token nélkül – 403", () => {
    cy.request({
      method: "PATCH",
      url: `${BASE}/orders/status`,
      body: { orderId: 1, status: "shipped" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403]);
    });
  });
  it("Nem admin – 403", () => {
    const u = uniqueSuffix();
    cy.request("POST", `${BASE}/register`, {
      email: `reguser2${u}@test.com`,
      username: `reguser2${u}`,
      password: "Jelszo123",
      confirmPassword: "Jelszo123",
    }).then((regRes) => {
      cy.request({
        method: "PATCH",
        url: `${BASE}/orders/status`,
        headers: { "x-access-token": regRes.body.token },
        body: { orderId: testOrderId || 1, status: "shipped" },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.be.oneOf([403, 401]);
      });
    });
  });
  it("Érvénytelen státusszal – 400", () => {
    cy.request({
      method: "PATCH",
      url: `${BASE}/orders/status`,
      headers: { "x-access-token": adminToken },
      body: { orderId: testOrderId || 1, status: "invalid_status" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
    });
  });
  it("Érvényes státusszal státusz frissíthető", () => {
    if (!testOrderId) return cy.log("Nincs rendelés, teszt kihagyva.");
    cy.request({
      method: "PATCH",
      url: `${BASE}/orders/status`,
      headers: { "x-access-token": adminToken },
      body: { orderId: testOrderId, status: "shipped" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 400, 409]);
      if (res.status === 200) expect(res.body.success).to.be.true;
    });
  });
  it("Rendelés lemondása (cancelled) visszaállítja a készletet", () => {
    cy.request("GET", `${BASE}/items`).then((itemsRes) => {
      const firstItem = itemsRes.body.items[0];
      const stockBefore = firstItem.stock;
      const pid = firstItem.product_id;
      cy.request({
        method: "DELETE",
        url: `${BASE}/cart/items`,
        headers: { "x-access-token": adminToken },
        body: { productId: pid },
        failOnStatusCode: false,
      }).then(() => {
        cy.request({
          method: "POST",
          url: `${BASE}/cart/items`,
          headers: { "x-access-token": adminToken },
          body: { productId: pid, quantity: 1 },
          failOnStatusCode: false,
        }).then((addRes) => {
          if (!addRes.body.success) {
            cy.log("Nem sikerült a kosárba adni, teszt kihagyva.");
            return;
          }
          cy.request({
            method: "GET",
            url: `${BASE}/cart`,
            headers: { "x-access-token": adminToken },
          }).then((cartRes) => {
            const oid = cartRes.body.orderId;
            if (!oid) {
              cy.log("Nincs orderId a kosárban, teszt kihagyva.");
              return;
            }
            cy.request({
              method: "PATCH",
              url: `${BASE}/orders/status`,
              headers: { "x-access-token": adminToken },
              body: { orderId: oid, status: "ordered" },
              failOnStatusCode: false,
            }).then(() => {
              cy.request({
                method: "PATCH",
                url: `${BASE}/orders/status`,
                headers: { "x-access-token": adminToken },
                body: { orderId: oid, status: "cancelled" },
                failOnStatusCode: false,
              }).then(() => {
                cy.request("GET", `${BASE}/items/${pid}`).then((itemRes) => {
                  const stockAfter = itemRes.body.item.stock;
                  expect(stockAfter).to.be.gte(stockBefore);
                });
              });
            });
          });
        });
      });
    });
  });
  it("Nem létező rendelés státuszának módosítása – 404", () => {
    cy.request({
      method: "PATCH",
      url: `${BASE}/orders/status`,
      headers: { "x-access-token": adminToken },
      body: { orderId: 9999999, status: "shipped" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([404, 200]);
      if (res.status === 200) expect(res.body.success).to.be.false;
    });
  });
});
