import request from "supertest";

import App from "../src/app";
const app = new App()
describe("Test app.ts", () => {
  test("Catch-all route", async () => {
    const res = await request(app.app).get("/api/users/12");
    expect(res.body).toEqual({message:"#12"});
  });
});