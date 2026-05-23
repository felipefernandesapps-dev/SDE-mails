import request from "supertest";

// Set env before importing app
process.env.ADMIN_EMAIL = "admin@example.com";
process.env.ADMIN_PASSWORD = "s3cret";
process.env.JWT_SECRET = "test-secret-change-me";
process.env.ENCRYPTION_KEY = "test-key-32-bytes-length-!!!!!";

// Mock prisma module before importing app so controllers use the mock
jest.mock("../src/config/database", () => {
  return {
    __esModule: true,
    default: {
      configuracaoSmtp: {
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    },
  };
});

import app from "../src/server";
import prisma from "../src/config/database";

describe("Admin SMTP endpoints", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("POST /api/config/smtp without token returns 401", async () => {
    await request(app).post("/api/config/smtp").send({}).expect(401);
  });

  test("POST /api/config/smtp with invalid body returns 400", async () => {
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "s3cret" })
      .expect(200);

    const token = login.body.token;

    await request(app)
      .post("/api/config/smtp")
      .set("Authorization", `Bearer ${token}`)
      .send({ servidor: "a" })
      .expect(400);
  });

  test("GET /api/config/smtp when none exists returns 404", async () => {
    (prisma.configuracaoSmtp.findFirst as jest.Mock).mockResolvedValue(null);

    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "s3cret" })
      .expect(200);

    const token = login.body.token;

    await request(app)
      .get("/api/config/smtp")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });

  test("POST /api/config/smtp with valid body creates config and hides senha", async () => {
    (prisma.configuracaoSmtp.findFirst as jest.Mock).mockResolvedValue(null);

    const created = {
      id: 1,
      servidor: "smtp.example.com",
      porta: 587,
      usuario: "user@example.com",
      senha: "encrypted",
      horarioDisparoAniversario: "09:00",
      horarioDisparoProfissao: "10:00",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.configuracaoSmtp.create as jest.Mock).mockResolvedValue(created);

    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "s3cret" })
      .expect(200);

    const token = login.body.token;

    const res = await request(app)
      .post("/api/config/smtp")
      .set("Authorization", `Bearer ${token}`)
      .send({
        servidor: "smtp.example.com",
        porta: 587,
        usuario: "user@example.com",
        senha: "plainpass",
        horarioDisparoAniversario: "09:00",
        horarioDisparoProfissao: "10:00",
      })
      .expect(200);

    expect(res.body).not.toHaveProperty("senha");
    expect(res.body).toHaveProperty("servidor", "smtp.example.com");
  });
});
