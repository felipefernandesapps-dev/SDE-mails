import request from "supertest";

// Must set env before importing app
process.env.ADMIN_EMAIL = "admin@example.com";
process.env.ADMIN_PASSWORD = "s3cret";
process.env.JWT_SECRET = "test-secret-change-me";

import app from "../src/server";

describe("Auth", () => {
  test("POST /api/auth/login returns token for valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "s3cret" })
      .expect(200);

    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
  });

  test("GET /api/auth/me without token returns 401", async () => {
    await request(app).get("/api/auth/me").expect(401);
  });

  test("GET /api/auth/me with token returns user payload", async () => {
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "s3cret" })
      .expect(200);

    const token = login.body.token;

    const me = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(me.body).toHaveProperty("user");
    expect(me.body.user).toHaveProperty("email", "admin@example.com");
  });
});
