import { Request, Response } from "express";
import { signToken } from "../utils/jwt";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ message: "email and password required" });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email === adminEmail && password === adminPassword) {
    const token = signToken({ email, role: "admin" });
    return res.json({ token });
  }

  return res.status(401).json({ message: "Invalid credentials" });
}

export async function me(req: Request, res: Response) {
  // middleware `auth` sets `req.user`
  const user = (req as any).user ?? null;
  return res.json({ user });
}
