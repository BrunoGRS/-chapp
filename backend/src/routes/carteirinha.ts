import { Router } from "express";

import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import type { AuthenticatedRequest } from "../types";

const carteirinhaRouter = Router();

function formatMemberSince(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

carteirinhaRouter.get("/overview", requireAuth, async (req: AuthenticatedRequest, res) => {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const memberNumber = user.id.slice(0, 6).toUpperCase();
  const validUntil = "31/12/2026";
  const qrCode = `CHAPP|${user.id}|${user.email}|${validUntil}`;

  return res.json({
    updatedAt: new Date().toISOString(),
    status: "Ativa",
    clubName: "Associação Chapecoense de Futebol",
    memberName: user.name,
    memberNumber,
    planName: "Sócio Torcedor",
    memberSince: formatMemberSince(user.createdAt),
    validUntil,
    qrCode,
    actions: {
      exportLabel: "Exportar",
      copyLabel: "Copiar QR Code",
      removeLabel: "Remover Carteirinha",
    },
  });
});

export { carteirinhaRouter };
