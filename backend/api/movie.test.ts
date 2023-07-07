describe("/api/movie", () => {
  const apiUrl = Cypress.env("apiUrl");

  before(() => {
    cy.task("initDB");
  });

  it("GET / - Returns array of 4 elements", () => {
    cy.request({
      url: apiUrl + "/movie",
      method: "GET",
    })
      .its("body")
      .should("have.length", 4);
  });

  it("GET / - Returns all movies", () => {
    cy.request({
      url: apiUrl + "/movie",
      method: "GET",
    })
      .its("body")
      .should("deep.equal", [
        {
          title: "Avatar",
          seatAvailable: 44,
        },
        {
          title: "Frozen",
          seatAvailable: 1,
        },
        {
          title: "Spiderman",
          seatAvailable: 38,
        },
        {
          title: "Test",
          seatAvailable: 50,
        },
      ]);
  });

  it("GET /notFound - Returns Not Found with help body", () => {
    cy.request({
      url: apiUrl + "/movie/notFound",
      method: "GET",
      failOnStatusCode: false,
    }).should((res) => {
      expect(res.status).to.eq(404);
      expect(res.body).to.have.property("routes");
    });
  });
});
