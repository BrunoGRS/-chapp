import { Router } from "express";

import { requireAuth } from "../middleware/auth";

const historiaRouter = Router();

const historiaOverview = {
  clubName: "Associação Chapecoense de Futebol",
  foundedAt: "10 de maio de 1973",
  city: "Chapecó - SC",
  updatedAt: "2026-03-19T01:10:00.000Z",
  footerQuote: "Que a nossa história jamais seja esquecida.",
  timeline: [
    {
      year: "1973",
      title: "Fundação",
      description: "A Chapecoense nasce da união de clubes da cidade e inicia sua trajetória no futebol catarinense.",
    },
    {
      year: "2009",
      title: "Acesso à Série A",
      description: "A campanha de crescimento recoloca o clube no mapa nacional e projeta a Chape para a elite.",
    },
    {
      year: "2016",
      title: "Final da Sul-Americana",
      description: "A caminhada continental marca uma das páginas mais importantes da história alviverde.",
    },
    {
      year: "2017",
      title: "Reconstrução e Título",
      description: "O clube recomeça com coragem, homenagens e conquistas que simbolizam superação coletiva.",
    },
  ],
  achievements: [
    { label: "Campeonato Catarinense", value: "8x" },
    { label: "Copa Sul-Americana", value: "1x" },
    { label: "Brasileiro 2013", value: "1x" },
    { label: "Brasileiro Série B", value: "1x" },
  ],
};

historiaRouter.get("/overview", requireAuth, (_req, res) => {
  return res.json(historiaOverview);
});

export { historiaRouter };
