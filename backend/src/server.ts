import cors from "cors";
import express from "express";

import { env } from "./config/env";
import { prisma } from "./lib/prisma";
import { authRouter } from "./routes/auth";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  return res.json({ ok: true });
});

app.use("/auth", authRouter);

app.use((_req, res) => {
  return res.status(404).json({ message: "Not found" });
});

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`CHApp backend running on http://localhost:${env.port}`);
});

async function shutdown() {
  await prisma.$disconnect();
}

process.on("SIGINT", () => {
  void shutdown().finally(() => process.exit(0));
});

process.on("SIGTERM", () => {
  void shutdown().finally(() => process.exit(0));
});
