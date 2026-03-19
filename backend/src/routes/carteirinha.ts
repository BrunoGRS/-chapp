import { Router } from "express";

import { requireAuth } from "../middleware/auth";
import type { AuthenticatedRequest } from "../types";

const carteirinhaRouter = Router();

carteirinhaRouter.get("/overview", requireAuth, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const memberNumber = req.user.id.slice(0, 6).toUpperCase();
  const validUntil = "31/12/2026";
  const qrCode = `CHAPP|${req.user.id}|${req.user.email}|${validUntil}`;

  return res.json({
    updatedAt: "2026-03-19T01:35:00.000Z",
    status: "Ativa",
    clubName: "Associacao Chapecoense de Futebol",
    memberName: req.user.name,
    memberNumber,
    planName: "Socio Torcedor",
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
