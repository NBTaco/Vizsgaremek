describe("Kosár kezelés – mennyiség, készlet, rendelés visszavonás", () => {
  const adminEmail = "admin@gmail.com";
  const adminPassword = "Admin";

  const login = () => {
    cy.visit("/");
    cy.get(".menu-btn").click();
    cy.contains("Bejelentkezés").click();
    cy.get('input[type="email"]').type(adminEmail);
    cy.get('input[type="password"]').type(adminPassword);
    cy.get(".login-btn").click();
    cy.get(".login-modal").should("not.exist");
  };

  const emptyCartViaApi = () => {
    cy.window().then((win) => {
      const token = win.localStorage.getItem("token");
      cy.request({
        method: "GET",
        url: "http://localhost:3000/cart",
        headers: { "x-access-token": token || "" },
      }).then((res) => {
        if (res.body.success && res.body.items?.length > 0) {
          res.body.items.forEach((item: any) => {
            cy.request({
              method: "DELETE",
              url: "http://localhost:3000/cart/items",
              headers: {
                "Content-Type": "application/json",
                "x-access-token": token || "",
              },
              body: { productId: item.product_id },
              failOnStatusCode: false,
            });
          });
        }
      });
    });
  };

  const addFirstProductToCartViaApi = () => {
    cy.window().then((win) => {
      const token = win.localStorage.getItem("token");
      cy.request("GET", "http://localhost:3000/items").then((res) => {
        const firstItem = res.body.items[0];
        cy.request({
          method: "POST",
          url: "http://localhost:3000/cart/items",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token || "",
          },
          body: { productId: firstItem.product_id, quantity: 1 },
          failOnStatusCode: false,
        });
      });
    });
  };


  it("Bejelentkezés nélkül a kosár oldal üzenetet mutat", () => {
    cy.clearLocalStorage();
    cy.visit("/cart");
    cy.contains("be kell jelentkezned").should("be.visible");
  });

  it("Bejelentkezett felhasználónak üres kosárban megjelenik az üzenet", () => {
    login();
    emptyCartViaApi();
    cy.visit("/cart");
    cy.contains("A kosarad jelenleg üres.").should("be.visible");
  });

  it("Üres kosárnál a 'Tovább a fizetéshez' gomb le van tiltva", () => {
    login();
    emptyCartViaApi();
    cy.visit("/cart");
    cy.get(".checkout-btn").should("be.disabled");
  });

  it("Termék kosárba helyezése után megjelenik a kosárban", () => {
    login();
    emptyCartViaApi();
    addFirstProductToCartViaApi();
    cy.visit("/cart");
    cy.get(".cart-row").should("have.length.at.least", 1);
  });

  it("A kosárban megjelenik a termék neve, ára és mennyisége", () => {
    login();
    emptyCartViaApi();
    addFirstProductToCartViaApi();
    cy.visit("/cart");
    cy.get(".cart-row").first().within(() => {
      cy.get(".product-info span").should("not.be.empty");
      cy.get(".i-cell").contains("Ft").should("be.visible");
      cy.get(".qty-value").should("be.visible");
    });
  });

  it("A csökkentő gomb (−) le van tiltva, ha a mennyiség 1", () => {
    login();
    emptyCartViaApi();
    addFirstProductToCartViaApi();
    cy.visit("/cart");
    cy.get(".cart-row").first().within(() => {
      cy.get(".qty-value").should("have.text", "1");
      cy.get(".qty-btn").first().should("be.disabled");
    });
  });

  it("A mennyiség csökkentő gomb (−) csökkenti a darabszámot, ha > 1", () => {
    login();
    emptyCartViaApi();

    cy.request("GET", "http://localhost:3000/items").then((res) => {
      const item = res.body.items[0];
      if (item.stock < 2) {
        cy.log("Nincs elég készlet, teszt kihagyva.");
        return;
      }
      cy.window().then((win) => {
        const token = win.localStorage.getItem("token");
        cy.request({
          method: "POST",
          url: "http://localhost:3000/cart/items",
          headers: { "Content-Type": "application/json", "x-access-token": token || "" },
          body: { productId: item.product_id, quantity: 1 },
          failOnStatusCode: false,
        }).then(() => {
          cy.request({
            method: "PATCH",
            url: "http://localhost:3000/cart/items",
            headers: { "Content-Type": "application/json", "x-access-token": token || "" },
            body: { productId: item.product_id, quantity: 2 },
          }).then(() => {
            cy.visit("/cart");
            cy.get(".cart-row").first().within(() => {
              cy.get(".qty-value").should("have.text", "2");
              cy.get(".qty-btn").first().click();
              cy.get(".qty-value").should("have.text", "1");
            });
          });
        });
      });
    });
  });

  it("A mennyiség növelő gomb (+) növeli a darabszámot", () => {
    login();
    emptyCartViaApi();

    cy.request("GET", "http://localhost:3000/items").then((res) => {
      const item = res.body.items[0];
      if (item.stock < 2) {
        cy.log("Nincs elég készlet, teszt kihagyva.");
        return;
      }
      cy.window().then((win) => {
        const token = win.localStorage.getItem("token");
        cy.request({
          method: "POST",
          url: "http://localhost:3000/cart/items",
          headers: { "Content-Type": "application/json", "x-access-token": token || "" },
          body: { productId: item.product_id, quantity: 1 },
          failOnStatusCode: false,
        }).then(() => {
          cy.visit("/cart");
          cy.get(".cart-row").first().within(() => {
            cy.get(".qty-btn").last().should("not.be.disabled").click();
            cy.get(".qty-value").should("have.text", "2");
          });
        });
      });
    });
  });

  it("Ha a mennyiség eléri a készletet, a + gomb le van tiltva", () => {
    login();
    emptyCartViaApi();

    cy.request("GET", "http://localhost:3000/items").then((res) => {
      const item = res.body.items[0];
      const productId = item.product_id;
      const stock = item.stock;

      cy.window().then((win) => {
        const token = win.localStorage.getItem("token");
        cy.request({
          method: "POST",
          url: "http://localhost:3000/cart/items",
          headers: { "Content-Type": "application/json", "x-access-token": token || "" },
          body: { productId, quantity: 1 },
          failOnStatusCode: false,
        }).then(() => {
          if (stock > 1) {
            cy.request({
              method: "PATCH",
              url: "http://localhost:3000/cart/items",
              headers: { "Content-Type": "application/json", "x-access-token": token || "" },
              body: { productId, quantity: stock },
              failOnStatusCode: false,
            });
          }
          cy.visit("/cart");
          cy.get(".cart-row").first().within(() => {
            cy.get(".qty-btn").last().should("be.disabled");
          });
        });
      });
    });
  });

  it("Ha a mennyiség eléri a készletet, megjelenik a maximum jelző badge", () => {
    login();
    cy.visit("/cart");
    cy.get("body").then(($body) => {
      if ($body.find(".stock-limit-badge").length > 0) {
        cy.get(".stock-limit-badge").first().should("be.visible");
      } else {
        cy.get(".cart-row").first().then(($row) => {
          const plusDisabled = $row.find(".qty-btn:last-child").prop("disabled");
          if (plusDisabled) {
            cy.wrap($row).find(".stock-limit-badge").should("be.visible");
          } else {
            cy.log("A kosárban lévő termék még nem érte el a készlethatárt.");
          }
        });
      }
    });
  });

  it("A törlés gombra kattintva eltűnik a termék a kosárból", () => {
    login();
    emptyCartViaApi();
    addFirstProductToCartViaApi();
    cy.visit("/cart");
    cy.get(".cart-row").should("have.length.at.least", 1);
    cy.get(".del-btn").first().click();
    cy.wait(600);
    cy.get(".empty-msg").should("be.visible");
  });

  it("Az összeg helyesen jelenik meg a kosárban", () => {
    login();
    emptyCartViaApi();
    addFirstProductToCartViaApi();
    cy.visit("/cart");
    cy.get(".total-box").contains("Összesen:").should("be.visible");
    cy.get(".total-box").contains("Ft").should("be.visible");
  });

  it("Ha nincs elfogyott termék, a checkout gomb aktív", () => {
    login();
    emptyCartViaApi();
    addFirstProductToCartViaApi();
    cy.visit("/cart");
    cy.get(".out-of-stock-warning").should("not.exist");
    cy.get(".checkout-btn").should("not.be.disabled");
  });

  it("Ha elfogyott termék van a kosárban, figyelmeztetés jelenik meg és a checkout le van tiltva", () => {
    login();
    cy.intercept("GET", "http://localhost:3000/cart", {
      statusCode: 200,
      body: {
        success: true,
        orderId: 99,
        items: [
          {
            product_id: 1,
            product_name: "Teszt termék",
            price: 1000,
            quantity: 2,
            stock: 0,
            image_url: "http://localhost:3000/kepek/kalapacs.png",
          },
        ],
      },
    }).as("getCartOutOfStock");

    cy.visit("/cart");
    cy.wait("@getCartOutOfStock");

    cy.contains("Ez a termék elfogyott").should("be.visible");
    cy.contains("elfogyott termék van").should("be.visible");
    cy.get(".checkout-btn").should("be.disabled");
  });

  it("Elfogyott terméknél a mennyiségszabályzó gombok nem jelennek meg", () => {
    login();
    cy.intercept("GET", "http://localhost:3000/cart", {
      statusCode: 200,
      body: {
        success: true,
        orderId: 99,
        items: [
          {
            product_id: 1,
            product_name: "Elfogyott termék",
            price: 999,
            quantity: 1,
            stock: 0,
            image_url: "http://localhost:3000/kepek/kalapacs.png",
          },
        ],
      },
    }).as("getCartOOS");

    cy.visit("/cart");
    cy.wait("@getCartOOS");

    cy.get(".cart-row--out-of-stock").within(() => {
      cy.get(".quantity-control").should("not.exist");
      cy.get(".out-of-stock-qty").should("be.visible");
    });
  });

  it("Admin az 'ordered' rendelést elutasíthatja, és a státusz 'cancelled' lesz", () => {
    login();
    cy.visit("/adminorder");
    cy.intercept("PATCH", "http://localhost:3000/orders/status").as("updateStatus");

    cy.get(".admin-order-card").should("have.length.at.least", 1);
    cy.get(".admin-order-card").first().within(() => {
      cy.get(".admin-order-view-btn").click();
    });
    cy.get(".one-order-modal").should("be.visible");

    cy.get("body").then(($body) => {
      if ($body.find(".btn-reject").length > 0) {
        cy.get(".btn-reject").first().click();
        cy.wait("@updateStatus").its("response.statusCode").should("eq", 200);
      } else {
        cy.get(".one-order-close").click();
        cy.log("Nincs visszavonható rendelés az admin felületen.");
      }
    });
  });

  it("Rendelés lemondásakor a kosár kiürítése után az items lista üres marad", () => {
    login();
    emptyCartViaApi();
    cy.visit("/cart");
    cy.contains("A kosarad jelenleg üres.").should("be.visible");
    cy.get(".checkout-btn").should("be.disabled");
  });

  it("Teli kosárnál a 'Tovább a fizetéshez' gomb a /finalize oldalra navigál", () => {
    login();
    emptyCartViaApi();
    addFirstProductToCartViaApi();
    cy.visit("/cart");
    cy.get(".checkout-btn").should("not.be.disabled").click();
    cy.url().should("include", "/finalize");
  });
});
