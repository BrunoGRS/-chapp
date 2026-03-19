import bcrypt from "bcryptjs";
import { Router } from "express";

import { signUserToken } from "../lib/jwt";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import type { AuthenticatedRequest } from "../types";

const authRouter = Router();

function serializeUser(user: { id: string; name: string; email: string; updatedAt: Date }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    updatedAt: user.updatedAt.toISOString(),
  };
}

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email and password are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existingUser) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    },
  });

  const token = signUserToken({
    sub: user.id,
    email: user.email,
    name: user.name,
  });

  return res.status(201).json({
    token,
    user: serializeUser(user),
  });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signUserToken({
    sub: user.id,
    email: user.email,
    name: user.name,
  });

  return res.json({
    token,
    user: serializeUser(user),
  });
});

authRouter.get("/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({
    user: serializeUser(user),
  });
});

export { authRouter };
