const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/app");
chai.use(chaiHttp);
const requester = chai.request(app).keepOpen();

describe("Health Api test suit", async function () {
  before(() => console.log("Health Api test Initiated"));

  it("Health Check", async function () {
    const response = await requester.get("/liveness");
    chai.expect(response).to.have.status(200);
    chai.expect(response.res.text).to.equal("working");
  });

  after(function () {
    requester.close();
    console.log("Health Api test Done");
  });
});
