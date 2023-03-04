import request from "supertest";

import App from "../../src/app";
const app = new App()
describe("User routes", () => {
  test("Get all users", async () => {
    const res = await request(app.app).get("/api/users/12");
    expect(res.body).toEqual({message:"#12"});
  });
  test("Get all users", async () => {
    const res = await request(app.app).get("/api/users/12");
    expect(res.body).toEqual({message:"#12"});
  });
  test("Get all users", async () => {
    const res = await request(app.app).get("/api/users/12");
    expect(res.body).toEqual({message:"#12"});
  });
  test("Get all users", async () => {
    const res = await request(app.app).get("/api/users/12");
    expect(res.body).toEqual({message:"#12"});
  });
});