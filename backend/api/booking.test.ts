describe("/api/booking", () => {
  const route = Cypress.env("apiUrl") + "/booking";
  let id: any = undefined;

  before(() => {
    cy.task("initDB");
  });

  it("GET / - Returns array of 1 elements (bookings)", () => {
    cy.request({
      url: route,
      method: "GET",
    })
      .its("body")
      .should("have.length", 1);
  });

  it("GET / - Returns the expected bookings", () => {
    cy.request({
      url: route,
      method: "GET",
    })
      .its("body")
      .should("deep.equal", [
        {
          id: 1,
          customer: {
            email: "Cayla68@test.dev",
            name: "Robin Rowe",
            type: "Normal",
            discountRate: 0,
          },
          title: "Avatar",
          tickets: [
            {
              type: "adult",
              qty: 1,
            },
            {
              type: "child",
              qty: 2,
            },
          ],
        },
      ]);
  });

  it("POST / - Create new valid booking", () => {
    cy.request({
      url: route,
      method: "POST",
      body: {
        customer: {
          email: "test@test.com",
          name: "Name",
          type: "Normal",
        },
        title: "Spiderman",
        tickets: [
          {
            type: "Family4",
            qty: 2,
          },
          {
            type: "child",
            qty: 2,
          },
        ],
      },
    }).as("req");

    cy.get("@req").should(function (res: any) {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property("id");
    });

    cy.get("@req").then(function (res: any) {
      // WARN: It workds but it is not recommended. Look for an improvment.
      // Look for a way to pass id to the next test. Using alias didn't work for me.
      id = res.body.id;
      // cy.wrap(res.body).its("id").as(id)
    });
  });

  it("GET /<id> - Returns the newly creaeted booking", () => {
    cy.request({
      url: route + `/${id}`,
      method: "GET",
    }).should((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property("id").eq(id);
    });
  });

  it("GET /invalidBookingID - Returns error", () => {
    cy.request({
      url: route + "/invalidBookingID",
      method: "GET",
      failOnStatusCode: false,
    }).should((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.deep.eq({
        error: {
          msg: "Invalid data",
          details: {
            issues: [
              {
                path: [],
                msg: "Invalid input",
              },
            ],
          },
        },
      });
    });
  });

  it("GET /1000 - Returns Not Found booking", () => {
    cy.request({
      url: route + "/1000",
      method: "GET",
      failOnStatusCode: false,
    }).should((res) => {
      expect(res.status).to.eq(404);
      expect(res.body).to.deep.eq({
        error: {
          msg: "Booking with ID = 1000 is not found!",
          details: {
            resourceType: "booking",
          },
        },
      });
    });
  });

  it("GET /1/notFound - Returns Not Found with help body", () => {
    cy.request({
      url: route + "/1/notFound",
      method: "GET",
      failOnStatusCode: false,
    }).should((res) => {
      expect(res.status).to.eq(404);
      expect(res.body).to.have.property("routes");
    });
  });
});
