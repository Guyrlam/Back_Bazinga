import request from "supertest";

import App from "../../src/app";
import UserDB from "../../src/models/user";
const app = new App();
const db = new UserDB();
describe("User routes", () => {
    let id:string="";
    test("POST-/api/users/register", async () => {
        const res = await request(app.app).post("/api/users/register").send({
            name: "user",
            nick: "user",
            email: "user@email.com",
            password: "Password",
        });
        id=res.body._id
        expect(res.statusCode).toEqual(200);
    });
    test("POST=/api/users/login", async () => {
      const res = await request(app.app).post("/api/users/login").send({
          email: "user@email.com",
          password: "Password",
      }); 
      expect(res.statusCode).toEqual(200);
    });
    test("POST-/api/users/register ...Exist", async () => {
        const res = await request(app.app).post("/api/users/register").send({
            name: "user",
            nick: "user",
            email: "user@email.com",
            password: "Password",
        });
        expect(res.statusCode).toEqual(400);
        await db.removeId(id);
    });
});
