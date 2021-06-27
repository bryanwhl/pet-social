const app = require("../server/schema.js");
const supertest = require("supertest");

const request = supertest(app);

test("duplicate users not allowed", (done) => {
  request
    .post("/graphql")
    .send({
      query: "mutation { addUser( username: 'admin' password: 'admin' confirmPassword: 'admin' email:'admin@gmail.com' accountType: 'email' givenName:'ad' familyName:'min') { id } }",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(400)
    .end(function (err, res) {
      expect(res.body).toBeInstanceOf(Object);
      expect(res.text)
      done();
    });
});

test("@ sign required for e-mail", (done) => {
  request
    .post("/graphql")
    .send({
      query: "mutation { addUser( username: 'admin1441' password: 'admin' confirmPassword: 'admin' email:'admingmail.com' accountType: 'email' givenName:'ad' familyName:'min') { id } }",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(400)
    .end(function (err, res) {
      expect(res.body).toBeInstanceOf(Object);
      expect(res.text)
      done();
    });
});

test("fetch users", (done) => {
  request
    .post("/graphql")
    .send({
      query: "{ allUsers{id} }",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      expect(res.body).toBeInstanceOf(Object);
      done();
    });
});