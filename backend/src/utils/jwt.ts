import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "please-change-this-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export function signToken(payload: Record<string, unknown>) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export type JwtPayload = ReturnType<typeof verifyToken>;
